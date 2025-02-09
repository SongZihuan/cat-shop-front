<script setup lang="ts">
  import { ElMessage, ElMessageBox } from 'element-plus'
  import useAdminUserStore, { AdminUserStatus, AdminUserType, RootAdminUserTypeWithoutRoot } from '@/store/admin/user'
  import { isAdmin, isRootAdmin } from '@/store/admin'
  import { isEmail, isMobile } from '@/utils/str'
  import { NewUserData } from '#/admin/user'

  const router = useRouter()

  if (!isAdmin()) {
    router.push({
      path: '/system/error',
      query: {
        msg: '页面错误'
      }
    })
  }

  const userAdminStore = useAdminUserStore()

  const ub = ref({
    name: '',
    wechat: '',
    email: '',
    location: '',
    status: 1,
    type: 1,
    phone: '',
    password: ''
  } as NewUserData)

  const userStatusLst = ref(AdminUserStatus) // 创建新用户status不能是delete
  const userTypeLst = ref(isRootAdmin() ? RootAdminUserTypeWithoutRoot : AdminUserType)

  const checkName = computed(() => !ub.value.name || ub.value.name.length <= 10)
  const checkStatus = computed(() => !Object.keys(userStatusLst).some((v) => Number(v).valueOf() === ub.value.status))
  const checkType = computed(() => !Object.keys(userTypeLst).some((v) => Number(v).valueOf() === ub.value.type))
  const phoneCheck = computed(() => isMobile(ub.value.phone))
  const passwordCheck = computed(() => ub.value.password.length >= 8)
  const checkEmail = computed(() => {
    if (!ub.value.email) {
      return true
    }
    return isEmail(ub.value.email)
  })
  const allCheck = computed(
    () =>
      checkType.value &&
      checkEmail.value &&
      checkStatus.value &&
      checkName.value &&
      phoneCheck.value &&
      passwordCheck.value
  )

  const update = () => {
    ElMessageBox.confirm('是否确定添加新用户', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      return userAdminStore.newUser(ub.value).then(
        () => {
          ElMessage({
            type: 'success',
            message: '更新成功'
          })
          ub.value = {
            name: '',
            phone: '',
            password: '',
            location: '',
            status: 1,
            type: 1,
            wechat: '',
            email: ''
          }
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
  <el-card v-if="isAdmin()" class="base_card admin_root_main_base_card">
    <el-form :model="ub" label-width="auto" style="width: 15vw">
      <el-form-item>
        <template #label>
          <el-text>手机号</el-text>
        </template>
        <el-input v-model="ub.phone" maxlength="20" minlength="1" show-word-limit clearable />
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-text>密码</el-text>
        </template>
        <el-input v-model="ub.password" type="password" show-password />
      </el-form-item>
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
        <el-select
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
        <el-select v-model="ub.type" placeholder="类型" size="large" :disabled="Object.keys(userTypeLst).length <= 1">
          <el-option v-for="(item, i) in userTypeLst" :key="i" :label="item" :value="Number(i).valueOf()" />
        </el-select>
      </el-form-item>
    </el-form>
    <div style="display: flex; width: 15vw; justify-content: center">
      <el-button size="large" type="success" :disabled="!allCheck" plain @click="update"> 添加 </el-button>
    </div>
    <div style="width: 15vw; margin-top: 5px">
      <div v-if="!checkStatus" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="请输入正确的状态！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!checkType" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="请输入正确的类型！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!checkName" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="名字不能多于10位！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!phoneCheck" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="请输入正确的手机号！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!checkEmail" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="请输入正确的邮箱！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!passwordCheck" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="密码必须长度大于8！" :closable="false" type="warning" center show-icon> </el-alert>
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
