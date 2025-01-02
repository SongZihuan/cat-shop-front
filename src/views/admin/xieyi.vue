<script setup lang="ts">
  import { isAdmin, isRootAdmin } from '@/store/admin'
  import { apiAdminGetXieyi } from '#/admin/xieyi'
  import pushTo from '@/views/admin/router_push'
  import Showhtml from '@/components/utils/showhtml.vue'

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

  const getXieyi = () => {
    apiAdminGetXieyi().then((res) => {
      xieyi.value = res.data.data.xieyi
    })
  }
  getXieyi()

  const toEdit = () => {
    pushTo(router, route, '/admin/xieyi/edit')
  }
</script>

<template>
  <el-card v-if="isAdmin()" class="base_card admin_root_main_base_card">
    <div class="info_box">
      <div class="info_box">
        <Showhtml :content="xieyi"></Showhtml>
      </div>
    </div>
    <template #footer>
      <div class="footer_box">
        <el-button v-if="isRootAdmin()" size="large" type="primary" @click="toEdit"> 去编辑 </el-button>
      </div>
    </template>
  </el-card>
  <div v-else></div>
</template>

<style scoped lang="scss">
  .base_card {
    width: auto;
    max-width: min(98%, 50vw);
    min-width: 30vw;
  }

  .footer_box {
    display: flex;
    justify-content: right;
  }
</style>
