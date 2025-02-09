<script setup lang="ts">
  import { ElMessage, ElMessageBox } from 'element-plus'
  import useAdminUserStore, { AdminUser } from '@/store/admin/user'
  import { hasPermission, isAdmin, isDeleteUser } from '@/store/admin'
  import pushTo from '@/views/admin/router_push'
  import { isMobile } from '@/utils/str'
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

  const userAdminStore = useAdminUserStore()

  const userId = ref(Number(route.query?.userId).valueOf() || 0)
  const user = ref(null as AdminUser | null)

  const form = ref({
    newPhone: ''
  } as { newPhone: string })

  const onChangeUser = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
    userId.value = Number(to.query?.userId).valueOf() || 0
    user.value = null

    if (userId.value) {
      userAdminStore.getUser(userId.value).then(
        (res) => {
          user.value = res as AdminUser
          form.value.newPhone = user.value.phone
          if (isDeleteUser(user.value) || !hasPermission(user.value)) {
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

  const hasChange = computed(() => form.value.newPhone !== user.value?.phone)
  const phoneCheck = computed(() => isMobile(form.value.newPhone))
  const allCheck = computed(() => phoneCheck.value && hasChange.value)

  const update = () => {
    ElMessageBox.confirm('您确定要重置用户手机号吗？', '提示', {
      confirmButtonText: '确定更新',
      cancelButtonText: '取消更新',
      type: 'warning'
    }).then(() => {
      return userAdminStore.editPhone(userId.value, form.value).then(
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
  <el-card v-else-if="user && isAdmin() && !hasPermission(user)" class="base_card admin_root_main_base_card">
    <el-result icon="error" title="权限不足" sub-title="您的权限不足以修改他的用户喜喜。">
      <template #extra>
        <el-button type="primary" @click="toBack">返回（{{ backSec > 5 ? 5 : backSec }}s）</el-button>
      </template>
    </el-result>
  </el-card>
  <el-card v-else-if="user && isAdmin()" class="base_card admin_root_main_base_card">
    <el-form-item>
      <template #label>
        <el-text>新手机号</el-text>
      </template>
      <el-input v-model="form.newPhone" maxlength="20" minlength="1" show-word-limit clearable />
    </el-form-item>
    <div style="display: flex; width: 15vw; justify-content: center">
      <el-button size="large" type="success" :disabled="!allCheck" plain @click="update"> 更新 </el-button>
    </div>
    <div style="width: 15vw; margin-top: 5px">
      <div v-if="!phoneCheck" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="请输入正确的手机号！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!hasChange" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="请编辑信息！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
    </div>
  </el-card>
  <div v-else></div>
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
