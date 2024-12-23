<script setup lang="ts">
import {BuyRecord as BuyRecordData} from "#/center/buyrecord"
import {BuyRecordStatus} from "#/center/buyrecord"
import {formatDate} from "@/utils/time"
import {ElNotification} from "element-plus"
import {apiPostAliRepay, apiPostWechatRepay, LocationForUser} from "#/center/pay"
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  apiPostGouWuPingJia,
  apiPostGouWuDaoHuo,
  apiPostFaHuoQuXiaoShenQing,
  apiPostTuiHuoDengJi,
  apiPostTuiHuoShenQing,
  apiPostQuXiaoPay, apiPostChangeUser
} from "#/center/huo"
import useUserStore from "@/store/user"
import {isEmail, isMobile} from "@/utils/str"
import useConfigStore from "@/store/config"

const configStore = useConfigStore()
const router = useRouter()
const props = defineProps({
  "record": {
    type: Object as PropType<BuyRecordData>,
    required: true
  },
  "safe":  {
    type: Boolean,
    default: false,
  },
  "zhifutishi":  {
    type: Boolean,
    default: false,
  },
  "xiangqing": {
    type: Boolean,
    default: false,
  }
})

const emits = defineEmits(["reload"])

const record = computed(() => props.record)
const safe = computed(() => props.safe)
const zhifutishi = computed(() => props.zhifutishi)
const xiangqing = computed(() => props.xiangqing)

onMounted(() => {
  if (zhifutishi.value && record.value && record.value.status === 2) {
    ElNotification({
      title: '支付提示',
      message: '支付失败，请尝试重新支付',
      type: 'warning',
      duration: 0,
      position: 'top-left',
    })
  }
})

const onClassClick = () => {
  record.value && record.value.wupin.classid != -1 && router.push({
    path: "/shop/search",
    query: {
      "info": JSON.stringify({
        select: [record.value.wupin.classid],
        search: "",
      })
    }
  })
}

const onGoWupin = () => {
  record.value && router.push({
    path: "/shop/wupin",
    query: {
      "id": record.value.wupinid,
    }
  })
}

const onXiangQing = () => {
  record.value && router.push({
    path: "/center/buyrecord",
    query: {
      "id": record.value.id,
    }
  })
}

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

const repayModel = ref(false)
const repayForm = ref({
  password: "",
})

const repayPasswordCheck = computed(() => repayForm.value.password && repayForm.value.password.length > 0)// 登录阶段不检查密码
const repayAllCheck = computed(() => codeCheck.value && repayPasswordCheck.value)

const startRepay = () => {
  if (!record.value || record.value.status !== 2) {
    return
  }

  resetCode()
  repayModel.value = true
}

const stopRepay = () => {
  ElMessageBox.confirm(
      '你尚未支付成功，是否取消支付？',
      '支付提示',
      {
        confirmButtonText: '取消支付',
        cancelButtonText: '稍后支付',
        type: 'warning',
      }
  ).then(() => {
    apiPostQuXiaoPay(record.value.id).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: "取消支付成功",
        })
        emits("reload")
      } else {
        ElMessage({
          type: 'error',
          message: "取消支付失败",
        })
      }
    })
  })
}

const doAliRepay = () => {
  if (!record.value || record.value.status !== 2) {
    return
  }

  return apiPostAliRepay(record.value.id, window.location.href).then((res) => {
    if (!res.data.data.url) {
      ElMessage({
        type: "error",
        message: "支付失败，请重试",
      })
      emits("reload")
    } else {
      repayModel.value = false
      window.location.href = res.data.data.url
    }
  })
}

const doWeChatRepay = () => {
  if (!record.value || record.value.status !== 2) {
    return
  }

  return apiPostWechatRepay(record.value.id, window.location.href).then((res) => {
    if (!res.data.data.url) {
      ElMessage({
        type: "error",
        message: "支付失败，请重试",
      })
      emits("reload")
    } else {
      repayModel.value = false
      window.location.href = res.data.data.url
    }
  })
}

const confirmDaohuo = () => {
  if (!record.value || record.value.status !== 4) {
    return
  }

  ElMessageBox.confirm(
      '你是否已经确认收到货物？',
      '到货提示',
      {
        confirmButtonText: '确认收到货',
        cancelButtonText: '还未收到货',
        type: 'warning',
      }
  ).then(() => {
    apiPostGouWuDaoHuo(record.value.id).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: "确认收货成功",
        })
        emits("reload")
      } else {
        ElMessage({
          type: 'error',
          message: "确认收货失败",
        })
      }
    })
  })
}

const quXiao = () => {
  if (!record.value || record.value.status !== 3) {
    return
  }

  ElMessageBox.confirm(
      '是否申请在发货前取消购买商品？若您的商品已经发货将可能会导致取消发货失败。你可以联系客服或选择收货后再退货。',
      '取消发货提示',
      {
        confirmButtonText: '取消发货',
        cancelButtonText: '正常发货',
        type: 'warning',
      }
  ).then(() => {
    apiPostFaHuoQuXiaoShenQing(record.value.id).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: "申请取消发货成功",
        })
        emits("reload")
      } else {
        ElMessage({
          type: 'error',
          message: "申请取消发货失败",
        })
      }
    })
  })
}

const giveGood = () => {
  if (!record.value || record.value.status !== 5) {
    return
  }

  ElMessageBox.confirm(
      '你确定给好评吗？',
      '好评提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '再想想',
        type: 'warning',
      }
  ).then(() => {
    apiPostGouWuPingJia(record.value.id, true).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: "好评成功",
        })
        emits("reload")
      } else {
        ElMessage({
          type: 'error',
          message: "好评失败",
        })
      }
    })
  })
}

const giveNotGood = () => {
  if (!record.value || record.value.status !== 5) {
    return
  }

  ElMessageBox.confirm(
      '你确定不予置评吗？',
      '好评提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '再想想',
        type: 'warning',
      }
  ).then(() => {
    apiPostGouWuPingJia(record.value.id, false).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: "评价成功",
        })
        emits("reload")
      } else {
        ElMessage({
          type: 'error',
          message: "评价失败",
        })
      }
    })
  })
}

const userStore = useUserStore()

const tuihuoTitle = ref("申请退货")
const tuihuoModel = ref(false)
const tuihuoForm = ref({
  name: userStore.user.name,
  phone: userStore.user.phone,
  reason: "",
})
const tuiHuoNameCheck = computed(() => tuihuoForm.value.name && tuihuoForm.value.name.length > 0 && tuihuoForm.value.name.length <= 10)
const tuiHuoPhoneCheck = computed(() => isMobile(tuihuoForm.value.phone))
const tuihuoReasonCheck = computed(() => tuihuoForm.value.reason && tuihuoForm.value.reason.length > 10 && tuihuoForm.value.reason.length <= 250)
const tuihuoAllCheck = computed(() => codeCheck.value && tuiHuoNameCheck.value && tuiHuoPhoneCheck.value && tuihuoReasonCheck.value)

const startTuiHuo = () => {
  if (!record.value || ([5, 6].every((i) => i != record.value.status))) {
    return
  }

  resetCode()
  tuihuoTitle.value = "申请退货"
  tuihuoModel.value = true
}

const startReTuiHuo = () => {
  if (!record.value || record.value.status != 10) {
    return
  }

  resetCode()
  tuihuoTitle.value = "重新申请退货"
  tuihuoModel.value = true
}

const tuiHuo = () => {
  if (!record.value || ([5, 6, 10].every((i) => i != record.value.status))) {
    return
  }

  ElMessageBox.confirm(
      '你确定进行退货申请登记吗？登记并不是100%通过，你可以致电客服取得联系。',
      '退货提示',
      {
        confirmButtonText: '退货',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    apiPostTuiHuoShenQing(record.value.id, tuihuoForm.value.name, tuihuoForm.value.phone, tuihuoForm.value.reason).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: tuihuoTitle.value + "成功",
        })
        emits("reload")
        tuihuoModel.value = false
      } else {
        ElMessage({
          type: 'error',
          message: tuihuoTitle.value + "成功",
        })
      }
    })
  })
}

const tuihuoLocationModel = ref(false)

const showTuiHuoLocation = () => {
  if (!record.value) {
    return
  }

  tuihuoLocationModel.value = true
}

const tuihuoDengjiModel = ref(false)
const tuihuoDengjiForm = ref({
  kuaidi: "",
  danhao: "",
})
const tuihuoDengjiKuaidiCheck = computed(() => tuihuoDengjiForm.value.kuaidi && tuihuoDengjiForm.value.kuaidi.length > 0)
const tuihuoDengjiDanhaoCheck = computed(() => tuihuoDengjiForm.value.danhao && tuihuoDengjiForm.value.danhao.length > 0)
const tuihuoDengjiAllCheck = computed(() => codeCheck.value && tuihuoDengjiForm.value && tuihuoDengjiForm.value)

const startTuiHuoDengJi = () => {
  if (!record.value || record.value.status != 8) {
    return
  }

  resetCode()
  tuihuoDengjiModel.value = true
}

const tuiHuoDengji = () => {
  if (!record.value || record.value.status != 8) {
    return
  }

  ElMessageBox.confirm(
      '你确定要登记你的退货信息吗？请确保信息准确无误。',
      '登记提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    apiPostTuiHuoDengJi(record.value.id, tuihuoDengjiForm.value.kuaidi, tuihuoDengjiForm.value.danhao).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: "退货登记成功",
        })
        emits("reload")
        tuihuoDengjiModel.value = false
      } else {
        ElMessage({
          type: 'error',
          message: "发货登记成功",
        })
      }
    })
  })
}

const fahuoLocationModel = ref(false)

const showFaHuoLocation = () => {
  if (!record.value) {
    return
  }

  fahuoLocationModel.value = true
}

const changeUserModel = ref(false)
const changeUserForm = ref({
  name: record.value.user.name,
  phone: record.value.user.phone,
  location: record.value.user.location,
  wechat: record.value.user?.wechat,
  email: record.value.user?.email,
  remark: "",
} as LocationForUser)

const changeUserCheckLocation = computed(() => changeUserForm.value.location && changeUserForm.value.location.length > 0)
const changeUserCheckName = computed(() => changeUserForm.value.name && changeUserForm.value.name.length > 0 && changeUserForm.value.name.length <= 10)
const changeUserPhoneCheck = computed(() => isMobile(changeUserForm.value.phone))
const changeUserEmailCheck = computed(() => {
  if (!changeUserForm.value.email) {
    return true
  }
  return isEmail(changeUserForm.value.email)
})
const changeUserAllCheck = computed(() => codeCheck.value && changeUserCheckLocation.value && changeUserCheckName.value && changeUserPhoneCheck.value && changeUserEmailCheck.value)

const startChangeUser = () => {
  if (!record.value || !([1, 2, 3].some((i) => i == record.value.status))) {
    return
  }

  resetCode()
  changeUserModel.value = true
}

const changeUser = () => {
  if (!record.value || !([1, 2, 3].some((i) => i == record.value.status))) {
    return
  }

  ElMessageBox.confirm(
      '你确定要更改你的收货信息了吗？',
      '更改提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    apiPostChangeUser(record.value.id, changeUserForm.value).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: "收货信息更改成功",
        })
        emits("reload")
        changeUserModel.value = false
      } else {
        ElMessage({
          type: 'error',
          message: "收货信息更改失败",
        })
      }
    })
  })
}

</script>

<template>
  <div>
    <el-card v-if="record" style="margin-right: 15px">
      <template #header>
        <div style="display: flow-root">
          <div style="float: left">
            <el-badge :value="record.wupin.tag" style="margin-top: 10px">
              <el-text class="wupin_name" @click="onGoWupin"> {{ record.wupin.name }} </el-text>
            </el-badge>
            <el-text v-if="record.wupin.classid !== 0 && record.wupin.classOf" class="wupin_class_name">
              商品来源：
              <el-text class="wupin_class_name_btn" @click="onClassClick"> {{ record.wupin.classOf.name }} > </el-text>
            </el-text>
          </div>
            <el-button-group style="float:right;">
              <el-button v-if="xiangqing" type="success" @click="onXiangQing">
                查看详情
              </el-button>
              <el-button v-if="safe && record.status === 2" type="danger" @click="stopRepay">
                取消支付
              </el-button>
              <el-button v-if="safe && record.status === 2" type="warning" @click="startRepay">
                重新支付
              </el-button>
              <el-button v-if="safe && record.status === 3" type="warning" @click="quXiao">
                取消发货
              </el-button>
              <el-button v-if="safe && ([1, 2, 3].some((i) => i == record.status))" type="warning" @click="startChangeUser">
                更改收货地址
              </el-button>
              <el-button v-if="safe && record.status === 4" type="success" @click="confirmDaohuo">
                确认收货
              </el-button>
              <el-button v-if="safe && record.status === 5" type="success" @click="giveGood">
                给个好评
              </el-button>
              <el-button v-if="safe && record.status === 5" type="info" @click="giveNotGood">
                不予置评
              </el-button>
              <el-button v-if="safe && ([5, 6].some((i) => i == record.status))" type="danger" @click="startTuiHuo">
                申请退货
              </el-button>
              <el-button v-if="safe && record.status === 8" type="success" @click="startTuiHuoDengJi">
                登记退货信息
              </el-button>
              <el-button v-if="safe && record.status === 10" type="danger" @click="startReTuiHuo">
                重新申请退货
              </el-button>
              <el-button v-if="safe" type="primary" @click="showTuiHuoLocation">
                <span v-if="([7, 8, 9, 10, 11].some((i) => i == record.status))">
                  查看退货地址
                </span>
                <span v-else>
                  查看商家地址
                </span>
              </el-button>
              <el-button v-if="safe" type="success" @click="showFaHuoLocation">
                查看收货地址
              </el-button>
            </el-button-group>
        </div>
      </template>
      <div style="display: flex; justify-content: left">
        <div>
          <div>
            <el-text>
              当前状态：{{ (BuyRecordStatus[record.status]) || "未知" }}
            </el-text>
          </div>
          <div>
            <el-text>
              购买数量：{{ record.num }} 件
            </el-text>
          </div>
          <div>
            <el-text>
              付款金额：￥{{ ((record.totalPrice / 100).toFixed(2)) }}
            </el-text>
          </div>
          <div>
            <el-text>
              商品单价：￥{{ ((record.price / 100).toFixed(2)) }}
            </el-text>
          </div>
          <div>
            <el-text>
              下单时间：{{ formatDate(record.time) }}
            </el-text>
          </div>
          <div v-if="[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].some((i) => i == record.status)">
            <el-text>
              付款时间：{{ formatDate(record.fukuantime) }}
            </el-text>
          </div>
          <div v-if="[4, 5, 6, 7, 8, 9, 10, 11].some((i) => i == record.status)">
            <el-text>
              发货时间：{{ formatDate(record.fahuotime) }}
            </el-text>
          </div>
          <div v-if="[4, 5, 6, 7, 8, 9, 10, 11].some((i) => i == record.status) && record.kuaidi && record.kuaidinum">
            <el-text>
              发货快递公司：{{ record.kuaidi }}
            </el-text>
          </div>
          <div v-if="[4, 5, 6, 7, 8, 9, 10, 11].some((i) => i == record.status) && record.kuaidi && record.kuaidinum">
            <el-text>
              发货运单号：{{ record.kuaidinum }}
            </el-text>
          </div>
          <div v-if="[5, 6, 7, 8, 9, 10, 11].some((i) => i == record.status)">
            <el-text>
              到货时间：{{ formatDate(record.shouhuotime) }}
            </el-text>
          </div>
          <div v-if="[6, 7, 8, 9, 10, 11].some((i) => i == record.status)">
            <el-text>
              评价时间：{{ formatDate(record.pingjiatime) }}
            </el-text>
          </div>
          <div v-if="[6, 7, 8, 9, 10, 11].some((i) => i == record.status)">
            <el-text>
              评价：{{ record.isgood ? "好评" : "不予置评" }}
            </el-text>
          </div>
          <div v-if="[7, 8, 9, 10, 11].some((i) => i == record.status)">
            <el-text>
              申请退货时间：{{ formatDate(record.dengjituihuotime) }}
            </el-text>
          </div>
          <div v-if="[8, 9, 10, 11].some((i) => i == record.status)">
            <el-text v-if="record.status === 8">
              申请退货情况：卖家同意退货，请尽快根据地址寄回商品，并上传物流信息。
            </el-text>
            <el-text v-else-if="record.status === 9">
              申请退货情况：卖家同意退货，等待卖家收货。
            </el-text>
            <el-text v-else-if="record.status === 10">
              申请退货情况：卖家不同意退货，请联系卖家。
            </el-text>
            <el-text v-else-if="record.status === 11">
              申请退货情况：卖家已完成退货。
            </el-text>
          </div>
          <div v-if="[8, 9, 11].some((i) => i == record.status)">
            <el-text>
              同意退货时间：{{ formatDate(record.querentuihuotime) }}
            </el-text>
          </div>
          <div v-if="[9, 11].some((i) => i == record.status) && record.backkuaidi && record.backkuaidinum">
            <el-text>
              退货快递公司：{{ record.backkuaidi }}
            </el-text>
          </div>
          <div v-if="[9, 11].some((i) => i == record.status) && record.backkuaidi && record.backkuaidinum">
            <el-text>
              退货单号：{{ record.backkuaidinum }}
            </el-text>
          </div>
          <div v-if="[11].some((i) => i == record.status)">
            <el-text>
              退货到货时间：{{ formatDate(record.tuohuotime) }}
            </el-text>
          </div>
          <div v-if="[12, 13].some((i) => i == record.status)">
            <el-text v-if="record.status === 12">
              申请取消发货情况：正在尝试取消发货。
            </el-text>
            <el-text v-if="record.status === 13">
              申请取消发货情况：已经为您取消发货。
            </el-text>
          </div>
          <div v-if="[13].some((i) => i == record.status)">
            <el-text>
              确认取消发货时间：{{ formatDate(record.quxiaotime) }}
            </el-text>
          </div>
        </div>
      </div>
    </el-card>
  </div>
  <el-dialog
      v-model="repayModel"
      width="25%"
      destroy-on-close
  >
    <template #title>
      <div style="width: 100%; display: flex; justify-content: center">
        <el-text style="font-size: 1vw">
          重新支付订单
        </el-text>
      </div>
    </template>

    <div style="width: 100%; display: flex; justify-content: center">
      <div>
        <div class="repay_box">
          <div class="repay_info">
            <el-text>
              购买数量：{{ record.num }} 件
            </el-text>
          </div>
          <div class="repay_info">
            <el-text>
              商品单价：￥{{ ((record.price / 100).toFixed(2)) }}
            </el-text>
          </div>
          <div class="repay_info">
            <el-text class="pay_price">
              付款金额：￥{{ ((record.totalPrice / 100).toFixed(2)) }}
            </el-text>
          </div>
        </div>
        <el-divider style="margin-top: 30px"></el-divider>
        <div>
          <el-form :model="repayForm" label-width="auto" style="width: 15vw">
            <el-form-item>
              <template #label>
                <el-text>账号密码</el-text>
              </template>
              <el-input v-model="repayForm.password" type="password" show-password clearable />
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
            <el-button type="info" @click="repayModel = false">取消支付</el-button>
            <el-button :disabled="!repayAllCheck" type="primary" @click="doAliRepay">
              支付宝支付
            </el-button>
            <el-button :disabled="!repayAllCheck" type="success" @click="doWeChatRepay">
              微信支付
            </el-button>
          </el-button-group>
        </div>
        <div style="width: 15vw; margin-top: 5px">
          <div v-if="!codeCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请输入正确的验证码！" :closable="false" type="warning" center show-icon>
            </el-alert>
          </div>
          <div v-if="!repayPasswordCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请输入密码！" :closable="false" type="warning" center show-icon>
            </el-alert>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>

  <el-dialog
      v-model="tuihuoDengjiModel"
      width="25%"
      destroy-on-close
  >
    <template #title>
      <div style="width: 100%; display: flex; justify-content: center">
        <el-text style="font-size: 1vw">
          退货信息登记
        </el-text>
      </div>
    </template>

    <div style="width: 100%; display: flex; justify-content: center">
      <div>
        <div class="location_info">
          <el-text>
            收件人：{{ record.shop.name || record.wupin.ren || configStore.config.name || "未知商铺"  }}
          </el-text>
        </div>
        <div class="location_info">
          <el-text>
            收件号码：{{ record.shop.phone || record.wupin.phone || configStore.config.hotline || "000-00000000"  }}
          </el-text>
        </div>
        <div class="location_info">
          <el-text>
            收件地址：{{ record.shop.location || record.wupin.location || "按快递原路返回" }}
          </el-text>
        </div>
        <div v-if="record.shop.wechat || record.wupin.wechat || configStore.config.wechat" class="location_info">
          <el-text>
            联系微信：{{ record.shop.wechat || record.wupin.wechat || configStore.config.wechat  }}
          </el-text>
        </div>
        <div v-if="record.shop.email || record.wupin.email" class="location_info">
          <el-text>
            联系邮箱：{{ record.shop.email || record.wupin.email }}
          </el-text>
        </div>
        <div v-if="record.shop.remark" class="location_info">
          <el-text>
            备注：{{ record.shop.remark }}
          </el-text>
        </div>
        <el-divider style="margin-top: 30px"></el-divider>
        <div>
          <el-form :model="tuihuoDengjiForm" label-width="auto" style="width: 15vw">
            <el-form-item>
              <template #label>
                <el-text>快递公司</el-text>
              </template>
              <el-input
                  v-model="tuihuoDengjiForm.kuaidi"
                  maxlength="50"
                  minlength="1"
                  show-word-limit
                  clearable
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>快递面单号码</el-text>
              </template>
              <el-input
                  v-model="tuihuoDengjiForm.danhao"
                  maxlength="100"
                  minlength="1"
                  show-word-limit
                  clearable
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>验证码</el-text>
              </template>
              <el-input
                  v-model="code"
                  clearable
              >
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
            <el-button type="info" @click="tuihuoDengjiModel = false">取消</el-button>
            <el-button :disabled="!tuihuoDengjiAllCheck" type="primary" @click="tuiHuoDengji">
              立即申请
            </el-button>
          </el-button-group>
        </div>
        <div style="width: 15vw; margin-top: 5px">
          <div v-if="!codeCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请输入正确的验证码！" :closable="false" type="warning" center show-icon>
            </el-alert>
          </div>
          <div v-if="!tuihuoDengjiKuaidiCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请填写快递公司！" :closable="false" type="warning" center show-icon>
            </el-alert>
          </div>
          <div v-if="!tuihuoDengjiDanhaoCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请填写快递运单号码！" :closable="false" type="warning" center show-icon>
            </el-alert>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
  <el-dialog
      v-model="tuihuoModel"
      width="25%"
      destroy-on-close
  >
    <template #title>
      <div style="width: 100%; display: flex; justify-content: center">
        <el-text style="font-size: 1vw">
          {{ tuihuoTitle }}
        </el-text>
      </div>
    </template>

    <div style="width: 100%; display: flex; justify-content: center">
      <div>
        <div class="repay_box">
          <div class="repay_info">
            <el-text>
              购买数量：{{ record.num }} 件
            </el-text>
          </div>
          <div class="repay_info">
            <el-text>
              商品单价：￥{{ ((record.price / 100).toFixed(2)) }}
            </el-text>
          </div>
          <div class="repay_info">
            <el-text class="pay_price">
              付款金额：￥{{ ((record.totalPrice / 100).toFixed(2)) }}
            </el-text>
          </div>
        </div>
        <el-divider style="margin-top: 30px"></el-divider>
        <div>
          <el-form :model="tuihuoForm" label-width="auto" style="width: 15vw">
            <el-form-item>
              <template #label>
                <el-text>退货联系人</el-text>
              </template>
              <el-input
                  v-model="tuihuoForm.name"
                  maxlength="10"
                  minlength="1"
                  show-word-limit
                  clearable
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>退货联系人电话</el-text>
              </template>
              <el-input
                  v-model="tuihuoForm.phone"
                  maxlength="20"
                  minlength="1"
                  show-word-limit
                  clearable
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>退货原因</el-text>
              </template>
              <el-input
                  v-model="tuihuoForm.reason"
                  maxlength="250"
                  minlength="10"
                  show-word-limit
                  type="textarea"
                  clearable
                  :rows="5"
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>验证码</el-text>
              </template>
              <el-input
                  v-model="code"
                  clearable
              >
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
            <el-button type="info" @click="tuihuoModel = false">取消申请</el-button>
            <el-button :disabled="!tuihuoAllCheck" type="primary" @click="tuiHuo">
              立即申请
            </el-button>
          </el-button-group>
        </div>
        <div style="width: 15vw; margin-top: 5px">
          <div v-if="!codeCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请输入正确的验证码！" :closable="false" type="warning" center show-icon>
            </el-alert>
          </div>
          <div v-if="!tuiHuoNameCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="联系人姓名字数应该为1-10个！" :closable="false" type="warning" center show-icon>
            </el-alert>
          </div>
          <div v-if="!tuiHuoPhoneCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="手机号不正确！" :closable="false" type="warning" center show-icon>
            </el-alert>
          </div>
          <div v-if="!tuihuoReasonCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="退货原因应在10-250个字以内！" :closable="false" type="warning" center show-icon>
            </el-alert>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
  <el-dialog
      v-model="tuihuoLocationModel"
      width="15vw"
  >
    <template #title>
      <div style="width: 100%; display: flex; justify-content: center">
        <el-text style="font-size: 1vw">
          <span v-if="([7, 8, 9, 10, 11].some((i) => i == record.status))">
            {{ record.wupin.name }}退货地址
          </span>
          <span v-else>
            {{ record.wupin.name }}商家地址
          </span>
        </el-text>
      </div>
    </template>

    <div class="location_box">
      <div class="location_info">
        <el-text>
          收件人：{{ record.shop.name || record.wupin.ren || configStore.config.name || "未知商铺"  }}
        </el-text>
      </div>
      <div class="location_info">
        <el-text>
          收件号码：{{ record.shop.phone || record.wupin.phone || configStore.config.hotline || "000-00000000"  }}
        </el-text>
      </div>
      <div class="location_info">
        <el-text>
          收件地址：{{ record.shop.location || record.wupin.location || "按快递原路返回" }}
        </el-text>
      </div>
      <div v-if="record.shop.wechat || record.wupin.wechat || configStore.config.wechat" class="location_info">
        <el-text>
          联系微信：{{ record.shop.wechat || record.wupin.wechat || configStore.config.wechat  }}
        </el-text>
      </div>
      <div v-if="record.shop.email || record.wupin.email" class="location_info">
        <el-text>
          联系邮箱：{{ record.shop.email || record.wupin.email }}
        </el-text>
      </div>
      <div v-if="record.shop.remark" class="location_info">
        <el-text>
          备注：{{ record.shop.remark }}
        </el-text>
      </div>
    </div>
    <template #footer>
      <div style="display: flex; width: 100%; justify-content: right;">
        <el-button type="success" @click="tuihuoLocationModel = false">好的</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
      v-model="fahuoLocationModel"
      width="500"
  >
    <template #title>
      <div style="width: 100%; display: flex; justify-content: center">
        <el-text style="font-size: 1vw">
          {{ record.wupin.name }}发货地址
        </el-text>
      </div>
    </template>

    <div class="location_box">
      <div class="location_info">
        <el-text>
          收件人：{{ record.user.name }}
        </el-text>
      </div>
      <div class="location_info">
        <el-text>
          收件号码：{{ record.user.phone }}
        </el-text>
      </div>
      <div class="location_info">
        <el-text>
          收件地址：{{ record.user.location }}
        </el-text>
      </div>
      <div v-if="record.wupin.wechat" class="location_info">
        <el-text>
          联系微信：{{ record.user.wechat }}
        </el-text>
      </div>
      <div v-if="record.wupin.email" class="location_info">
        <el-text>
          联系邮箱：{{ record.user.email }}
        </el-text>
      </div>
      <div v-if="record.user.remark" class="location_info">
        <el-text>
          备注：{{ record.user.remark }}
        </el-text>
      </div>
    </div>
    <template #footer>
      <div style="display: flex; width: 100%; justify-content: right;">
        <el-button type="success" @click="fahuoLocationModel = false">好的</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
      v-model="changeUserModel"
      width="500"
  >
    <template #title>
      <div style="width: 100%; display: flex; justify-content: center">
        <el-text style="font-size: 1vw">
          用户收件人信息修改
        </el-text>
      </div>
    </template>
    <div style="display: flex; justify-content: center; width: 100%;">
      <el-form :model="changeUserForm" label-width="auto" style="width: 15vw">
        <el-form-item>
          <template #label>
            <el-text>收件人</el-text>
          </template>
          <el-input
              v-model="changeUserForm.name"
              maxlength="10"
              minlength="1"
              show-word-limit
              clearable
          />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>收件号码</el-text>
          </template>
          <el-input
              v-model="changeUserForm.phone"
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
          <el-input v-model="changeUserForm.location" minlength="0" maxlength="150" show-word-limit/>
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>微信号</el-text>
          </template>
          <el-input v-model="changeUserForm.wechat" minlength="0" maxlength="30" show-word-limit/>
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>邮箱</el-text>
          </template>
          <el-input v-model="changeUserForm.email" minlength="0" maxlength="30" show-word-limit/>
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>备注</el-text>
          </template>
          <el-input v-model="changeUserForm.remark"  minlength="0" maxlength="150" show-word-limit type="textarea" :rows="3"/>
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
    <div style="display: flex; justify-content: center; width: 100%;">
      <el-button-group>
        <el-button type="info" @click="changeUserModel = false">取消</el-button>
        <el-button :disabled="!changeUserAllCheck" type="primary" @click="changeUser">
          确定
        </el-button>
      </el-button-group>
    </div>
    <div style="display: flex; justify-content: center; width: 100%;">
      <div>
        <div v-if="!codeCheck" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的验证码！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
        <div v-if="!changeUserCheckName" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="名字需要在1-10位！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
        <div v-if="!changeUserPhoneCheck" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的手机号！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
        <div v-if="!changeUserEmailCheck" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的邮箱！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
        <div v-if="!changeUserCheckLocation" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的收件地址！" :closable="false" type="warning" center show-icon>
          </el-alert>
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

.location_info {
  margin-top: 5px;
}

.location_box {
  margin-top: 5px;
  margin-bottom: 5px;
  min-height: 15vh;
}

.pay_price {
  font-size: 0.8vw;
  color: red;
  font-weight: bold;
}

.wupin_name {
  display: inline-block;
  font-size: 1.5vw;
  font-weight: bold;
  margin-right: 5px;
  vertical-align: bottom;
  cursor: pointer;
}

.wupin_name:hover {
  text-decoration: underline;
}

.wupin_name:active {
  color: blue;
}

.wupin_tag {
  margin-top: 10px;
  margin-left: 5px;
}

.wupin_class_name {
  margin-top: 10px;
  display: inline-block;
  margin-left: 5px;
  font-size: 0.6vw;
}

.wupin_class_name_btn {
  margin-left: 1px;
  font-size: 0.6vw;
  vertical-align: bottom;
  cursor: pointer;
}

.wupin_class_name_btn:hover {
  text-decoration: underline;
}

.wupin_class_name_btn:active {
  color: blue;
}

</style>