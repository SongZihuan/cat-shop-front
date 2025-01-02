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
  } from '#/center/pay'
  import { PAY_ERROR, PAY_FAIL, PAY_SUCCESS } from '@/winmsg/pay'
  import { EventMsg } from '@/winmsg/winmsg'

  const route = useRoute()
  const router = useRouter()

  const backevent = computed(() => route.query.backevent || '')
  const backdata = computed(
    () => (route.query.backdata && typeof route.query.backdata === 'string' && JSON.parse(route.query.backdata)) || {}
  )

  const recordId = ref(route.query?.[buyRecordId] || 0)

  const Type = ref(route.query?.[type] || (alipay as string))
  const payname = ref('在线支付工具')
  if (Type.value == alipay) {
    payname.value = '支付宝'
  } else if (Type.value == wechat) {
    payname.value = '微信支付'
  }

  const PayType = ref(route.query?.[paytype] || (repay as string))
  const paytypename = ref('网络购物')
  if (PayType.value == repay) {
    paytypename.value = '订单重新支付'
  } else if (PayType.value == shoppingbagpay) {
    paytypename.value = '购物车商品支付'
  } else if (PayType.value == newpay) {
    paytypename.value = '网络商品下单'
  }

  const goSafeRedirectBack = (redirectPath: string | null | undefined = ''): boolean => {
    if (redirectPath) {
      redirectPath = (route.query[redirect] as unknown as string) || ''
    }

    if (typeof redirectPath !== 'string') {
      redirectPath = ''
    } else if (redirectPath.length === 0) {
      if (redirectPath.startsWith('https://') || redirectPath.startsWith('https://')) {
        // 没问题
      } else if (redirectPath.startsWith('/')) {
        redirectPath = window.location.origin + redirectPath
      } else {
        redirectPath = ''
      }
    } else {
      redirectPath = ''
    }

    if (isHrefMode.value) {
      if (redirectPath === '') {
        if (
          safeGoBack(
            PAY_SUCCESS,
            {
              redirect: '',
              recordId: recordId.value
            },
            false
          )
        ) {
          return true
        }
      } else {
        window.location.href = redirectPath
        return true
      }
    }

    if (window.opener) {
      window.opener.postMessage(
        {
          event: PAY_SUCCESS,
          data: {
            redirect: redirectPath,
            recordId: recordId.value
          }
        } as EventMsg,
        '*'
      )

      window.close()
      return true
    }

    if (
      safeGoBack(
        PAY_SUCCESS,
        {
          redirect: redirectPath,
          recordId: recordId.value
        },
        false
      )
    ) {
      return true
    }

    return false
  }

  const goSafeRedirectFront = (redirectPath: string | null | undefined = '') => {
    if (redirectPath) {
      redirectPath = (route.query[redirect] as unknown as string) || ''
    }

    if (typeof redirectPath !== 'string') {
      redirectPath = ''
    } else if (redirectPath.length === 0) {
      if (redirectPath.startsWith('https://') || redirectPath.startsWith('https://')) {
        // 没问题
      } else if (redirectPath.startsWith('/')) {
        redirectPath = window.location.origin + redirectPath
      } else {
        redirectPath = ''
      }
    } else {
      redirectPath = ''
    }

    if (isHrefMode.value) {
      if (redirectPath === '') {
        if (
          safeGoBack(
            PAY_SUCCESS,
            {
              redirect: '',
              recordId: recordId.value
            },
            true
          )
        ) {
          // 可以
        } else {
          router.push({
            path: '/user/center/buyrecord',
            query: {
              id: recordId.value
            }
          })
        }
      } else {
        window.location.href = redirectPath
      }
      return
    }

    if (window.opener) {
      window.opener.postMessage(
        {
          event: PAY_SUCCESS,
          data: {
            redirect: redirectPath,
            recordId: recordId.value
          }
        } as EventMsg,
        '*'
      )

      window.close()
      return
    }

    if (
      safeGoBack(
        PAY_SUCCESS,
        {
          redirect: redirectPath,
          recordId: recordId.value
        },
        true
      )
    ) {
      return
    }

    router.push({
      path: '/user/center/buyrecord',
      query: {
        id: recordId.value
      }
    })
  }

  const safeGoBack = (
    eventType: string = PAY_FAIL,
    eventData: any = undefined,
    notHistory: boolean = false
  ): boolean => {
    if (window.history.length > 1 && !notHistory) {
      window.history.go(-1)
      return true
    } else if (document.referrer) {
      const backUrl = new URL(document.referrer)

      if (backUrl.origin !== window.location.origin) {
        // 同源才跳转
        return false
      }

      if (backUrl.searchParams.has('backevent') || backUrl.searchParams.has('backdata')) {
        // 不允许存在此参数
        return false
      }

      backUrl.searchParams.set('backevent', eventType)
      eventData && backUrl.searchParams.set('backdata', JSON.stringify(safeGoBack(eventData)))

      console.log('safe back')
      window.location.href = backUrl.href
      return true
    }

    return false
  }

  const goRedirect = () => {
    if (backevent.value) {
      goRedirectAsBack()
    } else {
      goRedirectAsFront()
    }
  }

  const goRedirectAsFront = (redirectPath: string = '') => {
    goSafeRedirectFront(redirectPath)
  }

  const goRedirectAsBack = () => {
    if (goSafeRedirectBack(backdata.value.redirect)) {
      // 正常
    } else if (backdata.value.recordId !== 0) {
      router.push({
        path: '/user/center/buyrecord',
        query: {
          id: backdata.value.recordId
        }
      })
    } else {
      router.push({
        path: '/system/error',
        query: {
          msg: '交易过程顺利，但貌似遇到一点问题'
        }
      })
    }
  }

  const goBack = () => {
    if (isHrefMode.value) {
      if (safeGoBack()) {
        // 成功返回
      } else if (!safeGoBack()) {
        router.push({
          path: '/system/error',
          query: {
            msg: '交易系统异常'
          }
        })
      }
    } else if (window.opener) {
      window.opener.postMessage(
        {
          event: PAY_FAIL
        } as EventMsg,
        '*'
      )

      window.close()
    } else {
      router.push({
        path: '/system/error',
        query: {
          msg: '交易系统异常'
        }
      })
    }
  }

  const goodGoBack = () => {
    if (isHrefMode.value) {
      if (safeGoBack()) {
        // 成功返回
      } else if (!safeGoBack()) {
        router.push({
          path: '/user/shop/home'
        })
      }
    } else if (window.opener) {
      window.opener.postMessage(
        {
          event: PAY_FAIL
        } as EventMsg,
        '*'
      )

      window.close()
    } else {
      router.push({
        path: '/user/shop/home'
      })
    }
  }

  const goError = () => {
    if (isHrefMode.value) {
      // 检查是否有历史记录可以回退
      if (window.history.length > 1) {
        window.history.back()
      } else if (document.referrer) {
        window.location.href = document.referrer
      } else {
        router.push({
          path: '/system/error',
          query: {
            msg: '交易系统异常'
          }
        })
      }
    } else if (window.opener) {
      window.opener.postMessage(
        {
          event: PAY_ERROR
        } as EventMsg,
        '*'
      )

      window.close()
    } else {
      router.push({
        path: '/system/error',
        query: {
          msg: '交易系统异常'
        }
      })
    }
  }

  const goKefu = () => {
    router.push({
      path: '/system/kefu'
    })
  }

  const status = ref(0)

  const paysuccess = (url: string = '') => {
    status.value = 3
    backTimer(() => goRedirectAsFront(url))
  }

  const paybacksuccess = () => {
    status.value = 3
    backTimer(() => goRedirectAsBack())
  }

  const payfail = () => {
    status.value = 2
    backTimer(goBack)
  }

  const systemfail = () => {
    status.value = 4
    backTimer(goError)
  }

  const paynow = () => {
    status.value = 1
    setTimeout(() => {
      apiPostTestPay(recordId.value as number).then(
        (res) => {
          if (res.data.data.success) {
            paysuccess()
          } else {
            payfail()
          }
        },
        () => {
          payfail()
        }
      )
    }, getRandomInt(1000) * 5)
  }

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  let timeoutID: NodeJS.Timeout | number | undefined = undefined
  const backSec = ref(6)
  const backTimer = (backFn?: () => void) => {
    if (backSec.value == 0) {
      backFn && backFn()
      return
    }

    backSec.value -= 1
    timeoutID = setTimeout(() => backTimer(backFn), 1000)
  }

  const isHrefMode = computed(() => route.query.ishref && route.query.ishref === 'true')

  onMounted(() => {
    if (backevent.value) {
      if (backevent.value === PAY_ERROR) {
        systemfail()
      } else if (backevent.value === PAY_FAIL) {
        payfail()
      } else if (backevent.value === PAY_SUCCESS) {
        paybacksuccess()
      } else {
        systemfail()
      }
    } else if (!recordId.value) {
      systemfail()
    } else if (!isHrefMode.value && !window.opener) {
      systemfail()
    } else {
      paynow()
    }
  })

  onUnmounted(() => {
    timeoutID && clearTimeout(timeoutID)
  })
</script>

<template>
  <el-card class="base_card">
    <div class="box">
      <el-result v-if="status === 0" icon="info">
        <template #title>
          <el-text style="font-size: 1.2vw"> 请耐心等待 </el-text>
        </template>
        <template #sub-title>
          <el-text style="font-size: 0.8vw"> 我们正在准备支付系统，请耐心等待。 </el-text>
        </template>
        <template #extra>
          <el-button-group>
            <el-tooltip effect="dark" content="交易正在进行，无法取消。" placement="bottom">
              <el-button type="danger" size="large" @click="goodGoBack"> 取消交易 </el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-result>
      <el-result v-else-if="status === 1" icon="info">
        <template #title>
          <el-text style="font-size: 1.2vw"> 您正在使用{{ payname }}提交支付请求。 </el-text>
        </template>
        <template #sub-title>
          <el-text style="font-size: 0.8vw">
            接下来请耐心等待支付的处理情况，一旦处理被支付成功，将会为您的商品尽快发货。<br />
            若您的支付被处理失败，您的资金将由{{ payname }}退回到你的账号中，并且你的商品需要重新下单发货。<br />
            你的资金将被用于：{{ paytypename }}。
          </el-text>
        </template>
        <template #extra>
          <el-button-group>
            <el-tooltip effect="dark" content="交易正在进行，无法取消。" placement="bottom">
              <el-button type="danger" size="large" disabled> 取消交易 </el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-result>
      <el-result v-else-if="status === 2" icon="error">
        <template #title>
          <el-text style="font-size: 1.2vw"> 您使用{{ payname }}提交支付请求失败了。 </el-text>
        </template>
        <template #sub-title>
          <el-text style="font-size: 0.8vw">
            您的资金将由{{ payname }}退回到你的账号中，并且你的商品需要重新下单发货。<br />
          </el-text>
        </template>
        <template #extra>
          <el-button-group>
            <el-button type="warning" size="large" @click="goBack">
              返回首页 （{{ backSec > 5 ? 5 : backSec }}s）
            </el-button>
            <el-button type="primary" size="large" @click="goKefu"> 寻找客服帮助 </el-button>
          </el-button-group>
        </template>
      </el-result>
      <el-result v-else-if="status === 3" icon="success">
        <template #title>
          <el-text style="font-size: 1.2vw"> 您使用{{ payname }}提交支付请求成功。 </el-text>
        </template>
        <template #sub-title>
          <el-text style="font-size: 0.8vw">
            接下来请耐心等待支付的处理情况，将会为您的商品尽快发货。<br />
            你的资金被用于：{{ paytypename }}。
          </el-text>
        </template>
        <template #extra>
          <el-button type="success" size="large" @click="goRedirect">
            返回商户 （{{ backSec > 5 ? 5 : backSec }}s）
          </el-button>
        </template>
      </el-result>
      <el-result v-else-if="status === 4" icon="success">
        <template #title>
          <el-text style="font-size: 1.2vw"> 交易系统错误。 </el-text>
        </template>
        <template #sub-title>
          <el-text style="font-size: 0.8vw"> 交易系统错误，我们将带你返回。 </el-text>
        </template>
        <template #extra>
          <el-button type="success" size="large" @click="goError">
            返回商户 （{{ backSec > 5 ? 5 : backSec }}s）
          </el-button>
        </template>
      </el-result>
      <el-result v-else icon="error">
        <template #title>
          <el-text style="font-size: 1.2vw"> 您使用{{ payname }}提交支付，但是遇到未知错误。 </el-text>
        </template>
        <template #sub-title>
          <el-text style="font-size: 0.8vw">
            接下来请耐心等待支付的处理情况，一旦处理被支付成功，我们将尽快通知您。<br />
            你的资金原定被用于：{{ paytypename }}。
          </el-text>
        </template>
        <template #extra>
          <el-button-group>
            <el-button type="warning" size="large" @click="goError">
              返回首页 （{{ backSec > 5 ? 5 : backSec }}s）
            </el-button>
            <el-button type="primary" size="large" @click="goKefu"> 寻找客服帮助 </el-button>
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
