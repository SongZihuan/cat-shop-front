<script setup lang="ts">
import {
  redirect,
  type,
  alipay,
  wechat,
  paytype,
  repay,
  shoppingbagpay,
  newpay,
  buyRecordId,
  apiPostTestPay
} from "#/center/pay"

  const route = useRoute()
  const router = useRouter()

  const Type = ref(route.query?.[type] || alipay as string)
  const payname = ref("在线支付工具")
  if (Type.value == alipay) {
    payname.value = "支付宝"
  } else if (Type.value == wechat) {
    payname.value = "微信支付"
  }

  const PayType = ref(route.query?.[paytype] || repay as string)
  const paytypename = ref("网络购物")
  if (PayType.value == repay) {
    paytypename.value = "订单重新支付"
  } else if (PayType.value == shoppingbagpay) {
    paytypename.value = "购物车商品支付"
  } else if (PayType.value == newpay) {
    paytypename.value = "网络商品下单"
  }

  const goRedirect = () => {
    const redirectPath = route.query?.[redirect]
    if (typeof redirectPath === "string" && redirectPath.length > 0) {
      const p = decodeURIComponent(redirectPath)
      if (p.startsWith("http")) {
        window.location.href = p
      } else {
        window.location.href = window.location.origin + p
      }
    } else {
      router.push({
        "path": "/home",
      })
    }
  }

  const goHome = () => {
    router.push({
      "path": "/home",
    })
  }

  const status = ref(1)
  const paynow = () => {
    const bid = ref(route.query?.[buyRecordId] || 0)
    if (!bid.value) {
      status.value = 2
      backTimer(goHome)
      return
    }

    apiPostTestPay(bid.value as number).then((res) => {
      if (res.data.data.success) {
        status.value = 3
        backTimer(goRedirect)
      } else {
        status.value = 2
        backTimer(goHome)
      }
    }, () => {
      status.value = 2
      backTimer(goHome)
    })
  }
  setTimeout(() => paynow(), 3000)

  let timeoutID = 0
  const backSec = ref(6)
  const backTimer = (back: ()=>{}) => {
    if (backSec.value == 0) {
      back()
      return
    }

    backSec.value -= 1
    timeoutID = setTimeout(backTimer, 1000)
  }
  backTimer()

  onUnmounted(() => {
    timeoutID && clearTimeout(timeoutID)
  })

</script>

<template>
  <div style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <el-result
        v-if="status === 1"
        icon="info"
    >
      <template #title>
        <el-text style="font-size: 1.2vw">
          您正在使用{{payname}}提交支付请求。
        </el-text>
      </template>
      <template #sub-title>
        <el-text style="font-size: 0.8vw">
          接下来请耐心等待支付的处理情况，一旦处理被支付成功，将会为您的商品尽快发货。<br>
          若您的支付被处理失败，您的资金将由{{payname}}退回到你的账号中，并且你的商品需要重新下单发货。<br>
          你的资金被用于：{{ paytypename }}。
        </el-text>
      </template>
    </el-result>
    <el-result
        v-else-if="status === 2"
        icon="error"
    >
      <template #title>
        <el-text style="font-size: 1.2vw">
          您使用{{payname}}提交支付请求失败了。
        </el-text>
      </template>
      <template #sub-title>
        <el-text style="font-size: 0.8vw">
          您的资金将由{{payname}}退回到你的账号中，并且你的商品需要重新下单发货。<br>
        </el-text>
      </template>
      <template #extra>
        <el-button type="danger" size="large">
          返回商户
          （{{ backSec > 5 ? 5 : backSec }}s）
        </el-button>
      </template>
    </el-result>
    <el-result
        v-else-if="status === 3"
        icon="success"
    >
      <template #title>
        <el-text style="font-size: 1.2vw">
          您使用{{payname}}提交支付请求成功。
        </el-text>
      </template>
      <template #sub-title>
        <el-text style="font-size: 0.8vw">
          接下来请耐心等待支付的处理情况，一旦处理被支付成功，将会为您的商品尽快发货。<br>
          你的资金被用于：{{ paytypename }}。
        </el-text>
      </template>
      <template #extra>
        <el-button type="success" size="large">
          返回商户
          （{{ backSec > 5 ? 5 : backSec }}s）
        </el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped lang="scss">

</style>