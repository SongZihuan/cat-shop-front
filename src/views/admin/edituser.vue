<script setup lang="ts">
  import { ElMessage, ElMessageBox } from 'element-plus'
  import useAdminUserStore, {
    AdminUser,
    AdminUserBase,
    AdminUserType,
    RootAdminUserStatus,
    AdminUserStatus,
    RootAdminUserTypeWithoutRoot
  } from '@/store/admin/user'
  import pushTo from '@/views/admin/router_push'
  import { hasPermission, isAdmin, isDeleteUser, isRootAdmin } from '@/store/admin'
  import { isEmail } from '@/utils/str'
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

  const userAdminStore = useAdminUserStore()

  const userId = ref(Number(route.query?.userId).valueOf() || 0)
  const user = ref(null as AdminUser | null)
  const userStatusLst = ref(isRootAdmin() ? RootAdminUserStatus : AdminUserStatus)
  const userTypeLst = ref(isRootAdmin() ? RootAdminUserTypeWithoutRoot : AdminUserType)

  const ub = ref({
    name: '',
    location: '',
    status: 1,
    wechat: '',
    email: '',
    type: 1
  } as AdminUserBase)

  const toBack = () => {
    pushTo(router, route, '/admin/user/list')
  }

  let timeoutID: NodeJS.Timeout | number | undefined = undefined
  const backSec = ref(6)
  const backTimer = () => {
    if (backSec.value == 0) {
      toBack()
      return
    }

    backSec.value -= 1
    timeoutID = setTimeout(backTimer, 1000)
  }

  onUnmounted(() => {
    timeoutID && clearTimeout(timeoutID)
  })

  const userIsRoot = ref(false)

  const onChangeUser = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
    userId.value = Number(to.query?.userId).valueOf() || 0
    user.value = null

    if (userId.value) {
      userAdminStore.getUser(userId.value).then(
        (res) => {
          user.value = res as AdminUser

          if (user.value.type === 3) {
            // 状态恢复
            user.value.status = 1
            ub.value = {
              name: res.name,
              location: res.location,
              status: 1,
              wechat: res.wechat,
              email: res.email,
              type: 3
            }
            userIsRoot.value = true
          } else {
            ub.value = {
              name: res.name,
              location: res.location,
              status: res.status,
              wechat: res.wechat,
              email: res.email,
              type: res.type
            }
            userIsRoot.value = false
          }

          if (isDeleteUser(user.value) || !hasPermission(user.value)) {
            backTimer()
          }

          if (!userStatusLst.value?.[user.value.status] || !userTypeLst.value?.[user.value.type]) {
            backTimer()
          }
        },
        () => {
          toBack()
        }
      )
    } else {
      toBack()
    }
    next()
  }

  onBeforeRouteUpdate(onChangeUser)
  onChangeUser(route, route, () => {})

  const hasChange = computed(() => {
    return (
      ub.value.type !== user.value?.type ||
      ub.value.name !== user.value?.name ||
      ub.value.location !== user.value?.location ||
      ub.value.status !== user.value?.status ||
      ub.value.wechat !== user.value?.wechat ||
      ub.value.email !== user.value?.email
    )
  })

  const deleteCheck = computed(() => !(user.value && user.value.status === 3 && ub.value.status !== 3))
  const rootAdminCheck = computed(() => !(user.value && user.value.type === 3 && ub.value.status !== 1))
  const checkName = computed(() => !ub.value.name || ub.value.name.length <= 10)
  const checkStatus = computed(() => !Object.keys(userStatusLst).some((v) => Number(v).valueOf() === ub.value.status))
  const checkType = computed(() => !Object.keys(userTypeLst).some((v) => Number(v).valueOf() === ub.value.type))
  const checkRootType = computed(() => (userIsRoot.value ? ub.value.type === 3 : true))
  const checkRootStatus = computed(() => (userIsRoot.value ? ub.value.status === 1 : true))
  const checkEmail = computed(() => {
    if (!ub.value.email) {
      return true
    }
    return isEmail(ub.value.email)
  })

  // checkRootType.value && checkRootStatus.value 不纳入检查
  const allCheck = computed(
    () =>
      checkType.value &&
      checkEmail.value &&
      checkStatus.value &&
      checkName.value &&
      hasChange.value &&
      rootAdminCheck.value &&
      deleteCheck.value
  )

  const update = () => {
    if (userIsRoot) {
      // 恒定值
      ub.value.type = 3
      ub.value.status = 1
    }

    ElMessageBox.confirm('您是否确定更新你的用户信息', '提示', {
      confirmButtonText: '确定更新',
      cancelButtonText: '取消更新',
      type: 'warning'
    }).then(() => {
      return userAdminStore.editData(userId.value, ub.value).then(
        () => {
          ElMessage({
            type: 'success',
            message: '更新成功'
          })
          onChangeUser(route, route, () => {})
        },
        () => {
          ElMessage({
            type: 'error',
            message: '更新失败'
          })
        }
      )
    })
  }
</script>

<template>
  <el-card v-if="user && isAdmin() && isDeleteUser(user)" class="base_card admin_root_main_base_card">
    <el-result icon="error" title="用户已被删除" sub-title="用户已被删除，无法修改其信息。">
      <template #extra>
        <el-button type="primary" @click="toBack">返回（{{ backSec > 5 ? 5 : backSec }}s）</el-button>
      </template>
    </el-result>
  </el-card>
  <el-card v-else-if="user && isAdmin() && !hasPermission(user)" class="base_clas admin_root_main_base_cards">
    <el-result icon="error" title="权限不足" sub-title="您的权限不足以修改他的用户喜喜。">
      <template #extra>
        <el-button type="primary" @click="toBack">返回（{{ backSec > 5 ? 5 : backSec }}s）</el-button>
      </template>
    </el-result>
  </el-card>
  <el-card v-else-if="user && isAdmin()" class="base_card admin_root_main_base_card">
    <el-form :model="ub" label-width="auto" style="width: 15vw">
      <el-form-item>
        <template #label>
          <el-text>昵称</el-text>
        </template>
        <el-input v-model="ub.name" maxlength="10" minlength="1" show-word-limit clearable />
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-text>微信</el-text>
        </template>
        <el-input v-model="ub.wechat" maxlength="30" show-word-limit clearable />
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-text>邮箱</el-text>
        </template>
        <el-input v-model="ub.email" maxlength="30" show-word-limit clearable />
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-text>地址</el-text>
        </template>
        <el-input v-model="ub.location" minlength="0" maxlength="150" show-word-limit />
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-text>状态</el-text>
        </template>
        <el-select v-if="userIsRoot" v-model="ub.status" placeholder="状态" size="large" :disabled="true">
          <el-option :key="1" label="正常" :value="1" />
        </el-select>
        <el-select
          v-else
          v-model="ub.status"
          placeholder="状态"
          size="large"
          :disabled="Object.keys(userStatusLst).length <= 1"
        >
          <el-option v-for="(item, i) in userStatusLst" :key="i" :label="item" :value="Number(i).valueOf()" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-text>类型</el-text>
        </template>
        <el-select v-if="userIsRoot" v-model="ub.type" placeholder="类型" size="large" :disabled="true">
          <el-option :key="3" label="根管理员" :value="3" />
        </el-select>
        <el-select
          v-else
          v-model="ub.type"
          placeholder="类型"
          size="large"
          :disabled="Object.keys(userTypeLst).length <= 1"
        >
          <el-option v-for="(item, i) in userTypeLst" :key="i" :label="item" :value="Number(i).valueOf()" />
        </el-select>
      </el-form-item>
    </el-form>
    <div style="display: flex; width: 15vw; justify-content: center">
      <el-button size="large" type="success" :disabled="!allCheck" plain @click="update"> 更新 </el-button>
    </div>
    <div style="width: 15vw; margin-top: 5px">
      <div v-if="!checkStatus" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="请输入正确的状态！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!checkType" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="请输入正确的类型！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!checkName" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="名字不能多于位！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!hasChange" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="请编辑信息！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!rootAdminCheck" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="根管理员状态错误！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!checkEmail" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="请输入正确的邮箱！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!deleteCheck" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="已删除的用户不能恢复！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!checkRootStatus" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="根用户状态错误！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!checkRootType" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="根用户类型错误！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
  .base_card {
    width: auto;
    max-width: 98%;
    min-width: 10vw;
  }

  .tip_box {
    margin-top: 10px;
  }
</style>
