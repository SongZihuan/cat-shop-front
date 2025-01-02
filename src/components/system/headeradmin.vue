<script setup lang="ts">
  import useConfigStore from '@/store/config'
  import UserTitleAdmin from '@/components/system/usertitleadmin.vue'
  import pushTo from '@/views/admin/router_push'

  const router = useRouter()
  const route = useRoute()

  const title = computed(() => (route.meta?.title ? route.meta.title : ''))
  const configStore = useConfigStore()

  const toHome = () => {
    router.push({
      path: '/user/shop/home'
    })
  }

  const toCenter = () => {
    pushTo(router, route, '/admin/user/list')
  }
</script>

<template>
  <div class="header">
    <el-page-header icon="">
      <template #title>
        <div style="display: flex; justify-content: left">
          <div class="title_box">
            <span @click="toHome">
              <el-icon class="title"><ArrowLeftBold /></el-icon>
              <el-text class="title">{{ configStore.config?.name }}</el-text>
            </span>
            <span @click="toCenter">
              <el-avatar class="avatar_logo" :src="configStore.config.logo" fit="fill"></el-avatar>
              <el-text class="title"> 管理后台 </el-text>
            </span>
          </div>
        </div>
      </template>

      <template #content>
        <el-text class="subtitle">
          {{ title }}
        </el-text>
      </template>

      <template #extra>
        <div style="display: flex">
          <UserTitleAdmin class="extrainfo"></UserTitleAdmin>
        </div>
      </template>
    </el-page-header>
  </div>
</template>

<style scoped lang="scss">
  .header {
    height: 10vh;
    max-height: 10vh;
    min-height: 10vh;

    background-color: royalblue;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  #logo {
    float: left;
  }

  .gokefu {
    color: white;
    cursor: pointer;
  }

  .gokefu:hover {
    text-decoration: underline;
  }

  .gokefu:active {
    color: cornflowerblue;
    text-decoration: underline;
  }

  .avatar_logo {
    height: 8vh;
    width: 8vh;
    margin-left: 5px;
    margin-right: 5px;
    vertical-align: middle;
  }

  .title {
    font-size: 4vh;
    color: white;
    font-weight: bold;
    vertical-align: middle;
  }

  .subtitle {
    font-size: 2vh;
    font-weight: normal;
    margin-left: 5px;
    vertical-align: middle;
    color: gainsboro;
  }

  .title_box {
    padding-top: 1vh;
  }

  .extrainfo {
    font-size: 2vh;
    margin-right: 10px;
    vertical-align: middle;
  }
</style>
