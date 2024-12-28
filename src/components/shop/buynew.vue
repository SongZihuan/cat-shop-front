<script setup lang="ts">
import { ElMessage } from "element-plus"
import {apiPostAliNewPay, apiPostAliNewPayWithShop, LocationForUser, apiPostWechatNewPay, apiPostWechatNewPayWithShop} from "#/center/pay"
import {Wupin} from "@/store/hotwupin"
import useUserStore from "@/store/user"
import {isEmail, isMobile} from "@/utils/str"
import {getFacePrice, getTotalPrice} from "@/utils/price"
import {ShopRecord} from "#/center/shoppingbag"

const wupin = ref({} as Wupin)
const num = ref(1 as number)
const shoprecord = ref({} as ShopRecord | null)

const facePrice = computed(() => {
  return getFacePrice(wupin.value?.hotPrice, wupin.value?.realPrice)
})
const totalPrice = computed(() => {
  return getTotalPrice(wupin.value?.hotPrice, wupin.value?.realPrice, num.value)
})

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}

const a = ref(getRandomInt(10))
const b = ref(getRandomInt(10))
const resetCode = () => {
  a.value = getRandomInt(10)
  b.value = getRandomInt(10)
  code.value = ""
}
const code = ref("")
const answer = computed(() => a.value + b.value)
const question = computed(() => `${a.value} + ${b.value}`)
const codeCheck = computed(() => Number(code.value).valueOf() === answer.value)

const userStore = useUserStore()
const model = ref(false)
const form = ref({
  password: "",
  name: userStore.user.name,
  phone: userStore.user.phone,
  location: userStore.user.location,
  wechat: userStore.user?.wechat,
  email: userStore.user?.email,
  remark: "",
})

const checkLocation = computed(() => form.value.location && form.value.location.length > 0)
const checkName = computed(() => form.value.name && form.value.name.length > 0 && form.value.name.length <= 10)
const passwordCheck = computed(() => form.value.password && form.value.password.length > 0)// 登录阶段不检查密码
const phoneCheck = computed(() => isMobile(form.value.phone))
const emailCheck = computed(() => {
  if (!form.value.email) {
    return true
  }
  return isEmail(form.value.email)
})
const allCheck = computed(() => codeCheck.value && passwordCheck.value && checkName.value && checkLocation.value && phoneCheck.value && emailCheck.value)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const doAliPay = () => {
  const location = {
    name: form.value.name,
    phone: form.value.phone,
    location: form.value.location,
  } as LocationForUser

  if (shoprecord.value) {
    return apiPostAliNewPayWithShop(window.location.href, shoprecord.value, location).then((res) => {
      if (!res.data.data.url) {
        ElMessage({
          type: "error",
          message: "支付失败，请重试",
        })
      } else {
        close()
        window.location.href = res.data.data.url
      }
    })
  }

  return apiPostAliNewPay(window.location.href, wupin.value, num.value, location).then((res) => {
    if (!res.data.data.url) {
      ElMessage({
        type: "error",
        message: "支付失败，请重试",
      })
    } else {
      close()
      window.location.href = res.data.data.url
    }
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const doWeChatPay = () => {
  const location = {
    name: form.value.name,
    phone: form.value.phone,
    location: form.value.location,
  } as LocationForUser

  if (shoprecord.value) {
    return apiPostWechatNewPayWithShop(window.location.href, shoprecord.value, location).then((res) => {
      if (!res.data.data.url) {
        ElMessage({
          type: "error",
          message: "支付失败，请重试",
        })
      } else {
        close()
        window.location.href = res.data.data.url
      }
    })
  }

  return apiPostWechatNewPay(window.location.href, wupin.value, num.value, location).then((res) => {
    if (!res.data.data.url) {
      ElMessage({
        type: "error",
        message: "支付失败，请重试",
      })
    } else {
      close()
      window.location.href = res.data.data.url
    }
  })
}

const open = (wp: Wupin, n: number) => {
  if (!wp || wp.id === 0) {
    return
  } else if (n < 1) {
    return
  }
  
  wupin.value = wp
  num.value = n
  shoprecord.value = null
  
  resetCode()
  model.value = true
}

const close = () => {
  model.value = false
}

const openWithShop = (record: ShopRecord) => {
  if (!record || !record.wupin || record.wupin.id === 0) {
    return
  } else if (record.num < 1) {
    return
  }

  wupin.value = record.wupin
  num.value = record.num
  shoprecord.value = record

  resetCode()
  model.value = true
}

defineExpose({
  openWithShop,
  open,
  close,
})

</script>

<template>
  <el-dialog
      v-model="model"
      width="25%"
      destroy-on-close
  >
    <template #title>
      <div style="width: 100%; display: flex; justify-content: center">
        <el-text style="font-size: 1vw">
          在线购买
        </el-text>
      </div>
    </template>

    <div style="width: 100%; display: flex; justify-content: center">
      <div>
        <div class="repay_box">
          <div class="repay_info">
            <el-text>
              商品名称：{{ wupin.name }}
            </el-text>
          </div>
          <div class="repay_info">
            <el-text>
              商品商品分类：{{ wupin.classOf.name }}
            </el-text>
          </div>
          <div class="repay_info">
            <el-text>
              购买数量：{{ num }} 件
            </el-text>
          </div>
          <div class="repay_info">
            <el-text>
              商品单价：￥{{ (facePrice / 100).toFixed(2) }}
            </el-text>
          </div>
          <div class="repay_info">
            <el-text class="pay_price">
              付款金额：￥{{ (totalPrice / 100).toFixed(2) }}
            </el-text>
          </div>
        </div>
        <el-divider style="margin-top: 30px"></el-divider>
        <div>
          <el-form :model="form" label-width="auto" style="width: 15vw">
            <el-form-item>
              <template #label>
                <el-text>收件人</el-text>
              </template>
              <el-input
                  v-model="form.name"
                  maxlength="10"
                  minlength="1"
                  show-word-limit
                  clearable
              />
            </el-form-item>
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
                <el-text>收件地址</el-text>
              </template>
              <el-input v-model="form.location" minlength="0" maxlength="150" show-word-limit/>
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>微信号</el-text>
              </template>
              <el-input v-model="form.wechat" minlength="0" maxlength="30" show-word-limit/>
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>邮箱</el-text>
              </template>
              <el-input v-model="form.email" minlength="0" maxlength="30" show-word-limit/>
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>备注</el-text>
              </template>
              <el-input v-model="form.remark"  minlength="0" maxlength="150" show-word-limit type="textarea" :rows="3"/>
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>账号密码</el-text>
              </template>
              <el-input v-model="form.password" type="password" show-password clearable />
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
        </div>
        <div style="width: 15vw; margin-top: 5px; display: flex; justify-content: center">
          <el-button-group>
            <el-button type="info">取消支付</el-button>
            <el-button :disabled="!allCheck" type="primary">
              支付宝支付
            </el-button>
            <el-button :disabled="!allCheck" type="success">
              微信支付
            </el-button>
          </el-button-group>
        </div>
        <div style="width: 15vw; margin-top: 5px">
          <div v-if="!codeCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请输入正确的验证码！" :closable="false" type="warning" center show-icon>
            </el-alert>
          </div>
          <div v-if="!passwordCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请输入密码！" :closable="false" type="warning" center show-icon>
            </el-alert>
          </div>
          <div v-if="!checkName" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="名字需要在1-10位！" :closable="false" type="warning" center show-icon>
            </el-alert>
          </div>
          <div v-if="!phoneCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请输入正确的手机号！" :closable="false" type="warning" center show-icon>
            </el-alert>
          </div>
          <div v-if="!emailCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请输入正确的邮箱！" :closable="false" type="warning" center show-icon>
            </el-alert>
          </div>
          <div v-if="!checkLocation" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请输入正确的收件地址！" :closable="false" type="warning" center show-icon>
            </el-alert>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.tip_box {
  margin-top: 5px;
}

.repay_info {
  margin-top: 5px;
}

.repay_box {
  margin-top: 5px;
  margin-bottom: 5px;
}

.pay_price {
  font-size: 0.8vw;
  color: red;
  font-weight: bold;
}
</style>