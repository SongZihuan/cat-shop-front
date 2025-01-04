<script setup lang="ts">
  import useUserStore, { isLogin, hasLoad } from '@/store/user'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import useConfigStore from '@/store/config'

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
      path: '/admin/user/list'
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
          {{ userStore.user?.name || '管理员' }} - {{ userStore.user?.phone || '000-0000-0000' }}
          <el-icon class="el-icon--right" style="margin-right: 10px">
            <arrow-down />
          </el-icon>
          <el-avatar class="user_avatar" shape="square" size="large" :src="userStore.user?.avatar" @click="toCenter" />
        </el-text>
        <template #dropdown>
          <el-dropdown-menu class="drop_menu">
            <el-dropdown-item @click="toHome"><el-text>主页</el-text></el-dropdown-item>
            <el-dropdown-item @tclick="toCenter"><el-text>我的中心</el-text></el-dropdown-item>
            <el-dropdown-item v-if="userStore.user.type !== 1" @click="toAdmin"
              ><el-text>管理后台</el-text></el-dropdown-item
            >
            <el-dropdown-item @click="logout"><el-text>退出登录</el-text></el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <div v-else>
    <el-button-group>
      <el-button size="large" type="primary"> </el-button>
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
    color: white;
    font-size: 2.3vh;
  }
  .drop_item {
    font-size: 0.6vw;
  }
  .custom-dropdown:focus-visible {
    outline: unset;
  }
</style>
