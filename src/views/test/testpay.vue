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
      "path": "/shop/home",
    })
  }

  const goKefu = () => {
    router.push({
      "path": "/system/kefu",
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

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  setTimeout(() => paynow(), getRandomInt(300) * 10)

  let timeoutID: NodeJS.Timeout | number | undefined = undefined
  const backSec = ref(6)
  const backTimer = (backFn?: ()=>void) => {
    if (backSec.value == 0) {
      backFn && backFn()
      return
    }

    backSec.value -= 1
    timeoutID = setTimeout(() => backTimer(backFn), 1000)
  }

  onUnmounted(() => {
    timeoutID && clearTimeout(timeoutID)
  })

</script>

<template>
  <el-card class="base_card">
    <div class="box">
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
            你的资金将被用于：{{ paytypename }}。
          </el-text>
        </template>
        <template #extra>
          <el-button-group>
            <el-tooltip
                effect="dark"
                content="交易正在进行，无法取消。"
                placement="bottom"
            >
              <el-button type="danger" size="large" disabled>
                取消交易
              </el-button>
            </el-tooltip>
          </el-button-group>
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
          <el-button-group>
            <el-button type="warning" size="large" @click="goHome">
              返回首页
              （{{ backSec > 5 ? 5 : backSec }}s）
            </el-button>
            <el-button type="primary" size="large" @click="goKefu">
              寻找客服帮助
            </el-button>
          </el-button-group>
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
            接下来请耐心等待支付的处理情况，将会为您的商品尽快发货。<br>
            你的资金被用于：{{ paytypename }}。
          </el-text>
        </template>
        <template #extra>
          <el-button type="success" size="large" @click="goRedirect">
            返回商户
            （{{ backSec > 5 ? 5 : backSec }}s）
          </el-button>
        </template>
      </el-result>
      <el-result
          v-else
          icon="error"
      >
        <template #title>
          <el-text style="font-size: 1.2vw">
            您使用{{payname}}提交支付，但是遇到未知错误。
          </el-text>
        </template>
        <template #sub-title>
          <el-text style="font-size: 0.8vw">
            接下来请耐心等待支付的处理情况，一旦处理被支付成功，我们将尽快通知您。<br>
            你的资金原定被用于：{{ paytypename }}。
          </el-text>
        </template>
        <template #extra>
          <el-button-group>
            <el-button type="warning" size="large" @click="goHome">
              返回首页
              （{{ backSec > 5 ? 5 : backSec }}s）
            </el-button>
            <el-button type="primary" size="large" @click="goKefu">
              寻找客服帮助
            </el-button>
          </el-button-group>
        </template>
      </el-result>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.base_card {
  --base-card-height: #{var(--custom-height)};
  --base-card-width: #{var(--custom-little-width)};
  height: #{var(--base-card-height)};
  width: #{var(--base-card-width)};
}

.box {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: calc(#{var(--base-card-height)} - 25vh);
  width: calc(#{var(--base-card-width)} - 40px); /* 使父元素宽度为100% */
}
</style>