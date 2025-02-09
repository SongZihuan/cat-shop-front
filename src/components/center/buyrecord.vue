<script setup lang="ts">
  import { BuyRecord as BuyRecordData } from '#/center/buyrecord'
  import { formatDate } from '@/utils/time'
  import { ElNotification } from 'element-plus'
  import { LocationForUser } from '#/center/pay'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import {
    apiPostGouWuPingJia,
    apiPostGouWuDaoHuo,
    apiPostFaHuoQuXiaoShenQing,
    apiPostTuiHuoDengJi,
    apiPostTuiHuoShenQing,
    apiPostQuXiaoPay,
    apiPostChangeUser
  } from '#/center/huo'
  import useUserStore from '@/store/user'
  import { isEmail, isMobile } from '@/utils/str'
  import useConfigStore from '@/store/config'
  import { AdminBuyRecordStatus } from '#/admin/buyrecord'
  import BuyNew from '@/components/shop/buynew.vue'

  const configStore = useConfigStore()
  const router = useRouter()

  const props = defineProps({
    record: {
      type: Object as PropType<BuyRecordData>,
      required: true
    },
    safe: {
      type: Boolean,
      default: false
    },
    zhifutishi: {
      type: Boolean,
      default: false
    },
    xiangqing: {
      type: Boolean,
      default: false
    }
  })

  const emits = defineEmits(['reload'])

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
        duration: 5000,
        position: 'top-left'
      })
    }
  })

  const onGoWupinConfirm = () => {
    if (!record.value) {
      // NO-THING-TO-DO
    } else if (record.value.down) {
      ElMessageBox.confirm(
        `是否确认前往商品 ${record.value.wupin.name} 的购买时备份信息页面（商品已经下架）？`,
        '温馨提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        onGoLockWupin()
      })
    } else {
      ElMessageBox.confirm(`是否确认前往商品 ${record.value.wupin.name} 的售卖页面？`, '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        onGoWupin()
      })
    }
  }

  const onGoWupin = () => {
    record.value &&
      !record.value.down &&
      router.push({
        path: '/user/shop/wupin/sale',
        query: {
          nowRecordId: record.value.id
        }
      })
  }

  const onGoLockWupin = () => {
    record.value &&
      router.push({
        path: '/user/shop/wupin/lock',
        query: {
          recordId: record.value.id
        }
      })
  }

  const onXiangQing = () => {
    record.value &&
      router.push({
        path: '/user/center/buyrecord',
        query: {
          id: record.value.id
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
    code.value = ''
  }
  const code = ref('')
  const answer = computed(() => a.value + b.value)
  const question = computed(() => `${a.value} + ${b.value}`)
  const codeCheck = computed(() => Number(code.value).valueOf() === answer.value)

  const stopRepay = () => {
    ElMessageBox.confirm('你尚未支付成功，是否取消支付？', '支付提示', {
      confirmButtonText: '取消支付',
      cancelButtonText: '稍后支付',
      type: 'warning'
    }).then(() => {
      apiPostQuXiaoPay(record.value.id).then((res) => {
        if (res.data.data.success) {
          ElMessage({
            type: 'success',
            message: '取消支付成功'
          })
          emits('reload')
        } else {
          ElMessage({
            type: 'error',
            message: '取消支付失败'
          })
        }
      })
    })
  }

  const byn = ref(null as any)
  const startRepay = () => {
    if (!byn.value) {
      ElMessage({
        type: 'warning',
        message: '系统出现了问题，请重试。'
      })
      return
    }

    if (record.value.num <= 0) {
      return
    }

    byn.value.openWithRepay(record.value)
  }

  const confirmDaohuo = () => {
    if (!record.value || record.value.status !== 4) {
      return
    }

    ElMessageBox.confirm('你是否已经确认收到货物？', '到货提示', {
      confirmButtonText: '确认收到货',
      cancelButtonText: '还未收到货',
      type: 'warning'
    }).then(() => {
      apiPostGouWuDaoHuo(record.value.id).then((res) => {
        if (res.data.data.success) {
          ElMessage({
            type: 'success',
            message: '确认收货成功'
          })
          emits('reload')
        } else {
          ElMessage({
            type: 'error',
            message: '确认收货失败'
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
        type: 'warning'
      }
    ).then(() => {
      apiPostFaHuoQuXiaoShenQing(record.value.id).then((res) => {
        if (res.data.data.success) {
          ElMessage({
            type: 'success',
            message: '申请取消发货成功'
          })
          emits('reload')
        } else {
          ElMessage({
            type: 'error',
            message: '申请取消发货失败'
          })
        }
      })
    })
  }

  const giveGood = () => {
    if (!record.value || record.value.status !== 5) {
      return
    }

    ElMessageBox.confirm('你确定给好评吗？', '好评提示', {
      confirmButtonText: '确定',
      cancelButtonText: '再想想',
      type: 'warning'
    }).then(() => {
      apiPostGouWuPingJia(record.value.id, true).then((res) => {
        if (res.data.data.success) {
          ElMessage({
            type: 'success',
            message: '好评成功'
          })
          emits('reload')
        } else {
          ElMessage({
            type: 'error',
            message: '好评失败'
          })
        }
      })
    })
  }

  const giveNotGood = () => {
    if (!record.value || record.value.status !== 5) {
      return
    }

    ElMessageBox.confirm('你确定不予置评吗？', '好评提示', {
      confirmButtonText: '确定',
      cancelButtonText: '再想想',
      type: 'warning'
    }).then(() => {
      apiPostGouWuPingJia(record.value.id, false).then((res) => {
        if (res.data.data.success) {
          ElMessage({
            type: 'success',
            message: '评价成功'
          })
          emits('reload')
        } else {
          ElMessage({
            type: 'error',
            message: '评价失败'
          })
        }
      })
    })
  }

  const userStore = useUserStore()

  const tuihuoTitle = ref('申请退货')
  const tuihuoModel = ref(false)
  const tuihuoForm = ref({
    name: userStore.user.name,
    phone: userStore.user.phone,
    reason: ''
  })
  const tuiHuoNameCheck = computed(
    () => tuihuoForm.value.name && tuihuoForm.value.name.length > 0 && tuihuoForm.value.name.length <= 10
  )
  const tuiHuoPhoneCheck = computed(() => isMobile(tuihuoForm.value.phone))
  const tuihuoReasonCheck = computed(
    () => tuihuoForm.value.reason && tuihuoForm.value.reason.length > 10 && tuihuoForm.value.reason.length <= 250
  )
  const tuihuoAllCheck = computed(
    () => codeCheck.value && tuiHuoNameCheck.value && tuiHuoPhoneCheck.value && tuihuoReasonCheck.value
  )

  const startTuiHuo = () => {
    if (!record.value || [3, 5, 6].every((i) => i != record.value.status)) {
      return
    }

    resetCode()
    tuihuoTitle.value = '申请退货'
    tuihuoModel.value = true
  }

  const startReTuiHuo = () => {
    if (!record.value || record.value.status != 10) {
      return
    }

    resetCode()
    tuihuoTitle.value = '重新申请退货'
    tuihuoModel.value = true
  }

  const tuiHuo = () => {
    if (!record.value || [5, 6, 10].every((i) => i != record.value.status)) {
      return
    }

    ElMessageBox.confirm('你确定进行退货申请登记吗？登记并不是100%通过，你可以致电客服取得联系。', '退货提示', {
      confirmButtonText: '退货',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      apiPostTuiHuoShenQing(
        record.value.id,
        tuihuoForm.value.name,
        tuihuoForm.value.phone,
        tuihuoForm.value.reason
      ).then((res) => {
        if (res.data.data.success) {
          ElMessage({
            type: 'success',
            message: tuihuoTitle.value + '成功'
          })
          emits('reload')
          tuihuoModel.value = false
        } else {
          ElMessage({
            type: 'error',
            message: tuihuoTitle.value + '成功'
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
    kuaidi: '',
    danhao: ''
  })
  const tuihuoDengjiKuaidiCheck = computed(
    () => tuihuoDengjiForm.value.kuaidi && tuihuoDengjiForm.value.kuaidi.length > 0
  )
  const tuihuoDengjiDanhaoCheck = computed(
    () => tuihuoDengjiForm.value.danhao && tuihuoDengjiForm.value.danhao.length > 0
  )
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

    ElMessageBox.confirm('你确定要登记你的退货信息吗？请确保信息准确无误。', '登记提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      apiPostTuiHuoDengJi(record.value.id, tuihuoDengjiForm.value.kuaidi, tuihuoDengjiForm.value.danhao).then((res) => {
        if (res.data.data.success) {
          ElMessage({
            type: 'success',
            message: '退货登记成功'
          })
          emits('reload')
          tuihuoDengjiModel.value = false
        } else {
          ElMessage({
            type: 'error',
            message: '发货登记成功'
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
    remark: ''
  } as LocationForUser)

  const changeUserCheckLocation = computed(
    () => changeUserForm.value.location && changeUserForm.value.location.length > 0
  )
  const changeUserCheckName = computed(
    () => changeUserForm.value.name && changeUserForm.value.name.length > 0 && changeUserForm.value.name.length <= 10
  )
  const changeUserPhoneCheck = computed(() => isMobile(changeUserForm.value.phone))
  const changeUserEmailCheck = computed(() => {
    if (!changeUserForm.value.email) {
      return true
    }
    return isEmail(changeUserForm.value.email)
  })
  const changeUserAllCheck = computed(
    () =>
      codeCheck.value &&
      changeUserCheckLocation.value &&
      changeUserCheckName.value &&
      changeUserPhoneCheck.value &&
      changeUserEmailCheck.value
  )

  const startChangeUser = () => {
    if (!record.value || ![1, 2, 3].some((i) => i == record.value.status)) {
      return
    }

    resetCode()
    changeUserModel.value = true
  }

  const changeUser = () => {
    if (!record.value || ![1, 2, 3].some((i) => i == record.value.status)) {
      return
    }

    ElMessageBox.confirm('你确定要更改你的收货信息了吗？', '更改提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      apiPostChangeUser(record.value.id, changeUserForm.value).then((res) => {
        if (res.data.data.success) {
          ElMessage({
            type: 'success',
            message: '收货信息更改成功'
          })
          emits('reload')
          changeUserModel.value = false
        } else {
          ElMessage({
            type: 'error',
            message: '收货信息更改失败'
          })
        }
      })
    })
  }

  const wupinNameClass = computed(() => {
    if (record.value.down) {
      return ['wupin_name']
    }

    return ['wupin_name', 'wupin_name_click']
  })

  const maxWidth = ref('0')
  const maxText = ref(0)
  const boxWidth = ref(0)
  const count = ref(0)
  const getMaxWidth = () => {
    const child = document.querySelectorAll('.components-center-buyrecord-info-box')
    child.forEach((i: Element) => {
      const element: HTMLElement = i as unknown as HTMLElement
      if (element.offsetWidth + 20 > maxText.value) {
        maxText.value = element.offsetWidth + 20
      }
    })

    if (infoBox.value) {
      boxWidth.value = infoBox.value.offsetWidth
      count.value = Math.floor(boxWidth.value / maxText.value)
      maxWidth.value = boxWidth.value / count.value + 'px'
    }
  }

  onMounted(() => {
    getMaxWidth()
  })

  onUpdated(() => {
    getMaxWidth()
  })

  const infoBox = ref<HTMLElement>()
</script>

<template>
  <el-card v-if="record" class="base_card">
    <template #header>
      <div style="display: flow-root">
        <div style="float: left">
          <el-badge :value="record.wupin.tag" style="margin-top: 10px">
            <el-text :class="wupinNameClass" @click="onGoWupinConfirm"> {{ record.wupin.name }} </el-text>
          </el-badge>
        </div>
        <div style="float: right">
          <el-button-group>
            <el-button v-if="xiangqing" type="success" size="large" class="class_btn" @click="onXiangQing">
              查看详情
            </el-button>
            <el-button v-if="safe && record.down" type="success" size="large" class="class_btn" disabled>
              商品已下架
            </el-button>
            <el-button
              v-else-if="safe && !record.down"
              type="success"
              size="large"
              class="class_btn"
              @click="onGoWupin"
            >
              查看商品售卖页
            </el-button>
            <el-tooltip
              v-if="safe && record.down"
              effect="dark"
              placement="bottom"
              content="原商品已经下架，此处是您购买商品时信息的备份内容。"
            >
              <el-button type="primary" size="large" class="class_btn" @click="onGoLockWupin">
                查看商品售卖存档页
              </el-button>
            </el-tooltip>
            <el-tooltip
              v-else-if="safe && !record.down"
              effect="dark"
              placement="bottom"
              content="此处是您购买商品时信息的备份内容。"
            >
              <el-button type="primary" size="large" class="class_btn" @click="onGoLockWupin">
                查看商品售卖存档页
              </el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="footer_btn">
        <el-button v-if="safe && record.status === 2" type="danger" @click="stopRepay"> 取消支付 </el-button>
        <el-button v-if="safe && record.status === 2" type="warning" @click="startRepay"> 重新支付 </el-button>
        <el-button v-if="safe && record.status === 3" type="warning" @click="quXiao"> 取消发货 </el-button>
        <el-button v-if="safe && [1, 2, 3].some((i) => i == record.status)" type="warning" @click="startChangeUser">
          更改收货地址
        </el-button>
        <el-button v-if="safe && record.status === 4" type="success" @click="confirmDaohuo"> 确认收货 </el-button>
        <el-button v-if="safe && record.status === 5" type="success" @click="giveGood"> 给个好评 </el-button>
        <el-button v-if="safe && record.status === 5" type="info" @click="giveNotGood"> 不予置评 </el-button>
        <el-button v-if="safe && [3, 5, 6].some((i) => i == record.status)" type="danger" @click="startTuiHuo">
          申请退货
        </el-button>
        <el-button v-if="safe && record.status === 8" type="success" @click="startTuiHuoDengJi">
          登记退货信息
        </el-button>
        <el-button v-if="safe && record.status === 10" type="danger" @click="startReTuiHuo"> 重新申请退货 </el-button>
        <el-button v-if="safe" type="primary" @click="showTuiHuoLocation">
          <span v-if="[7, 8, 9, 10, 11].some((i) => i == record.status)"> 查看退货地址 </span>
          <span v-else> 查看商家地址 </span>
        </el-button>
        <el-button v-if="safe" type="success" @click="showFaHuoLocation"> 查看收货地址 </el-button>
      </div>
    </template>
    <div class="outside">
      <div ref="infoBox" class="box_room">
        <div class="info_box">
          <el-text class="info_text components-center-buyrecord-info-box">
            本次消费进度：{{ AdminBuyRecordStatus[record.status] || '未知' }}
          </el-text>
        </div>
        <div class="info_box">
          <el-text v-if="record.down" class="info_text components-center-buyrecord-info-box">
            商品销售情况：商品下架啦，但不会影响你已确认付款的订单。
          </el-text>
          <el-text v-else class="info_text components-center-buyrecord-info-box"> 商品销售情况：正常销售中 </el-text>
        </div>
        <div class="info_box">
          <el-text
            v-if="
              record.classId !== 1 && record.wupin && record.wupin.classOf && record.wupin.classOf.id === record.classId
            "
            class="info_text components-center-buyrecord-info-box"
          >
            商品分类：{{ record.wupin.classOf.name }}
          </el-text>
          <el-text v-else class="info_text components-center-buyrecord-info-box"> 商品分类：暂无 </el-text>
        </div>
        <div class="info_box">
          <el-text class="info_text components-center-buyrecord-info-box"> 购买数量：{{ record.num }} 件 </el-text>
        </div>
        <div class="info_box">
          <el-text class="info_text components-center-buyrecord-info-box">
            付款金额：￥{{ (record.totalPrice / 100).toFixed(2) }}
          </el-text>
        </div>
        <div class="info_box">
          <el-text class="info_text components-center-buyrecord-info-box">
            商品单价：￥{{ (record.price / 100).toFixed(2) }}
          </el-text>
        </div>
        <div class="info_box">
          <el-text class="info_text components-center-buyrecord-info-box">
            下单时间：{{ formatDate(record.time) }}
          </el-text>
        </div>
        <div v-if="[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].some((i) => i == record.status)" class="info_box">
          <el-text class="info_text components-center-buyrecord-info-box">
            付款时间：{{ formatDate(record.fukuantime) }}
          </el-text>
        </div>
        <div v-if="[4, 5, 6, 7, 8, 9, 10, 11].some((i) => i == record.status)" class="info_box">
          <el-text class="info_text components-center-buyrecord-info-box">
            发货时间：{{ formatDate(record.fahuotime) }}
          </el-text>
        </div>
        <div
          v-if="[4, 5, 6, 7, 8, 9, 10, 11].some((i) => i == record.status) && record.kuaidi && record.kuaidinum"
          class="info_box"
        >
          <el-text class="info_text components-center-buyrecord-info-box"> 发货快递公司：{{ record.kuaidi }} </el-text>
        </div>
        <div
          v-if="[4, 5, 6, 7, 8, 9, 10, 11].some((i) => i == record.status) && record.kuaidi && record.kuaidinum"
          class="info_box"
        >
          <el-text class="info_text components-center-buyrecord-info-box"> 发货运单号：{{ record.kuaidinum }} </el-text>
        </div>
        <div v-if="[5, 6, 7, 8, 9, 10, 11].some((i) => i == record.status)" class="info_box">
          <el-text class="info_text components-center-buyrecord-info-box">
            到货时间：{{ formatDate(record.shouhuotime) }}
          </el-text>
        </div>
        <div v-if="[6, 7, 8, 9, 10, 11].some((i) => i == record.status)" class="info_box">
          <el-text class="info_text components-center-buyrecord-info-box">
            评价时间：{{ formatDate(record.pingjiatime) }}
          </el-text>
        </div>
        <div v-if="[6, 7, 8, 9, 10, 11].some((i) => i == record.status)" class="info_box">
          <el-text class="info_text components-center-buyrecord-info-box">
            评价：{{ record.isgood ? '好评' : '不予置评' }}
          </el-text>
        </div>
        <div v-if="[7, 8, 9, 10, 11].some((i) => i == record.status)" class="info_box">
          <el-text class="info_text components-center-buyrecord-info-box">
            申请退货时间：{{ formatDate(record.dengjituihuotime) }}
          </el-text>
        </div>
        <div v-if="[8, 9, 10, 11].some((i) => i == record.status)" class="info_box">
          <el-text v-if="record.status === 8" class="info_text components-center-buyrecord-info-box">
            申请退货情况：卖家同意退货，请尽快根据地址寄回商品，并上传物流信息。
          </el-text>
          <el-text v-else-if="record.status === 9" class="info_text components-center-buyrecord-info-box">
            申请退货情况：卖家同意退货，等待卖家收货。
          </el-text>
          <el-text v-else-if="record.status === 10" class="info_text components-center-buyrecord-info-box">
            申请退货情况：卖家不同意退货，请联系卖家。
          </el-text>
          <el-text v-else-if="record.status === 11" class="info_text components-center-buyrecord-info-box">
            申请退货情况：卖家已完成退货。
          </el-text>
        </div>
        <div v-if="[8, 9, 11].some((i) => i == record.status)" class="info_box">
          <el-text class="info_text components-center-buyrecord-info-box">
            同意退货时间：{{ formatDate(record.querentuihuotime) }}
          </el-text>
        </div>
        <div
          v-if="[9, 11].some((i) => i == record.status) && record.backkuaidi && record.backkuaidinum"
          class="info_box"
        >
          <el-text class="info_text components-center-buyrecord-info-box">
            退货快递公司：{{ record.backkuaidi }}
          </el-text>
        </div>
        <div
          v-if="[9, 11].some((i) => i == record.status) && record.backkuaidi && record.backkuaidinum"
          class="info_box"
        >
          <el-text class="info_text components-center-buyrecord-info-box">
            退货单号：{{ record.backkuaidinum }}
          </el-text>
        </div>
        <div v-if="[11].some((i) => i == record.status)" class="info_box">
          <el-text class="info_text components-center-buyrecord-info-box">
            退货到货时间：{{ formatDate(record.tuohuotime) }}
          </el-text>
        </div>
        <div v-if="[12, 13].some((i) => i == record.status)" class="info_box">
          <el-text v-if="record.status === 12" class="info_text components-center-buyrecord-info-box">
            申请取消发货情况：正在尝试取消发货。
          </el-text>
          <el-text v-if="record.status === 13" class="info_text components-center-buyrecord-info-box">
            申请取消发货情况：已经为您取消发货。
          </el-text>
        </div>
        <div v-if="[13].some((i) => i == record.status)" class="info_box">
          <el-text class="info_text components-center-buyrecord-info-box">
            确认取消发货时间：{{ formatDate(record.quxiaotime) }}
          </el-text>
        </div>
      </div>
    </div>
  </el-card>
  <div v-else>
    <el-result icon="warning" title="此商品已下架" sub-title="欢迎到别处去看看吧">
      <template #extra>
        <el-button type="primary">到我的中心</el-button>
      </template>
    </el-result>
  </div>
  <BuyNew ref="byn"></BuyNew>
  <el-dialog v-model="tuihuoDengjiModel" width="25%" destroy-on-close>
    <template #title>
      <div style="width: 100%; display: flex; justify-content: center">
        <el-text style="font-size: 1vw"> 退货信息登记 </el-text>
      </div>
    </template>
    <div style="width: 100%; display: flex; justify-content: center">
      <div>
        <div class="location_info">
          <el-text>
            收件人：{{ record.shop.name || record.wupin.ren || configStore.config.name || '未知商铺' }}
          </el-text>
        </div>
        <div class="location_info">
          <el-text>
            收件号码：{{ record.shop.phone || record.wupin.phone || configStore.config.hotline || '000-00000000' }}
          </el-text>
        </div>
        <div class="location_info">
          <el-text> 收件地址：{{ record.shop.location || record.wupin.location || '按快递原路返回' }} </el-text>
        </div>
        <div v-if="record.shop.wechat || record.wupin.wechat || configStore.config.wechat" class="location_info">
          <el-text> 联系微信：{{ record.shop.wechat || record.wupin.wechat || configStore.config.wechat }} </el-text>
        </div>
        <div v-if="record.shop.email || record.wupin.email" class="location_info">
          <el-text> 联系邮箱：{{ record.shop.email || record.wupin.email }} </el-text>
        </div>
        <div v-if="record.shop.remark" class="location_info">
          <el-text> 备注：{{ record.shop.remark }} </el-text>
        </div>
        <el-divider style="margin-top: 30px"></el-divider>
        <div>
          <el-form :model="tuihuoDengjiForm" label-width="auto" style="width: 15vw">
            <el-form-item>
              <template #label>
                <el-text>快递公司</el-text>
              </template>
              <el-input v-model="tuihuoDengjiForm.kuaidi" maxlength="50" minlength="1" show-word-limit clearable />
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>快递面单号码</el-text>
              </template>
              <el-input v-model="tuihuoDengjiForm.danhao" maxlength="100" minlength="1" show-word-limit clearable />
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
            <el-button type="info" @click="tuihuoDengjiModel = false">取消</el-button>
            <el-button :disabled="!tuihuoDengjiAllCheck" type="primary" @click="tuiHuoDengji"> 立即申请 </el-button>
          </el-button-group>
        </div>
        <div style="width: 15vw; margin-top: 5px">
          <div v-if="!codeCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请输入正确的验证码！" :closable="false" type="warning" center show-icon> </el-alert>
          </div>
          <div v-if="!tuihuoDengjiKuaidiCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请填写快递公司！" :closable="false" type="warning" center show-icon> </el-alert>
          </div>
          <div v-if="!tuihuoDengjiDanhaoCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请填写快递运单号码！" :closable="false" type="warning" center show-icon> </el-alert>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
  <el-dialog v-model="tuihuoModel" width="25%" destroy-on-close>
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
            <el-text> 购买数量：{{ record.num }} 件 </el-text>
          </div>
          <div class="repay_info">
            <el-text> 商品单价：￥{{ (record.price / 100).toFixed(2) }} </el-text>
          </div>
          <div class="repay_info">
            <el-text class="pay_price"> 付款金额：￥{{ (record.totalPrice / 100).toFixed(2) }} </el-text>
          </div>
        </div>
        <el-divider style="margin-top: 30px"></el-divider>
        <div>
          <el-form :model="tuihuoForm" label-width="auto" style="width: 15vw">
            <el-form-item>
              <template #label>
                <el-text>退货联系人</el-text>
              </template>
              <el-input v-model="tuihuoForm.name" maxlength="10" minlength="1" show-word-limit clearable />
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>退货联系人电话</el-text>
              </template>
              <el-input v-model="tuihuoForm.phone" maxlength="20" minlength="1" show-word-limit clearable />
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
            <el-button type="info" @click="tuihuoModel = false">取消申请</el-button>
            <el-button :disabled="!tuihuoAllCheck" type="primary" @click="tuiHuo"> 立即申请 </el-button>
          </el-button-group>
        </div>
        <div style="width: 15vw; margin-top: 5px">
          <div v-if="!codeCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="请输入正确的验证码！" :closable="false" type="warning" center show-icon> </el-alert>
          </div>
          <div v-if="!tuiHuoNameCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="联系人姓名字数应该为1-10个！" :closable="false" type="warning" center show-icon>
            </el-alert>
          </div>
          <div v-if="!tuiHuoPhoneCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="手机号不正确！" :closable="false" type="warning" center show-icon> </el-alert>
          </div>
          <div v-if="!tuihuoReasonCheck" class="tip_box" style="display: flex; justify-content: center">
            <el-alert title="退货原因应在10-250个字以内！" :closable="false" type="warning" center show-icon>
            </el-alert>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
  <el-dialog v-model="tuihuoLocationModel" width="15vw">
    <template #title>
      <div style="width: 100%; display: flex; justify-content: center">
        <el-text style="font-size: 1vw">
          <span v-if="[7, 8, 9, 10, 11].some((i) => i == record.status)"> {{ record.wupin.name }}退货地址 </span>
          <span v-else> {{ record.wupin.name }}商家地址 </span>
        </el-text>
      </div>
    </template>

    <div class="location_box">
      <div class="location_info">
        <el-text> 收件人：{{ record.shop.name || record.wupin.ren || configStore.config.name || '未知商铺' }} </el-text>
      </div>
      <div class="location_info">
        <el-text>
          收件号码：{{ record.shop.phone || record.wupin.phone || configStore.config.hotline || '000-00000000' }}
        </el-text>
      </div>
      <div class="location_info">
        <el-text> 收件地址：{{ record.shop.location || record.wupin.location || '按快递原路返回' }} </el-text>
      </div>
      <div v-if="record.shop.wechat || record.wupin.wechat || configStore.config.wechat" class="location_info">
        <el-text> 联系微信：{{ record.shop.wechat || record.wupin.wechat || configStore.config.wechat }} </el-text>
      </div>
      <div v-if="record.shop.email || record.wupin.email" class="location_info">
        <el-text> 联系邮箱：{{ record.shop.email || record.wupin.email }} </el-text>
      </div>
      <div v-if="record.shop.remark" class="location_info">
        <el-text> 备注：{{ record.shop.remark }} </el-text>
      </div>
    </div>
    <template #footer>
      <div style="display: flex; width: 100%; justify-content: right">
        <el-button type="success" @click="tuihuoLocationModel = false">好的</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="fahuoLocationModel" width="500">
    <template #title>
      <div style="width: 100%; display: flex; justify-content: center">
        <el-text style="font-size: 1vw"> {{ record.wupin.name }}发货地址 </el-text>
      </div>
    </template>

    <div class="location_box">
      <div class="location_info">
        <el-text> 收件人：{{ record.user.name }} </el-text>
      </div>
      <div class="location_info">
        <el-text> 收件号码：{{ record.user.phone }} </el-text>
      </div>
      <div class="location_info">
        <el-text> 收件地址：{{ record.user.location }} </el-text>
      </div>
      <div v-if="record.wupin.wechat" class="location_info">
        <el-text> 联系微信：{{ record.user.wechat }} </el-text>
      </div>
      <div v-if="record.wupin.email" class="location_info">
        <el-text> 联系邮箱：{{ record.user.email }} </el-text>
      </div>
      <div v-if="record.user.remark" class="location_info">
        <el-text> 备注：{{ record.user.remark }} </el-text>
      </div>
    </div>
    <template #footer>
      <div style="display: flex; width: 100%; justify-content: right">
        <el-button type="success" @click="fahuoLocationModel = false">好的</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="changeUserModel" width="500">
    <template #title>
      <div style="width: 100%; display: flex; justify-content: center">
        <el-text style="font-size: 1vw"> 用户收件人信息修改 </el-text>
      </div>
    </template>
    <div style="display: flex; justify-content: center; width: 100%">
      <el-form :model="changeUserForm" label-width="auto" style="width: 15vw">
        <el-form-item>
          <template #label>
            <el-text>收件人</el-text>
          </template>
          <el-input v-model="changeUserForm.name" maxlength="10" minlength="1" show-word-limit clearable />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>收件号码</el-text>
          </template>
          <el-input v-model="changeUserForm.phone" maxlength="20" minlength="1" show-word-limit clearable />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>收件地址</el-text>
          </template>
          <el-input v-model="changeUserForm.location" minlength="0" maxlength="150" show-word-limit />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>微信号</el-text>
          </template>
          <el-input v-model="changeUserForm.wechat" minlength="0" maxlength="30" show-word-limit />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>邮箱</el-text>
          </template>
          <el-input v-model="changeUserForm.email" minlength="0" maxlength="30" show-word-limit />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>备注</el-text>
          </template>
          <el-input
            v-model="changeUserForm.remark"
            minlength="0"
            maxlength="150"
            show-word-limit
            type="textarea"
            :rows="3"
          />
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
    <div style="display: flex; justify-content: center; width: 100%">
      <el-button-group>
        <el-button type="info" @click="changeUserModel = false">取消</el-button>
        <el-button :disabled="!changeUserAllCheck" type="primary" @click="changeUser"> 确定 </el-button>
      </el-button-group>
    </div>
    <div style="display: flex; justify-content: center; width: 100%">
      <div>
        <div v-if="!codeCheck" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的验证码！" :closable="false" type="warning" center show-icon> </el-alert>
        </div>
        <div v-if="!changeUserCheckName" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="名字需要在1-10位！" :closable="false" type="warning" center show-icon> </el-alert>
        </div>
        <div v-if="!changeUserPhoneCheck" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的手机号！" :closable="false" type="warning" center show-icon> </el-alert>
        </div>
        <div v-if="!changeUserEmailCheck" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的邮箱！" :closable="false" type="warning" center show-icon> </el-alert>
        </div>
        <div v-if="!changeUserCheckLocation" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的收件地址！" :closable="false" type="warning" center show-icon> </el-alert>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
  .base_card {
    width: 98%;
    min-height: 0;
  }

  .title_name {
    width: calc(30% - 5px);
    margin-left: 2.6px;
  }

  .title_btn {
    width: calc(70% - 5px);
    margin-right: 2.6px;
  }

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
    font-size: 1.5rem;
    font-weight: bold;
    margin-right: 5px;
    vertical-align: bottom;
  }

  .wupin_name_click {
    cursor: pointer;
  }

  .wupin_name_click:hover {
    text-decoration: underline;
  }

  .wupin_name_click:active {
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

  .outside {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .box_room {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 100%;
  }

  .info_box {
    width: calc(v-bind(maxWidth) - 4px);
    margin-bottom: 10px;
  }

  .info_text {
    margin-right: 10px;
    margin-left: 10px;
  }

  .footer_btn > .el-button {
    margin-right: 5px;
    margin-left: 5px;
    margin-bottom: 5px;
    margin-top: 5px;
  }

  .footer_btn {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
</style>
