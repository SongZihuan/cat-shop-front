<script setup lang="ts">
  import { isAdmin, isRootAdmin } from '@/store/admin'
  import { apiAdminGetXieyi, apiAdminPostUpdateXieyi } from '#/admin/xieyi'
  import Editor from '@/components/utils/editor.vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { RouteLocationNormalized } from 'vue-router'

  const router = useRouter()
  const route = useRoute()

  if (!isAdmin()) {
    router.push({
      path: '/system/error',
      query: {
        msg: '页面错误'
      }
    })
  }

  const xieyi = ref('')

  const getXieyi = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
    apiAdminGetXieyi().then((res) => {
      xieyi.value = res.data.data.xieyi
    })
    next()
  }
  onBeforeRouteUpdate(getXieyi)
  getXieyi(route, route, () => {})

  const updateXieYi = () => {
    ElMessageBox.confirm('是否确定更新协议', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      return apiAdminPostUpdateXieyi(xieyi.value).then((res) => {
        if (res.data.data.success) {
          ElMessage({
            type: 'success',
            message: '更新成功'
          })
          getXieyi(route, route, () => {})
        } else {
          ElMessage({
            type: 'error',
            message: '更新失败'
          })
        }
      })
    })
  }
</script>

<template>
  <el-card v-if="isRootAdmin()" class="base_card admin_root_main_base_card">
    <div class="out_side_box">
      <Editor v-model="xieyi" placeholder="请输入介绍信息" type="admin-xieyi"></Editor>
    </div>
    <!-- eslint-enable vue/v-on-event-hyphenation -->
    <template #footer>
      <div class="footer_box">
        <el-button size="large" type="success" plain @click="updateXieYi"> 更新 </el-button>
      </div>
    </template>
  </el-card>
  <div v-else></div>
</template>
<style scoped lang="scss">
  .base_card {
    width: auto;
    height: auto;
  }

  .footer_box {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  #clear {
    display: flex;
    justify-content: center;
  }
</style>
