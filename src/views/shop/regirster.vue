<script setup lang="ts">
  import useUserStore, { isLogin } from '@/store/user'
  import { isMobile } from '@/utils/str'
  import { redirect } from '@/router'
  import Showyonghuxieyi from '@/components/utils/shouyonghuxieyi.vue'

  const userStore = useUserStore()

  const route = useRoute()
  const router = useRouter()

  const toLogin = () => {
    router.push({
      path: '/user/shop/login',
      query: route.query
    })
  }

  const goRedirect = () => {
    const redirectPath = route.query?.[redirect]
    if (typeof redirectPath === 'string' && redirectPath.length > 0) {
      const p = decodeURIComponent(redirectPath)
      if (p.startsWith('http')) {
        window.open(p)
      } else {
        window.location.href = window.location.origin + p
      }
    } else {
      router.push({
        path: '/home'
      })
    }
  }

  watch(
    () => isLogin(),
    (value) => {
      if (value) {
        goRedirect()
      }
    }
  )

  if (isLogin()) {
    goRedirect()
  }

  const form = ref({
    phone: '',
    password: '',
    passwordDouble: '',
    code: ''
  })

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  const a = ref(getRandomInt(10))
  const b = ref(getRandomInt(10))

  const resetCode = () => {
    a.value = getRandomInt(10)
    b.value = getRandomInt(10)
    form.value.code = ''
  }

  const answer = computed(() => a.value + b.value)
  const question = computed(() => `${a.value} + ${b.value}`)

  const codeCheck = computed(() => Number(form.value.code).valueOf() === answer.value)
  const phoneCheck = computed(() => isMobile(form.value.phone))
  const passwordCheck = computed(() => form.value.password.length >= 8)
  const doublePasswordCheck = computed(() => form.value.password === form.value.passwordDouble)
  const allCheck = computed(
    () => codeCheck.value && phoneCheck.value && passwordCheck.value && doublePasswordCheck.value && accept.value
  )

  const register = () => {
    if (!allCheck.value) {
      return
    }

    userStore.register(form.value.phone, form.value.password).then(
      () => {
        if (isLogin()) {
          goRedirect()
        } else {
          router.push({
            path: '/user/shop/login',
            query: {
              redirect: encodeURIComponent(route.fullPath)
            }
          })
        }
      },
      () => {
        resetCode()
      }
    )
  }

  const accept = ref(false)
  const xieyiVisibility = ref()

  const openXieyi = () => {
    xieyiVisibility.value && xieyiVisibility.value.open()
  }

  const userConfirm = (res: boolean) => {
    accept.value = res
  }
</script>

<template>
  <el-card v-if="!isLogin()" class="base_card">
    <div class="box">
      <div>
        <el-form :model="form" label-width="auto" style="width: 15vw">
          <el-form-item>
            <template #label>
              <el-text>手机号</el-text>
            </template>
            <el-input v-model="form.phone" maxlength="20" minlength="1" show-word-limit clearable />
          </el-form-item>
          <el-form-item>
            <template #label>
              <el-text>密码</el-text>
            </template>
            <el-input v-model="form.password" type="password" show-password />
          </el-form-item>
          <el-tooltip effect="dark" placement="bottom" content="请再次输入密码已确保准确性">
            <el-form-item>
              <template #label>
                <el-text>密码</el-text>
              </template>
              <el-input v-model="form.passwordDouble" type="password" show-password />
            </el-form-item>
          </el-tooltip>
          <el-form-item>
            <template #label>
              <el-text>验证码</el-text>
            </template>
            <el-input v-model="form.code" clearable>
              <template #append>
                <el-text>
                  {{ question }}
                </el-text>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        <div style="display: flex; width: 15vw; justify-content: center; margin-top: 10px">
          <div>
            <el-checkbox v-model="accept" class="xieyi_checkbox" label="我同意" size="large" />
            <el-text class="xieyi_text" @click="openXieyi"> 用户协议 </el-text>
          </div>
        </div>
        <div style="display: flex; width: 15vw; justify-content: center; margin-top: 10px">
          <el-button-group>
            <el-button type="success" :disabled="!allCheck" @click="register"> 注册并登录 </el-button>
            <el-button v-if="!allCheck" type="primary" @click="toLogin"> 已有账号？直接登录 </el-button>
          </el-button-group>
        </div>
        <div style="width: 15vw; margin-top: 5px">
          <div v-if="!codeCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请输入正确的验证码！" :closable="false" type="warning" center show-icon> </el-alert>
          </div>
          <div v-if="!phoneCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请输入正确的手机号！" :closable="false" type="warning" center show-icon> </el-alert>
          </div>
          <div v-if="!passwordCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="密码必须长度大于8！" :closable="false" type="warning" center show-icon> </el-alert>
          </div>
          <div v-if="!doublePasswordCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="两次输入密码不正确！" :closable="false" type="warning" center show-icon> </el-alert>
          </div>
          <div v-if="!accept" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请同意用户协议！" :closable="false" type="warning" center show-icon> </el-alert>
          </div>
        </div>
      </div>
    </div>
  </el-card>
  <div v-else></div>

  <Showyonghuxieyi ref="xieyiVisibility" @confirm="userConfirm"></Showyonghuxieyi>
</template>

<style scoped lang="scss">
  .base_card {
    --base-card-height: #{var(--custom-height)};
    --base-card-width: #{var(--custom-little-width)};
    --base-card-min-width: #{var(--custom-min-width)};
    max-height: #{var(--base-card-height)};
    max-width: #{var(--base-card-width)};
  }

  .box {
    display: flex;
    justify-content: center;
  }

  .tip_box {
    margin-top: 10px;
  }
  .xieyi_checkbox {
    vertical-align: middle;
  }
  .xieyi_text {
    vertical-align: middle;
    cursor: pointer;
  }
  .xieyi_text:hover {
    text-decoration: underline;
  }
  .xieyi_text:active {
    color: #2448aa;
  }
</style>
