<script setup lang="ts">
  import { ElMessage, ElMessageBox } from 'element-plus'
  import useUserStore, { isLogin, UserBase } from '@/store/user'
  import { isEmail } from '@/utils/str'

  const router = useRouter()
  const route = useRoute()

  const userStore = useUserStore()
  if (!isLogin()) {
    router.push({
      path: '/user/shop/login',
      query: {
        redirect: encodeURIComponent(route.fullPath)
      }
    })
  }

  const ub = ref({
    name: userStore.user.name,
    location: userStore.user.location,
    wechat: userStore.user.wechat,
    email: userStore.user.email
  } as UserBase)

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  const a = ref(getRandomInt(10))
  const b = ref(getRandomInt(10))
  const code = ref('')
  const answer = computed(() => a.value + b.value)
  const question = computed(() => `${a.value} + ${b.value}`)

  const resetCode = () => {
    a.value = getRandomInt(10)
    b.value = getRandomInt(10)
    code.value = ''
  }

  const hasChange = computed(() => {
    return (
      ub.value.name !== userStore.user.name ||
      ub.value.location !== userStore.user.location ||
      ub.value.wechat !== userStore.user.wechat ||
      ub.value.email !== userStore.user.email
    )
  })

  const codeCheck = computed(() => Number(code.value).valueOf() === answer.value)
  const checkName = computed(() => ub.value.name && ub.value.name.length > 0 && ub.value.name.length <= 10)
  const checkEmail = computed(() => {
    if (!ub.value.email) {
      return true
    }
    return isEmail(ub.value.email) && ub.value.email.length <= 40
  })
  const checkWeChat = computed(() => {
    if (!ub.value.wechat) {
      return true
    }
    return ub.value.wechat.length <= 40
  })
  const checkLocation = computed(() => {
    if (!ub.value.location) {
      return true
    }
    return ub.value.location.length <= 150
  })
  const allCheck = computed(
    () =>
      checkLocation.value &&
      checkWeChat.value &&
      codeCheck.value &&
      checkName.value &&
      checkEmail.value &&
      hasChange.value
  )

  const goHome = () => {
    router.push({
      path: '/user/center/profile'
    })
  }

  const update = () => {
    ElMessageBox.confirm('您是否确定更新你的用户信息', '提示', {
      confirmButtonText: '确定更新',
      cancelButtonText: '取消更新',
      type: 'warning'
    }).then(
      () => {
        return userStore.editData(ub.value).then(
          () => {
            ElMessage({
              type: 'success',
              message: '更新成功'
            })
            router.push({
              path: '/user/center/profile'
            })
          },
          () => {
            resetCode()
            ElMessage({
              type: 'error',
              message: '更新失败'
            })
          }
        )
      },
      () => resetCode()
    )
  }
</script>

<template>
  <el-card class="base_card">
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
          <el-text>验证码</el-text>
        </template>
        <el-input v-model="code" clearable>
          <template #append>
            <el-text>
              {{ question }}
            </el-text>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <div style="display: flex; width: 15vw; justify-content: center">
      <el-button-group>
        <el-button type="success" size="large" :disabled="!allCheck" plain @click="update"> 更新 </el-button>
        <el-button type="primary" size="large" @click="goHome"> 返回 </el-button>
      </el-button-group>
    </div>
    <div style="width: 15vw; margin-top: 5px">
      <div v-if="!codeCheck" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="请输入正确的验证码！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!checkName" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="名字需要在1-10位！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!checkEmail" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="请输入正确的邮箱（40字以内）！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!checkWeChat" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="请输入正确的微信（40字以内）！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!checkLocation" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="请输入正确的地址（150字以内）！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!hasChange" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="请编辑信息！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
  .base_card {
    --base-card-height: #{var(--custom-height)};
    --base-card-width: #{var(--custom-little-width)};
    max-width: #{var(--base-card-width)};
  }

  .tip_box {
    margin-top: 10px;
  }
</style>
