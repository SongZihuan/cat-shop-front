<script setup lang="ts">
  import { isAdmin, isRootAdmin } from '@/store/admin'
  import { apiAdminGetXieyi } from '#/admin/xieyi'
  import pushTo from '@/views/admin/router_push'
  import { RouteLocationNormalized } from 'vue-router'
  import Showyonghuxieyi from '@/components/utils/shouyonghuxieyi.vue'
  import { ElMessage } from 'element-plus'

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

  const toEdit = () => {
    pushTo(router, route, '/admin/xieyi/edit')
  }

  const xieyiVisibility = ref()
  const openUser = () => {
    xieyiVisibility.value && xieyiVisibility.value.open()
  }

  const userConfirm = (res: boolean) => {
    if (res) {
      ElMessage({
        type: 'success',
        message: `已选择同意。`
      })
    } else {
      ElMessage({
        type: 'warning',
        message: `已选择拒绝。`
      })
    }
  }
</script>

<template>
  <div v-if="isAdmin()" class="base_card admin_root_main_base_card">
    <Showxieyi title="用户协议" :content="xieyi" footer preview>
      <div class="footer_box">
        <el-button-group>
          <el-button :disabled="!isRootAdmin()" size="large" type="primary" plain @click="toEdit"> 去编辑 </el-button>
          <el-button size="large" type="success" plain @click="openUser"> 模拟用户查看 </el-button>
        </el-button-group>
      </div>
    </Showxieyi>
  </div>
  <div v-else></div>

  <Showyonghuxieyi ref="xieyiVisibility" @confirm="userConfirm"></Showyonghuxieyi>
</template>

<style scoped lang="scss">
  .base_card {
    width: auto;
    max-width: min(98%, 60vw);
    min-width: 30vw;
  }

  .footer_box {
    display: flex;
    justify-content: right;
  }
</style>
