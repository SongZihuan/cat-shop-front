<script setup lang="ts">
  import { Edit } from '@element-plus/icons-vue'
  import { ElMessage, UploadFile, UploadInstance } from 'element-plus'

  const router = useRouter()

  const props = defineProps({
    accept: {
      type: String,
      required: false,
      default: ''
    },
    maxsizekb: {
      type: Number,
      required: false,
      default: 500
    }
  })

  const accept = computed(() => props.accept)
  const maxsizekb = computed(() => props.maxsizekb)

  const pictureLst = ref([])
  const pictureUpload = ref<UploadInstance>()
  const newPic = ref(null as UploadFile | null)

  const startPicture = () => {
    pictureUpload.value && pictureUpload.value.$el.querySelector('input').click()
  }

  const updatePicture = (pic: UploadFile) => {
    if (!pictureUpload.value) {
      return
    }

    if (pic.status !== 'ready') {
      return
    }

    if (!pic || !pic.size || !pic.raw) {
      ElMessage({
        type: 'warning',
        message: '请上传图片'
      })
      return
    }

    if (pic.size > 500000) {
      // 500KB
      ElMessage({
        type: 'warning',
        message: '文件过大'
      })
      return
    }

    newPic.value = pic

    if (pictureLst.value.length === 1) {
      pictureUpload.value.handleRemove(pictureLst.value[0])
    }

    ElMessage({
      type: 'success',
      message: '图片上传成功'
    })
  }

  const deletePicture = () => {
    if (pictureLst.value.length === 1) {
      pictureUpload.value && pictureUpload.value.handleRemove(pictureLst.value[0])
    } else if (pictureLst.value.length > 1) {
      router.push({
        path: '/system/error',
        query: {
          msg: '文件上传错误'
        }
      })
      return
    }

    newPic.value = null
  }

  defineExpose({
    deletePicture,
    updatePicture,
    pic: newPic
  })
</script>

<template>
  <el-tooltip effect="dark" placement="bottom">
    <el-button type="primary" @click="startPicture">
      <el-icon><Edit /></el-icon>
      {{ newPic ? '重新上传' : '点击上传' }}
    </el-button>
    <template #content>
      <el-text style="color: white"> 仅限jpg/png文件，不超过{{ maxsizekb }}KB</el-text>
    </template>
  </el-tooltip>
  <el-upload
    v-show="false"
    ref="pictureUpload"
    v-model:file-list="pictureLst"
    action="#"
    :accept="accept"
    :auto-upload="false"
    :multiple="false"
    :limit="2"
    :show-file-list="false"
    :on-change="updatePicture"
  >
  </el-upload>
</template>

<style scoped lang="scss"></style>
