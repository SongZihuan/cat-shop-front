<script setup lang="ts">
  import { isAdmin, isRootAdmin } from '@/store/admin'
  import { apiAdminGetXieyi, apiAdminPostUpdateXieyi } from '#/admin/xieyi'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import { IToolbarConfig } from '@wangeditor/editor'
  import { IEditorConfig } from '@wangeditor/editor'
  import '@wangeditor/editor/dist/css/style.css'
  import { apiAdminPostUploadImageUrl, apiAdminPostUploadVideoUrl } from '#/admin/file'
  import { getXtoken } from '@/store/user'
  import { ElMessage } from 'element-plus'

  const router = useRouter()

  if (!isAdmin()) {
    router.push({
      path: '/system/error',
      query: {
        msg: '页面错误'
      }
    })
  }

  const editorRef = shallowRef()
  const toolbarConfig: Partial<IToolbarConfig> = {}
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入介绍信息...',
    MENU_CONF: {
      uploadImage: {
        server: apiAdminPostUploadImageUrl(),
        fieldName: 'image',
        maxFileSize: 2 * 1024 * 1024,
        headers: {
          'X-Token': getXtoken(),
          Accept: 'application/json'
        },
        meta: {
          type: 'admin-xieyi'
        }
      },
      uploadVideo: {
        server: apiAdminPostUploadVideoUrl(),
        fieldName: 'video',
        maxFileSize: 10 * 1024 * 1024,
        headers: {
          'X-Token': getXtoken(),
          Accept: 'application/json'
        },
        meta: {
          type: 'admin-xieyi'
        }
      }
    }
  }

  onBeforeUnmount(() => {
    editorRef.value && editorRef.value.destroy()
  })
  const editorMode = ref('default')

  const handleEditCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
  }

  const xieyi = ref('')

  const getXieyi = () => {
    apiAdminGetXieyi().then((res) => {
      xieyi.value = res.data.data.xieyi
    })
  }
  getXieyi()

  const updateXieYi = () => {
    apiAdminPostUpdateXieyi(xieyi.value).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: '更新成功'
        })
        getXieyi()
      } else {
        ElMessage({
          type: 'error',
          message: '更新失败'
        })
      }
    })
  }
</script>

<template>
  <el-card v-if="isRootAdmin()" class="base_card admin_root_main_base_card">
    <div style="width: 100%; height: 100%; margin-top: 18px">
      <Clear style="width: 100%; height: 90%; margin-top: 18px">
        <div id="dialogBox" style="width: 100%; height: 100%; display: flex; justify-content: center">
          <div id="editorBox">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorRef"
              :default-config="toolbarConfig"
              :mode="editorMode"
            />
            <!-- eslint-disable vue/v-on-event-hyphenation -->
            <Editor
              v-model="xieyi"
              style="height: 80%; overflow-y: hidden"
              :default-config="editorConfig"
              :mode="editorMode"
              @onCreated="handleEditCreated"
            />
            <!-- eslint-enable vue/v-on-event-hyphenation -->
          </div>
        </div>
      </Clear>
      <div style="width: 100%; display: flex; justify-content: center">
        <el-button type="success" size="large" @click="updateXieYi"> 提交 </el-button>
      </div>
    </div>
  </el-card>
  <div v-else></div>
</template>
<style scoped lang="scss">
  #editorBox {
    border-style: solid;
    border-width: 1px;
    border-color: black;
    height: 95%;
    width: 95%;
  }
</style>
