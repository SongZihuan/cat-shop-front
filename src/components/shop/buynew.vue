<script setup lang="ts">
  import { ElMessage } from 'element-plus'
  import {
    apiPostAliNewPay,
    apiPostAliNewPayWithShop,
    LocationForUser,
    apiPostWechatNewPay,
    apiPostWechatNewPayWithShop,
    apiPostAliRepay,
    apiPostWechatRepay
  } from '#/center/pay'
  import { Wupin } from '@/store/hotwupin'
  import useUserStore, { getPasswordHsh } from '@/store/user'
  import { getFacePrice, getTotalPrice } from '@/utils/price'
  import { ShopRecord } from '#/center/shoppingbag'
  import { PAY_ERROR, PAY_FAIL, PAY_SUCCESS } from '@/winmsg/pay'
  import timeoutP from 'ccz/timeout'
  import { BuyRecord } from '#/center/buyrecord'

  const router = useRouter()

  const wupin = ref({} as Wupin)
  const num = ref(1 as number)
  const shoprecord = ref({} as ShopRecord | null)
  const buyrecord = ref({} as BuyRecord | null)

  const facePrice = computed(() => {
    return getFacePrice(wupin.value?.hotPrice, wupin.value?.realPrice)
  })
  const totalPrice = computed(() => {
    return getTotalPrice(wupin.value?.hotPrice, wupin.value?.realPrice, num.value)
  })

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  const resetForm = () => {
    form.value = {
      password: '',
      name: userStore.user.name,
      phone: userStore.user.phone,
      location: userStore.user.location,
      wechat: userStore.user?.wechat,
      email: userStore.user?.email,
      remark: ''
    }
  }

  const a = ref(getRandomInt(10))
  const b = ref(getRandomInt(10))
  const resetCode = () => {
    a.value = getRandomInt(10)
    b.value = getRandomInt(10)
    code.value = ''
  }
  const code = ref('')
  const answer = computed(() => a.value + b.value)
  const question = computed(() => `${a.value} + ${b.value}`)
  const codeCheck = computed(() => Number(code.value).valueOf() === answer.value)

  const userStore = useUserStore()
  const model = ref(false)
  const form = ref({
    password: '',
    name: userStore.user.name,
    phone: userStore.user.phone,
    location: userStore.user.location,
    wechat: userStore.user?.wechat,
    email: userStore.user?.email,
    remark: ''
  })

  const passwordCheck = computed(() => form.value.password && form.value.password.length > 0) // 登录阶段不检查密码
  const allCheck = computed(() => passwordCheck.value && codeCheck.value)

  const isLoading = ref(false)
  const onBeforeClose = (done: () => void) => {
    if (isLoading.value) {
      return
    }
    done()
  }

  const doAliPayWithRequests = async (res) => {
    if (!res.data.data.success || !res.data.data.url) {
      ElMessage({
        type: 'error',
        message: '尝试支付失败1'
      })
      return Promise.reject(1)
    }

    let redirect = res.data.data.url as string | undefined
    const recordId = parseInt(res.data.data.recordId)

    if (recordId === 0) {
      ElMessage({
        type: 'error',
        message: '尝试支付失败2'
      })
      return Promise.reject(2)
    }

    if (typeof redirect !== 'string') {
      return Promise.reject(3)
    } else if (redirect.startsWith('https://') || redirect.startsWith('http://')) {
      // 没问题
    } else if (redirect.startsWith('/')) {
      redirect = window.location.origin + redirect
    } else {
      ElMessage({
        type: 'error',
        message: '尝试支付失败3'
      })
      return Promise.reject(3)
    }

    let redirectOrigin = ''
    try {
      const redirectUrl = new URL(redirect)
      if (redirectUrl.searchParams.has('ishref')) {
        ElMessage({
          type: 'error',
          message: '尝试支付失败4'
        })
        return Promise.reject(4)
      }
      redirectOrigin = redirectUrl.origin
    } catch (e) {
      return Promise.reject(4)
    }

    window.open(redirect)

    let handleFinish = false
    const handle = (event) => {
      if (event.origin !== redirectOrigin) {
        return
      }

      const eventType = event.data.event
      const eventData = event.data.data

      if (eventType === PAY_ERROR) {
        ElMessage({
          type: 'error',
          message: '交易系统异常'
        })
      } else if (eventType === PAY_FAIL) {
        ElMessage({
          type: 'error',
          message: '交易失败'
        })
      } else if (eventType === PAY_SUCCESS) {
        const url = eventData.redirect
        if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
          window.location.href = url
        } else if (url && url.startsWith('/')) {
          window.location.href = window.location.origin + url
        } else if (recordId !== 0) {
          ElMessage({
            type: 'success',
            message: '交易完成'
          })

          router.push({
            path: '/user/center/buyrecord',
            query: {
              id: recordId
            }
          })
        } else {
          ElMessage({
            type: 'error',
            message: '尝试支付失败'
          })
        }
      } else {
        ElMessage({
          type: 'error',
          message: '交易系统异常'
        })
      }

      handleFinish = true
    }

    window.addEventListener('message', handle)

    for (let i = 0; i < 30; i++) {
      await timeoutP(1000)
      if (handleFinish) {
        break
      }
    }

    if (!handleFinish) {
      ElMessage({
        type: 'error',
        message: '尝试支付失败'
      })
      Promise.reject(6)
    }

    window.removeEventListener('message', handle)

    return Promise.resolve(5)
  }

  const _doAliPay = async () => {
    const location = {
      name: form.value.name,
      phone: form.value.phone,
      location: form.value.location
    } as LocationForUser

    if (buyrecord.value) {
      return apiPostAliRepay(
        buyrecord.value.id,
        window.location.href,
        location,
        await getPasswordHsh(form.value.password)
      )
    }

    if (shoprecord.value) {
      // window open 测试无redirect直接跳转
      return apiPostAliNewPayWithShop(shoprecord.value, location, await getPasswordHsh(form.value.password))
    }

    // window open 测试有redirect直接跳转
    return apiPostAliNewPay(
      window.location.href,
      wupin.value,
      num.value,
      location,
      await getPasswordHsh(form.value.password)
    )
  }

  const doAliPay = () => {
    startLoading()
    _doAliPay()
      .then((res) => doAliPayWithRequests(res))
      .then(() => stopLoadingSuccess())
      .catch(() => stopLoadingFail())
      .finally(() => stopLoadingFail())
  }

  const doWechatPayRequests = (res) => {
    if (!res.data.data.success || !res.data.data.url) {
      ElMessage({
        type: 'error',
        message: '尝试支付失败'
      })
      return Promise.reject(1)
    }

    let redirect = res.data.data.url as string | undefined
    const recordId = parseInt(res.data.data.recordId)
    if (recordId === 0) {
      ElMessage({
        type: 'error',
        message: '尝试支付失败'
      })
      return Promise.reject(2)
    }

    if (typeof redirect !== 'string') {
      return Promise.reject(3)
    } else if (redirect.startsWith('https://') || redirect.startsWith('http://')) {
      // 没问题
    } else if (redirect.startsWith('/')) {
      redirect = window.location.origin + redirect
    } else {
      ElMessage({
        type: 'error',
        message: '尝试支付失败'
      })
      return Promise.reject(3)
    }

    let redirectUrl: URL | null = null
    try {
      redirectUrl = new URL(redirect)
      if (redirectUrl.searchParams.has('ishref')) {
        ElMessage({
          type: 'error',
          message: '尝试支付失败'
        })
        return Promise.reject(4)
      }
    } catch (e) {
      return Promise.reject(4)
    }

    redirectUrl.searchParams.set('ishref', 'true')
    window.location.href = redirectUrl.href

    return Promise.resolve()
  }

  const _doWeChatPay = async () => {
    const location = {
      name: form.value.name,
      phone: form.value.phone,
      location: form.value.location
    } as LocationForUser

    if (buyrecord.value) {
      // window open 测试无redirect直接跳转
      return apiPostWechatRepay(
        buyrecord.value.id,
        window.location.href,
        location,
        await getPasswordHsh(form.value.password)
      )
    }

    if (shoprecord.value) {
      // window open 测试无redirect直接跳转
      return apiPostWechatNewPayWithShop(shoprecord.value, location, await getPasswordHsh(form.value.password))
    }

    // window open 测试有redirect直接跳转
    return apiPostWechatNewPay(
      window.location.href,
      wupin.value,
      num.value,
      location,
      await getPasswordHsh(form.value.password)
    )
  }

  const doWeChatPay = () => {
    startLoading()
    _doWeChatPay()
      .then((res) => doWechatPayRequests(res))
      .finally(() => stopLoadingFailTimeout())
  }

  const open = () => {
    resetForm()
    resetCode()
    model.value = true
  }

  const title = ref('在线购买')

  const openWithNew = (wp: Wupin, n: number): boolean => {
    if (!wp || wp.id === 0) {
      return false
    } else if (n < 1) {
      return false
    }

    wupin.value = wp
    num.value = n
    shoprecord.value = null
    buyrecord.value = null
    title.value = '在线购买'

    open()
    return true
  }

  const openWithShop = (record: ShopRecord): boolean => {
    if (!record || !record.wupin || record.wupinId === 0 || record.wupinId !== record.wupin.id) {
      return false
    } else if (record.num <= 0) {
      return false
    }

    wupin.value = record.wupin
    num.value = record.num
    shoprecord.value = record
    buyrecord.value = null
    title.value = '在线购买'

    open()
    return true
  }

  const openWithRepay = (record: BuyRecord): boolean => {
    if (
      !record ||
      !record.wupin ||
      record.wupin.id === 0 ||
      record.nowwupin.id === 0 ||
      record.wupinId !== record.nowwupin.id ||
      record.wupinId !== record.nowwupin.id
    ) {
      return false
    } else if (record.num <= 0) {
      return false
    }

    wupin.value = record.wupin
    num.value = record.num
    shoprecord.value = null
    buyrecord.value = record
    title.value = '重新支付'

    open()
    form.value = {
      password: '',
      name: record.user.name,
      phone: record.user.phone,
      location: record.user.location,
      wechat: record.user.wechat || '',
      email: record.user.email || '',
      remark: ''
    }
    return true
  }

  const startLoading = () => {
    if (model.value) {
      isLoading.value = true
    }
  }

  const stopLoadingSuccess = () => {
    isLoading.value = false
    model.value = false
  }

  const stopLoadingFail = () => {
    isLoading.value = false
  }

  const stopLoadingFailTimeout = (t: number = 1500) => {
    setTimeout(() => {
      isLoading.value = false
      model.value = false
    }, t)
  }

  const close = () => {
    if (isLoading.value) {
      model.value = true
    }
  }

  defineExpose({
    openWithShop,
    openWithNew,
    openWithRepay,
    close
  })
</script>

<template>
  <el-dialog v-model="model" width="25%" destroy-on-close :before-close="onBeforeClose" top="4vh">
    <template #title>
      <div style="width: 100%; display: flex; justify-content: center">
        <el-text style="font-size: 1vw">
          {{ title }}
        </el-text>
      </div>
    </template>

    <div v-loading="isLoading" style="width: 100%; display: flex; justify-content: center">
      <div>
        <div class="repay_box">
          <div class="repay_info">
            <el-text> 商品名称：{{ wupin.name }} </el-text>
          </div>
          <div v-if="wupin.classId !== 1 && wupin.classOf && wupin.classId === wupin.classOf.id" class="repay_info">
            <el-text> 商品分类：{{ wupin.classOf.name }} </el-text>
          </div>
          <div class="repay_info">
            <el-text> 购买数量：{{ num }} 件 </el-text>
          </div>
          <div class="repay_info">
            <el-text> 商品单价：￥{{ (facePrice / 100).toFixed(2) }} </el-text>
          </div>
          <div class="repay_info">
            <el-text class="pay_price"> 付款金额：￥{{ (totalPrice / 100).toFixed(2) }} </el-text>
          </div>
        </div>
        <el-divider style="margin-top: 30px"></el-divider>
        <div>
          <el-form :model="form" label-width="auto" style="width: 15vw">
            <el-form-item>
              <template #label>
                <el-text>收件人</el-text>
              </template>
              <el-input v-model="form.name" maxlength="10" minlength="1" show-word-limit clearable />
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>手机号</el-text>
              </template>
              <el-input v-model="form.phone" maxlength="20" minlength="1" show-word-limit clearable />
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>收件地址</el-text>
              </template>
              <el-input v-model="form.location" minlength="0" maxlength="150" show-word-limit />
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>微信号</el-text>
              </template>
              <el-input v-model="form.wechat" minlength="0" maxlength="30" show-word-limit />
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>邮箱</el-text>
              </template>
              <el-input v-model="form.email" minlength="0" maxlength="30" show-word-limit />
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>备注</el-text>
              </template>
              <el-input v-model="form.remark" minlength="0" maxlength="150" show-word-limit type="textarea" :rows="3" />
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
            <el-button v-if="!allCheck || isLoading" type="info">取消支付</el-button>
            <el-button :disabled="!allCheck || isLoading" type="primary" @click="doAliPay"> 支付宝支付 </el-button>
            <el-button :disabled="!allCheck || isLoading" type="success" @click="doWeChatPay"> 微信支付 </el-button>
          </el-button-group>
        </div>
        <div style="width: 15vw; margin-top: 5px">
          <div v-if="!codeCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请输入正确的验证码！" :closable="false" type="warning" center show-icon> </el-alert>
          </div>
          <div v-if="!passwordCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请输入密码！" :closable="false" type="warning" center show-icon> </el-alert>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
  <div></div>
</template>

<style scoped lang="scss">
  .tip_box {
    margin-top: 10px;
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
