<script setup lang="ts">
import {AdminBuyRecordStatus, AdminBuyRecord} from "#/admin/buyrecord"
import {formatDate} from "@/utils/time"
import { ElMessageBox } from 'element-plus'
import {
  apiAdminPostPeoplePay,
} from "#/admin/pay";
import {
  apiAdminPostGouWuDaoHuo,
  apiAdminPostFaHuoQuXiao,
  apiAdminPostTuiHuoDengJi,
  apiAdminPostQuXiaoPay,
  apiAdminPostFaHuoDengJi,
  apiAdminPostChangeUser,
  apiAdminPostChangeShop,
  apiAdminPostTuiHuoAccept,
  apiAdminPostTuiHuoShenQingAccept,
  apiAdminPostGouWuTuiHuoDaohuo,
  apiAdminPostAcceptFaHuoQuXiaoDengJi
} from "#/admin/huo"
import {LocationForUser} from "#/center/pay"
import {isEmail, isMobile} from "@/utils/str"
import useConfigStore from "@/store/config"
import { ElMessage } from "element-plus"
import pushTo from "@/views/admin/router_push";

const configStore = useConfigStore()
const props = defineProps({
  "record": {
    type: Object as PropType<AdminBuyRecord>,
    required: true
  },
  "safe":  {
    type: Boolean,
    default: false,
  },
  "xiangqing": {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(["reload"])
const router = useRouter()
const route = useRoute()

const record = computed(() => props.record)
const safe = computed(() => props.safe)
const xiangqing = computed(() => props.xiangqing)

const onClassClick = () => {
  record.value && record.value.wupin.classId > 1 && router.push({
    path: "/user/shop/search",
    query: {
      select: record.value.wupin.classId || 0,
      search: "",
    }
  })
}

const onGoWupinConfirm = () => {
  if (!record.value) {
    // NO-THING-TO-DO
  } else if (record.value.down) {
    ElMessageBox.confirm(
        `是否确认前往商品 ${record.value.wupin.name} 的售卖页面？`,
        '温馨提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
    ).then(() => {
      onGoWupin()
    })
  } else {
    ElMessageBox.confirm(
        `是否确认前往商品 ${record.value.wupin.name} 的售卖页面（商品已经下架）？`,
        '温馨提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
    ).then(() => {
      onGoWupin()
    })
  }
}

const onGoWupin = () => {
  pushTo(router, route, "/admin/user/buy/wupin/sale", {
    recordId: record.value.id,
  })
}

const onGoLockWupin = () => {
  pushTo(router, route, "/admin/user/buy/wupin/lock", {
    recordId: record.value.id,
  })
}

const startRepay = () => {
  ElMessageBox.confirm(
      '是否确定对方在人工渠道支付成功？',
      '支付提示',
      {
        confirmButtonText: '确定支付成功',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    apiAdminPostPeoplePay(record.value.userId, record.value.id).then((res) => {
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

const stopRepay = () => {
  ElMessageBox.confirm(
      '用户尚未支付成功，是否取消支付？',
      '支付提示',
      {
        confirmButtonText: '取消支付',
        cancelButtonText: '稍后支付',
        type: 'warning',
      }
  ).then(() => {
    apiAdminPostQuXiaoPay(record.value.userId, record.value.id).then((res) => {
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

const confirmDaohuo = () => {
  if (!record.value || record.value.status !== 4) {
    return
  }

  ElMessageBox.confirm(
      '确认帮用户选择到货吗？',
      '到货提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    apiAdminPostGouWuDaoHuo(record.value.userId, record.value.id).then((res) => {
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

const confirmTuiHuo = () => {
  if (!record.value || record.value.status !== 9) {
    return
  }

  ElMessageBox.confirm(
      '确认用户退货已经到货吗？',
      '到货提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    apiAdminPostGouWuTuiHuoDaohuo(record.value.userId, record.value.id).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: "确认退货收货成功",
        })
        emits("reload")
      } else {
        ElMessage({
          type: 'error',
          message: "确认退货收货失败",
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
      '商品尚未发货，是否取消订单？',
      '取消发货提示',
      {
        confirmButtonText: '取消发货',
        cancelButtonText: '暂不决定',
        type: 'warning',
      }
  ).then(() => {
    apiAdminPostFaHuoQuXiao(record.value.userId, record.value.id).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: "取消发货成功",
        })
        emits("reload")
      } else {
        ElMessage({
          type: 'error',
          message: "取消发货失败",
        })
      }
    })
  })
}

const acceptQuXiao = () => {
  if (!record.value || record.value.status !== 12) {
    return
  }

  ElMessageBox.confirm(
      '是否同意取消订单发货？',
      '取消发货提示',
      {
        confirmButtonText: '取消发货',
        cancelButtonText: '暂不决定',
        type: 'warning',
      }
  ).then(() => {
    apiAdminPostAcceptFaHuoQuXiaoDengJi(record.value.userId, record.value.id, true).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: "取消发货成功",
        })
        emits("reload")
      } else {
        ElMessage({
          type: 'error',
          message: "取消发货失败",
        })
      }
    })
  })
}

const notAcceptQuXiao = () => {
  if (!record.value || record.value.status !== 12) {
    return
  }

  ElMessageBox.confirm(
      '是否拒绝取消订单发货？',
      '取消发货提示',
      {
        confirmButtonText: '拒绝取消',
        cancelButtonText: '暂不决定',
        type: 'warning',
      }
  ).then(() => {
    apiAdminPostAcceptFaHuoQuXiaoDengJi(record.value.userId, record.value.id, false).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: "取消发货成功",
        })
        emits("reload")
      } else {
        ElMessage({
          type: 'error',
          message: "取消发货失败",
        })
      }
    })
  })
}

const fahuoDengjiModel = ref(false)
const fahuoDengjiForm = ref({
  kuaidi: "",
  danhao: "",
})
const fahuoDengjiKuaidiCheck = computed(() => fahuoDengjiForm.value.kuaidi && fahuoDengjiForm.value.kuaidi.length > 0)
const fahuoDengjiDanhaoCheck = computed(() => fahuoDengjiForm.value.danhao && fahuoDengjiForm.value.danhao.length > 0)
const fahuoDengjiAllCheck = computed(() => fahuoDengjiForm.value && fahuoDengjiForm.value)

const startFaHuoDengJi = () => {
  if (!record.value || record.value.status != 3) {
    return
  }

  fahuoDengjiModel.value = true
}

const faHuoDengji = () => {
  if (!record.value || record.value.status != 3) {
    return
  }

  ElMessageBox.confirm(
      '你确定要登记你的发货信息吗？请确保信息准确无误。',
      '登记提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    apiAdminPostFaHuoDengJi(record.value.userId, record.value.id, fahuoDengjiForm.value.kuaidi, fahuoDengjiForm.value.danhao).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: "发货登记成功",
        })
        emits("reload")
        fahuoDengjiModel.value = false
      } else {
        ElMessage({
          type: 'error',
          message: "发货登记失败",
        })
      }
    })
  })
}

const tuihuoDengjiModel = ref(false)
const tuihuoDengjiForm = ref({
  kuaidi: "",
  danhao: "",
})
const tuihuoDengjiKuaidiCheck = computed(() => tuihuoDengjiForm.value.kuaidi && tuihuoDengjiForm.value.kuaidi.length > 0)
const tuihuoDengjiDanhaoCheck = computed(() => tuihuoDengjiForm.value.danhao && tuihuoDengjiForm.value.danhao.length > 0)
const tuihuoDengjiAllCheck = computed(() => tuihuoDengjiForm.value && tuihuoDengjiForm.value)

const startTuiHuoDengJi = () => {
  if (!record.value || record.value.status != 8) {
    return
  }

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
    apiAdminPostTuiHuoDengJi(record.value.userId, record.value.id, tuihuoDengjiForm.value.kuaidi, tuihuoDengjiForm.value.danhao).then((res) => {
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
  if (!record.value || !([1, 2, 3, 4].some((i) => i == record.value.status))) {
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
const changeUserAllCheck = computed(() => changeUserCheckLocation.value && changeUserCheckName.value && changeUserPhoneCheck.value && changeUserEmailCheck.value)

const startChangeUser = () => {
  if (!record.value || !([1, 2, 3].some((i) => i == record.value.status))) {
    return
  }

  changeUserModel.value = true
}

const changeUser = () => {
  if (!record.value || !([1, 2, 3].some((i) => i == record.value.status))) {
    return
  }

  ElMessageBox.confirm(
      '你确定要更改用户的收货信息了吗？',
      '更改提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    apiAdminPostChangeUser(record.value.userId, record.value.id, changeUserForm.value).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: "用户收货信息更改成功",
        })
        emits("reload")
        changeUserModel.value = false
      } else {
        ElMessage({
          type: 'error',
          message: "用户收货信息更改失败",
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

const changeShopModel = ref(false)
const changeShopForm = ref({
  name: record.value.shop.name || record.value.wupin.ren || configStore.config.name || "未知商铺",
  phone: record.value.shop.phone || record.value.wupin.phone || configStore.config.hotline || "000-00000000",
  location: record.value.shop.location || record.value.wupin.location || "按快递原路返回",
  wechat: record.value.shop.wechat || record.value.wupin.wechat || configStore.config.wechat,
  email: record.value.shop.email || record.value.wupin.email,
  remark: record.value.user.remark,
} as LocationForUser)

const changeShopCheckLocation = computed(() => changeShopForm.value.location && changeShopForm.value.location.length > 0)
const changeShopCheckName = computed(() => changeShopForm.value.name && changeShopForm.value.name.length > 0 && changeShopForm.value.name.length <= 10)
const changeShopPhoneCheck = computed(() => isMobile(changeShopForm.value.phone))
const changeShopEmailCheck = computed(() => {
  if (!changeShopForm.value.email) {
    return true
  }
  return isEmail(changeShopForm.value.email)
})
const changeShopAllCheck = computed(() => changeShopCheckLocation.value && changeShopCheckName.value && changeShopPhoneCheck.value && changeShopEmailCheck.value)

const startChangeShop = () => {
  if (!record.value) {
    return
  }

  changeShopModel.value = true
}

const changeShop = () => {
  if (!record.value) {
    return
  }

  ElMessageBox.confirm(
      '你确定要更改商户的收货信息了吗？',
      '更改提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    apiAdminPostChangeShop(record.value.userId, record.value.id, changeShopForm.value).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: "商品收货信息更改成功",
        })
        emits("reload")
        changeShopModel.value = false
      } else {
        ElMessage({
          type: 'error',
          message: "商品收货信息更改失败",
        })
      }
    })
  })
}

const acceptTuiHuo = () => {
  if (!record.value || record.value.status !== 7) {
    return
  }

  ElMessageBox.confirm(
      '你确定要同意用户退货吗？',
      '退货提示',
      {
        confirmButtonText: '同意退货申请',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    apiAdminPostTuiHuoAccept(record.value.userId, record.value.id, true).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: "同意成功",
        })
        emits("reload")
      } else {
        ElMessage({
          type: 'error',
          message: "同意失败",
        })
      }
    })
  })
}

const notAcceptTuiHuo = () => {
  if (!record.value || record.value.status !== 7) {
    return
  }

  ElMessageBox.confirm(
      '你确定要拒绝用户退货吗？',
      '退货提示',
      {
        confirmButtonText: '拒绝退货申请',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    apiAdminPostTuiHuoAccept(record.value.userId, record.value.id, false).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: "拒绝成功",
        })
        emits("reload")
      } else {
        ElMessage({
          type: 'error',
          message: "拒绝失败",
        })
      }
    })
  })
}

const shenQingAndAcceptTuiHuo = () => {
  if (!record.value || !([5, 6, 10].some((i) => i == record.value.status))) {
    return
  }

  ElMessageBox.confirm(
      '你是否帮助并同意用户退货？',
      '退货提示',
      {
        confirmButtonText: '同意',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    apiAdminPostTuiHuoShenQingAccept(record.value.userId, record.value.id).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: "同意成功",
        })
        emits("reload")
      } else {
        ElMessage({
          type: 'error',
          message: "同意失败",
        })
      }
    })
  })
}

const onXiangQing = () => {
  pushTo(router, route, "/admin/user/list/buyrecord", {
    recordId: record.value.id,
  })
}

</script>

<template>
  <div>
    <el-card v-if="record" style="margin-right: 15px">
      <template #header>
        <div style="display: flow-root">
          <div style="float: left">
            <el-badge  class="title" :value="(record.down ? (record.wupin.tag ? `已下架 | ${record.wupin.tag}` : '已下架') : record.wupin.tag)" style="margin-top: 10px">
              <el-text class="wupin_name" @click="onGoWupinConfirm"> {{ record.wupin.name }} </el-text>
            </el-badge>
            <el-text v-if="record.wupin.classId > 1 && record.wupin.classOf" class="wupin_class_name">
              商品来源：
              <el-text class="wupin_class_name_btn" @click="onClassClick"> {{ record.wupin.classOf.name }} > </el-text>
            </el-text>
          </div>
            <el-button-group style="float:right;">
              <el-button v-if="xiangqing" type="success" @click="onXiangQing">
                查看详情
              </el-button>
              <el-button type="success"  @click="onGoWupin">
                <span v-if="record.down">查看商品售卖页（已经下架）</span>
                <span v-else>查看商品售卖页</span>
              </el-button>
              <el-tooltip
                  effect="dark"
                  placement="bottom"
                  content="即您购买商品时，商品信息的备份内容。"
              >
                <el-button type="primary" @click="onGoLockWupin">
                  查看商品存档页
                </el-button>
              </el-tooltip>
              <el-button v-if="safe && record.status === 2" type="danger" @click="stopRepay">
                取消支付
              </el-button>
              <el-button v-if="safe && record.status === 2" type="warning" @click="startRepay">
                人工支付确认
              </el-button>
              <el-button v-if="safe && record.status === 3" type="danger" @click="quXiao">
                取消发货
              </el-button>
              <el-button v-if="safe && record.status === 3" type="warning" @click="startFaHuoDengJi">
                发货登记
              </el-button>
              <el-button v-if="safe && ([1, 2, 3, 4].some((i) => i == record.status))" type="success" @click="showFaHuoLocation">
                查看发货地址
              </el-button>
              <el-button v-if="safe && ([1, 2, 3].some((i) => i == record.status))" type="warning" @click="startChangeUser">
                更改发货地址
              </el-button>
              <el-button v-if="safe && record.status === 4" type="warning" @click="confirmDaohuo">
                确认收货
              </el-button>
              <el-button v-if="safe && ([5, 6].some((i) => i == record.status))" type="danger" @click="shenQingAndAcceptTuiHuo">
                帮助用户退货
              </el-button>
              <el-button v-if="safe && record.status === 7" type="warning" @click="acceptTuiHuo">
                同意用户退货
              </el-button>
              <el-button v-if="safe && record.status === 7" type="success" @click="notAcceptTuiHuo">
                拒绝用户退货
              </el-button>
              <el-button v-if="safe && record.status === 8" type="primary" @click="startTuiHuoDengJi">
                帮助用户登记退货
              </el-button>
              <el-button v-if="safe && record.status === 9" type="primary" @click="confirmTuiHuo">
                确认退货到货
              </el-button>
              <el-button v-if="safe && record.status === 10" type="danger" @click="shenQingAndAcceptTuiHuo">
                帮助用户再次退货
              </el-button>
              <el-button v-if="safe && record.status === 12" type="danger" @click="acceptQuXiao">
                同意取消订单
              </el-button>
              <el-button v-if="safe && record.status === 12" type="primary" @click="notAcceptQuXiao">
                拒绝取消订单
              </el-button>
              <el-button v-if="safe" type="success" @click="showTuiHuoLocation">
                查看商家退货地址
              </el-button>
              <el-button v-if="safe" type="warning" @click="startChangeShop">
                更改商家发货地址
              </el-button>
            </el-button-group>
        </div>
      </template>
      <div style="display: flex; justify-content: left">
        <div>
          <div>
            <el-text v-if="record.down">
              销售情况：商品下架啦
            </el-text>
            <el-text v-else>
              销售情况：正常销售中
            </el-text>
          </div>
          <div class="info_box">
            <el-text>
              购物状态：{{ (AdminBuyRecordStatus[record.status]) || "未知" }}
            </el-text>
          </div>
          <div class="info_box">
            <el-text>
              购买数量：{{ record.num }} 件
            </el-text>
          </div>
          <div class="info_box">
            <el-text>
              付款金额：￥{{ ((record.totalPrice / 100).toFixed(2)) }}
            </el-text>
          </div>
          <div class="info_box">
            <el-text>
              商品单价：￥{{ ((record.price / 100).toFixed(2)) }}
            </el-text>
          </div>
          <div class="info_box">
            <el-text>
              下单时间：{{ formatDate(record.time) }}
            </el-text>
          </div>
          <div v-if="record.user.remark">
            <el-text>
              用户备注：{{ record.user.remark }}
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
          <div v-if="[7, 8, 9, 11].some((i) => i == record.status)">
            <el-text>
              申请退货时间：{{ formatDate(record.dengjituihuotime) }}
            </el-text>
          </div>
          <div v-if="[8, 9, 11].some((i) => i == record.status)">
            <el-text>
              退货登记时间：{{ formatDate(record.tuihuoshenqingtime) }}
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
      v-model="tuihuoDengjiModel"
      width="25%"
      destroy-on-close
  >
    <template #title>
      <div style="width: 100%; display: flex; justify-content: center">
        <el-text style="font-size: 1vw">
          帮助用户退货
        </el-text>
      </div>
    </template>
    <div style="width: 100%; display: flex; justify-content: center">
      <div>
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
          </el-form>
        </div>
        <div style="width: 15vw; margin-top: 5px; display: flex; justify-content: center">
          <el-button-group>
            <el-button type="info" @click="tuihuoDengjiModel = false">取消</el-button>
            <el-button :disabled="!tuihuoDengjiAllCheck" type="primary" @click="tuiHuoDengji">
              立即登记
            </el-button>
          </el-button-group>
        </div>
        <div style="width: 15vw; margin-top: 5px">
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
      v-model="fahuoDengjiModel"
      width="25%"
      destroy-on-close
  >
    <template #title>
      <div style="width: 100%; display: flex; justify-content: center">
        <el-text style="font-size: 1vw">
          发货信息登记
        </el-text>
      </div>
    </template>

    <div style="width: 100%; display: flex; justify-content: center">
      <div>
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
        <div v-if="record.user.wechat" class="location_info">
          <el-text>
            联系微信：{{ record.user.wechat }}
          </el-text>
        </div>
        <div v-if="record.user.email" class="location_info">
          <el-text>
            联系邮箱：{{ record.user.email }}
          </el-text>
        </div>
        <div v-if="record.user.remark" class="location_info">
          <el-text>
            备注：{{ record.user.remark }}
          </el-text>
        </div>
        <el-divider style="margin-top: 30px"></el-divider>
        <div>
          <el-form :model="fahuoDengjiForm" label-width="auto" style="width: 15vw">
            <el-form-item>
              <template #label>
                <el-text>快递公司</el-text>
              </template>
              <el-input
                  v-model="fahuoDengjiForm.kuaidi"
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
                  v-model="fahuoDengjiForm.danhao"
                  maxlength="100"
                  minlength="1"
                  show-word-limit
                  clearable
              />
            </el-form-item>
          </el-form>
        </div>
        <div style="width: 15vw; margin-top: 5px; display: flex; justify-content: center">
          <el-button-group>
            <el-button type="info" @click="fahuoDengjiModel = false">取消</el-button>
            <el-button :disabled="!fahuoDengjiAllCheck" type="primary" @click="faHuoDengji">
              立即登记
            </el-button>
          </el-button-group>
        </div>
        <div>
          <div v-if="!fahuoDengjiKuaidiCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请填写快递公司！若没有可填写暂无。" :closable="false" type="warning" center show-icon>
            </el-alert>
          </div>
          <div v-if="!fahuoDengjiDanhaoCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请填写快递运单号码！若没有可填写暂无。" :closable="false" type="warning" center show-icon>
            </el-alert>
          </div>
        </div>
      </div>
    </div>
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
      v-model="tuihuoLocationModel"
      width="15vw"
  >
    <template #title>
      <div style="width: 100%; display: flex; justify-content: center">
        <el-text style="font-size: 1vw">
          {{ record.wupin.name }}商家地址/退货地址
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
  <el-dialog
      v-model="changeShopModel"
      width="500"
  >
    <template #title>
      <div style="width: 100%; display: flex; justify-content: center">
        <el-text style="font-size: 1vw">
          商户地址信息更改
        </el-text>
      </div>
    </template>
    <div style="display: flex; justify-content: center; width: 100%;" >
      <el-form :model="changeShopForm" label-width="auto" style="width: 15vw">
        <el-form-item>
          <template #label>
            <el-text>收件人</el-text>
          </template>
          <el-input
              v-model="changeShopForm.name"
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
              v-model="changeShopForm.phone"
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
          <el-input v-model="changeShopForm.location" minlength="0" maxlength="150" show-word-limit/>
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>微信号</el-text>
          </template>
          <el-input v-model="changeShopForm.wechat" minlength="0" maxlength="30" show-word-limit/>
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>邮箱</el-text>
          </template>
          <el-input v-model="changeShopForm.email" minlength="0" maxlength="30" show-word-limit/>
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>备注</el-text>
          </template>
          <el-input v-model="changeShopForm.remark"  minlength="0" maxlength="150" show-word-limit type="textarea" :rows="3"/>
        </el-form-item>
      </el-form>
    </div>
    <div style="display: flex; justify-content: center; width: 100%; margin-top: 10px;">
      <el-button-group>
        <el-button type="info" @click="changeShopModel = false">取消</el-button>
        <el-button :disabled="!changeShopAllCheck" type="primary" @click="changeShop">
          确定
        </el-button>
      </el-button-group>
    </div>
    <div style="display: flex; justify-content: center; width: 100%; margin-top: 10px;">
      <div>
        <div v-if="!changeShopCheckName" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="名字需要在1-10位！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
        <div v-if="!changeShopPhoneCheck" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的手机号！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
        <div v-if="!changeShopEmailCheck" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的邮箱！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
        <div v-if="!changeShopCheckLocation" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的收件地址！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
      </div>
    </div>
  </el-dialog>
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