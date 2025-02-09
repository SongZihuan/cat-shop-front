<script setup lang="ts">
  import useUserStore, { isLogin, hasLoad } from '@/store/user'
  import useConfigStore from '@/store/config'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { maskPhoneNumber } from '@/utils/str'

  const configStore = useConfigStore()
  const userStore = useUserStore()

  const router = useRouter()
  const route = useRoute()

  const toHome = () => {
    router.push({
      path: '/user/shop/home'
    })
  }

  const toCenter = () => {
    router.push({
      path: '/user/center/profile'
    })
  }

  const toAdmin = () => {
    if (userStore.user.type === 1) {
      ElMessage({
        type: 'error',
        message: '您没有权限访问管理后台'
      })
      return
    }

    router.push({
      path: '/admin/user'
    })
  }

  const toBuyRecord = () => {
    router.push({
      path: '/user/center/buyrecordlist'
    })
  }

  const toBag = () => {
    router.push({
      path: '/user/center/shoppingbag'
    })
  }

  const toKefu = () => {
    router.push({
      path: '/system/kefu'
    })
  }

  const toAboutUs = () => {
    router.push({
      path: '/system/aboutus'
    })
  }

  const toLogin = () => {
    router.push({
      path: '/user/shop/login',
      query: {
        redirect: encodeURIComponent(route.fullPath)
      }
    })
  }

  const toNewLogin = () => {
    if (route.meta.xauth && route.meta.xauth === true) {
      router.push({
        path: '/user/shop/login',
        query: {
          redirect: encodeURIComponent(route.fullPath)
        }
      })
    }
  }

  const toRegirster = () => {
    router.push({
      path: '/user/shop/regirster',
      query: {
        redirect: encodeURIComponent(route.fullPath)
      }
    })
  }

  const logout = () => {
    if (isLogin()) {
      ElMessageBox.confirm(`是否确认退出${configStore.config?.name}账号？`, '温馨提示', {
        confirmButtonText: '确认退出',
        cancelButtonText: '暂不退出',
        type: 'warning'
      })
        .then(() => {
          return userStore.logout()
        })
        .then(() => {
          ElMessage({
            type: 'success',
            message: '账号退出成功'
          })
          toNewLogin()
        })
    }
  }
</script>

<template>
  <div v-if="isLogin() && !hasLoad()">
    <div>
      <el-text style="font-size: 0.8vw"> 正在加载中...请稍后 </el-text>
    </div>
  </div>
  <div v-else-if="isLogin() && hasLoad()">
    <div class="user_name">
      <el-dropdown size="large" class="dropdown">
        <el-text class="user_name_text custom-dropdown">
          <el-icon v-if="userStore.user.type === 1"><User /></el-icon>
          <el-icon v-else><HomeFilled /></el-icon>
          {{ userStore.user?.name || '新用户' }} - {{ maskPhoneNumber(userStore.user?.phone) || '000-0000-0000' }}
          <el-icon class="el-icon--right" style="margin-right: 10px">
            <arrow-down />
          </el-icon>
          <el-avatar class="user_avatar" shape="square" size="large" :src="userStore.user?.avatar" @click="toHome" />
        </el-text>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="toHome"><el-text>主页</el-text></el-dropdown-item>
            <el-dropdown-item @click="toCenter"><el-text>我的中心</el-text></el-dropdown-item>
            <el-dropdown-item v-if="userStore.user.type !== 1" @cclick="toAdmin" @click="toAdmin"
              ><el-text>管理后台</el-text></el-dropdown-item
            >
            <el-dropdown-item @click="toBuyRecord"><el-text>购物记录</el-text></el-dropdown-item>
            <el-dropdown-item @click="toBag"><el-text>购物车</el-text></el-dropdown-item>
            <el-dropdown-item @click="toKefu"><el-text>联系客服</el-text></el-dropdown-item>
            <el-dropdown-item @click="toAboutUs"
              ><el-text>关于{{ configStore.config?.name }}</el-text></el-dropdown-item
            >
            <el-dropdown-item @click="logout"><el-text>退出登录</el-text></el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <div v-else>
    <el-button-group>
      <el-button size="large" type="primary" @click="toLogin"> 登录 </el-button>
      <el-button size="large" type="success" @click="toRegirster"> 注册 </el-button>
      <el-button size="large" type="warning" @click="toKefu"> 客服 </el-button>
      <el-button size="large" type="info" @click="toAboutUs"> 关于{{ configStore.config?.name }} </el-button>
    </el-button-group>
  </div>
</template>

<style scoped lang="scss">
  .user_name {
    display: inline-block;
    padding-right: 10px;
    vertical-align: middle;
  }

  .user_avatar {
    vertical-align: middle;
    cursor: pointer;
  }

  .user_name_text {
    font-size: 2.3vh;
  }
  .drop_item {
    font-size: 0.6vw;
  }
  .custom-dropdown:focus-visible {
    outline: unset;
  }
</style>
