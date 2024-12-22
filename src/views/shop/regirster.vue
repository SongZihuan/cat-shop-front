<script setup lang="ts">
import useUserStore, {isLogin} from "@/store/user"
import {isMobile} from "@/utils/str"
import {redirect} from "@/router"
import { ElMessage } from "element-plus"
import useConfigStore from "@/store/config"

const userStore = useUserStore()
const configStore = useConfigStore()

const route = useRoute()
const router = useRouter()

const goRedirect = () => {
  const redirectPath = route.query?.[redirect]
  if (typeof redirectPath === "string" && redirectPath.length > 0) {
    const p = decodeURIComponent(redirectPath)
    if (p.startsWith("http")) {
      window.open(p)
    } else {
      window.location.href = window.location.origin + p
    }
  } else {
    router.push({
      "path": "/home",
    })
  }
}

watch(() => isLogin(), (value) => {
  if (value) {
    goRedirect()
  }
})

if (isLogin()) {
  goRedirect()
}

const form = ref({
  phone: "",
  password: "",
  passwordDouble: "",
  code: "",
})

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}

const a = ref(getRandomInt(10))
const b = ref(getRandomInt(10))

const resetCode = () => {
  a.value = getRandomInt(10)
  b.value = getRandomInt(10)
  form.value.code = ""
}

const answer = computed(() => a.value + b.value)
const question = computed(() => `${a.value} + ${b.value}`)

const codeCheck = computed(() => Number(form.value.code).valueOf() === answer.value)
const phoneCheck = computed(() => isMobile(form.value.phone))
const passwordCheck = computed(() => form.value.password.length >= 8)
const doublePasswordCheck = computed(() => form.value.password === form.value.passwordDouble)
const allCheck = computed(() => codeCheck.value && phoneCheck.value && passwordCheck.value && doublePasswordCheck.value && accept.value)

const register = () => {
  if (!allCheck.value) {
    return
  }

  userStore.register(form.value.phone, form.value.password).then(() => {
    if (isLogin()) {
      goRedirect()
    } else {
      router.push({
        path: "/shop/login",
        query: {
          redirect: encodeURIComponent(route.fullPath)
        }
      })
    }
  }, () => {
    resetCode()
    ElMessage({
      type: "error",
      message: "登录失败，请检查手机号或者密码",
    })
  })
}

const accept = ref(false)
const acceptModel = ref(false)

const openXieyi = () => {
  acceptModel.value = true
}

const acceptXieyi = () => {
  acceptModel.value = false
  accept.value = true
}

const notAcceptXieyi = () => {
  acceptModel.value = false
  accept.value = false
}

</script>

<template>
  <div v-if="!isLogin()" style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <el-card style="display: flex; max-width: 75%; justify-content: center; margin-top: 10px">
      <el-form :model="form" label-width="auto" style="width: 15vw">
        <el-form-item>
          <template #label>
            <el-text>手机号</el-text>
          </template>
          <el-input
              v-model="form.phone"
              maxlength="20"
              minlength="1"
              show-word-limit
              clearable
          />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>密码</el-text>
          </template>
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>再次密码</el-text>
          </template>
          <el-input v-model="form.passwordDouble" type="password" show-password />
        </el-form-item>
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
        <el-button :disabled="!allCheck" @click="register">
          注册并登录
        </el-button>
      </div>
      <div style="width: 15vw; margin-top: 5px">
        <div v-if="!codeCheck" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的验证码！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
        <div v-if="!phoneCheck" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的手机号！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
        <div v-if="!passwordCheck" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="密码必须长度大于8！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
        <div v-if="!doublePasswordCheck" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="两次输入密码不正确！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
        <div v-if="!accept" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请同意用户协议！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
      </div>
    </el-card>
  </div>
  <div v-else></div>

  <el-dialog
      v-model="acceptModel"
      style="width: 50vw; height: 70vh"
  >
    <template #title>
      <div style="display: flex; justify-content: center; height: 10vh">
        <el-text style="font-size: 0.8vw; font-weight: bold"> 用户协议 </el-text>
      </div>
    </template>

    <el-scrollbar height="48vh">
      <div id="info_box" class="info_box">
        <div v-html="configStore.xieyi"></div>
      </div>
    </el-scrollbar>

    <template #footer>
      <div style="display: flex; justify-content: right">
        <el-button-group>
          <el-button type="info" size="large" @click="notAcceptXieyi">
            不同意
          </el-button>
          <el-button type="success" size="large" @click="acceptXieyi">
            同意
          </el-button>
        </el-button-group>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.tip_box {
  margin-top: 5px;
}
.xieyi_checkbox {
  vertical-align: middle;
}
.xieyi_text{
  vertical-align: middle;
  cursor: pointer;
}
.xieyi_text:hover{
  text-decoration: underline;
}
.xieyi_text:active{
  color: #2448aa;
}
#info_box * {
  all: initial;
  width: 100%;
}
</style>