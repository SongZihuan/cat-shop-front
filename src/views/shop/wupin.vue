<script setup lang="ts">
  import { Wupin } from '@/store/hotwupin'
  import { ElNotification } from 'element-plus'
  import { Location } from '@element-plus/icons-vue'
  import { getFacePrice, getRealPrice, getTotalPrice } from '@/utils/price'
  import { apiPostAddToShoppingBag } from '#/center/shoppingbag'
  import { apiGetBuyRecordInfo, BuyRecord } from '#/center/buyrecord'
  import { apiGetWupin } from '#/center/wupin'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import Showhtml from '@/components/utils/showhtml.vue'

  const route = useRoute()
  const router = useRouter()

  const nowrecordmode = 'nowrecordmode'
  const recordmode = 'recordmode'
  const wupinmode = 'wupinmode'
  const nullmode = 'nullmode'

  const mode = ref(nullmode)

  const nowRecordId = ref(computed(() => parseInt(route.query.nowRecordId as unknown as string) || (0 as number)))
  const recordId = ref(computed(() => parseInt(route.query.recordId as unknown as string) || (0 as number)))
  const wupinId = ref(computed(() => parseInt(route.query.wupinId as unknown as string) || (0 as number)))

  const record = ref(null as BuyRecord | null)
  const wupin = ref(null as Wupin | null)
  const hasClass = computed(
    () =>
      wupin.value &&
      wupin.value.classId !== 1 &&
      wupin.value.classId !== 0 &&
      wupin.value.classOf &&
      wupin.value.classOf.id !== wupin.value.classId
  )

  if (nowRecordId.value && nowRecordId.value >= 0) {
    apiGetBuyRecordInfo(nowRecordId.value as number).then((res) => {
      record.value = res.data.data as BuyRecord
      wupin.value = record.value.nowwupin as Wupin
      mode.value = nowrecordmode
    })
  } else if (recordId.value && recordId.value >= 0) {
    apiGetBuyRecordInfo(recordId.value as number).then((res) => {
      record.value = res.data.data as BuyRecord
      wupin.value = record.value.wupin as Wupin
      mode.value = recordmode
    })
  } else if (wupinId.value && wupinId.value >= 0) {
    apiGetWupin(wupinId.value as number).then((res) => {
      record.value = null
      wupin.value = res.data.data as Wupin
      mode.value = wupinmode
    })
  } else {
    router.push({
      path: '/system/error',
      query: {
        msg: '商品不存在'
      }
    })
  }

  const num = ref(1)
  const realPrice = computed(() => {
    return getRealPrice(wupin.value?.realPrice)
  })
  const facePrice = computed(() => {
    return getFacePrice(wupin.value?.hotPrice, wupin.value?.realPrice)
  })
  const totalPrice = computed(() => {
    return getTotalPrice(wupin.value?.hotPrice, wupin.value?.realPrice, num.value)
  })

  const totalBuy = computed(() => (wupin.value && wupin.value.buytotal >= 0 ? wupin.value.buytotal : 0))
  const totalPingJia = computed(() => (wupin.value && wupin.value.buypingjia >= 0 ? wupin.value.buypingjia : 0))
  const totalBuyGood = computed(() => (wupin.value && wupin.value.buygood >= 0 ? wupin.value.buygood : 0))

  const goodBuyPre = computed(() => (totalBuyGood.value / totalPingJia.value) * 100)
  const goodBuyMsg = computed(() => {
    if (goodBuyPre.value >= 85) {
      return '好评如潮'
    } else if (goodBuyPre.value >= 50) {
      return '部分好评'
    } else if (goodBuyPre.value >= 30) {
      return '好评甚少'
    }

    return '谨慎购买'
  })

  const onClickBag = () => {
    wupin.value &&
      apiPostAddToShoppingBag(wupin.value.id, num.value).then((res) => {
        if (res.data.data.success) {
          wupin.value &&
            ElNotification({
              title: '已经加入购物车',
              message: `尊敬的用户您好，我们已经将 ${num.value}件 ${wupin.value.name} 添加到您的购物车。请您进行接下来的操作。若现在购买，预测价格为￥${totalPrice.value}。`,
              duration: 5000,
              type: 'success',
              position: 'top-left'
            })
        } else {
          ElMessage({
            type: 'error',
            message: '加入购物车失败'
          })
        }
      })
  }

  const onGoRecord = () => {
    if (mode.value === nowrecordmode) {
      router.push({
        path: '/user/center/buyrecord',
        query: {
          id: nowRecordId.value
        }
      })
    } else if (mode.value === recordmode) {
      router.push({
        path: '/user/center/buyrecord',
        query: {
          id: recordId.value
        }
      })
    }
  }

  const onSameClick = () => {
    wupin.value &&
      router.push({
        path: '/user/shop/search',
        query: {
          select: wupin.value.classId || 0,
          search: wupin.value.name || ''
        }
      })
  }

  const onClassClick = () => {
    if (wupin.value && hasClass.value) {
      ElMessageBox.alert(`该商品的类型为：${wupin.value.classOf.name}。`, '商品类型', {
        confirmButtonText: '确认'
      })
    } else if (wupin.value) {
      ElMessageBox.alert('该商品目前暂无类型分类', '商品类型', {
        confirmButtonText: '确认'
      })
    }
  }

  const byn = ref(null as any)
  const buy = () => {
    if (!byn.value) {
      ElMessage({
        type: 'warning',
        message: '系统出现了问题，请重试。'
      })
      return
    }

    if (num.value <= 0) {
      return
    }

    if (!byn.value.openWithNew(wupin.value, num.value)) {
      ElMessage({
        type: 'warning',
        message: '系统出现了问题，请重试。'
      })
    }
  }

  const headerCustomer = ref<HTMLElement>()
  const headerHeight = ref('0')
  const el_card_header_px = 37

  const updateHeaderHeight = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      headerHeight.value = entry.contentRect.height + el_card_header_px + 'px'
    })
  })

  const footerCustomer = ref<HTMLElement>()
  const footerHeight = ref('0')
  const el_card_footer_px = 37

  const updateFooterHeight = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      footerHeight.value = entry.contentRect.height + el_card_footer_px + 'px'
    })
  })

  watch(headerCustomer, () => headerCustomer.value && updateHeaderHeight.observe(headerCustomer.value))
  watch(footerCustomer, () => footerCustomer.value && updateFooterHeight.observe(footerCustomer.value))
</script>

<template>
  <el-card v-if="wupin" class="base_card">
    <template #header>
      <div ref="headerCustomer">
        <div style="display: flow-root">
          <div style="float: left">
            <el-badge :value="wupin.tag" style="margin-top: 10px">
              <el-text class="wupin_name"> {{ wupin.name }} </el-text>
            </el-badge>
          </div>
          <div style="float: right">
            <div class="title_btn_box">
              <el-button-group>
                <el-button size="large" type="success" @click="onClassClick">
                  {{ hasClass ? '商品分类：' + wupin.classOf.name : '商品暂无分类' }}
                </el-button>
                <el-button size="large" type="primary" @click="onSameClick"> 搜同类 </el-button>
                <el-button
                  v-if="mode === nowrecordmode || mode === recordmode"
                  size="large"
                  type="warning"
                  @click="onGoRecord"
                >
                  回到订单页面
                </el-button>
              </el-button-group>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="box">
      <div class="left_box">
        <el-scrollbar>
          <div style="padding-right: 5px">
            <div class="img_outside_box">
              <div class="img_box">
                <el-image :src="wupin.pic" fit="contain" :initial-index="0" :preview-src-list="[wupin.pic]"></el-image>
              </div>
            </div>
            <div v-if="wupin.ren" class="wupin_info_box">
              <el-text class="wupin_info_text">
                <el-icon><Microphone /></el-icon>
                商品客服称呼
                {{ wupin.ren }}
              </el-text>
            </div>
            <div v-if="wupin.phone" class="wupin_info_box">
              <el-text class="wupin_info_text">
                <el-icon><Iphone /></el-icon>
                商品客服电话
                {{ wupin.phone }}
              </el-text>
            </div>
            <div v-if="wupin.email" class="wupin_info_box">
              <el-text class="wupin_info_text">
                <el-icon><Message /></el-icon>
                商品客服邮箱
                {{ wupin.email }}
              </el-text>
            </div>
            <div v-if="wupin.wechat" class="wupin_info_box">
              <el-text class="wupin_info_text">
                <el-icon><Service /></el-icon>
                商品客服微信
                {{ wupin.wechat }}
              </el-text>
            </div>
            <div v-if="wupin.wechat" class="wupin_info_box">
              <el-text class="wupin_info_text">
                <el-icon><Location /></el-icon>
                商品客服地址
                {{ wupin.location }}
              </el-text>
            </div>

            <el-divider border-style="solid" content-position="left" class="divider_height"> 购物数据 </el-divider>

            <div class="wupin_buy_total_box" style="margin-top: 0">
              <el-text class="wupin_buy_total_text">
                <el-icon><UserFilled /></el-icon>
                购买人数：
                {{ totalBuy > 999 ? '999+' : totalBuy }}
              </el-text>
            </div>

            <div class="wupin_buy_total_box">
              <el-text class="wupin_buy_total_text">
                <el-icon><Goblet /></el-icon>
                购买好评率：
                <el-badge :value="goodBuyMsg"> {{ goodBuyPre.toFixed(2) }}% </el-badge>
              </el-text>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div class="right_box">
        <el-scrollbar>
          <div style="padding-right: 5px">
            <div class="info_box">
              <Showhtml :content="wupin.info"></Showhtml>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <template #footer>
      <div ref="footerCustomer">
        <div class="footer_box">
          <div class="price_box">
            <div v-if="facePrice == 0">
              <el-text class="wupin_hot_price">
                <el-icon><BellFilled /></el-icon>
                现在：免费抢购
                <el-text v-if="realPrice > 0" class="wupin_hot_real_price wupin_hot_real_price_line-through">
                  原价：￥{{ (realPrice / 100).toFixed(2) }}
                </el-text>
              </el-text>
            </div>
            <div v-else-if="facePrice < realPrice">
              <el-text class="wupin_hot_price">
                <el-icon><GobletSquareFull /></el-icon>
                促销：￥{{ (facePrice / 100).toFixed(2) }} / 件
                <el-text v-if="realPrice > 0" class="wupin_hot_real_price wupin_hot_real_price_line-through">
                  原价：￥{{ (realPrice / 100).toFixed(2) }} / 件
                </el-text>
                <el-text v-if="realPrice > 0" class="wupin_hot_real_price">
                  惊喜：{{ ((facePrice / realPrice) * 10).toFixed(1) }} 折扣
                </el-text>
              </el-text>
            </div>
            <div v-else-if="facePrice > realPrice">
              <!--              不应该出现此情况-->
              <el-text class="wupin_sb_price">
                <el-icon><Pouring /></el-icon>
                冤种价：￥{{ (facePrice / 100).toFixed(2) }} / 件
                <el-text v-if="realPrice > 0" class="wupin_sb_real_price wupin_sb_real_price_line_through">
                  原价：￥{{ (realPrice / 100).toFixed(2) }} / 件
                </el-text>
              </el-text>
            </div>
            <div v-else-if="facePrice == realPrice">
              <el-text class="wupin_real_price">
                <el-icon><Shop /></el-icon>
                售价：￥{{ (facePrice / 100).toFixed(2) }} / 件
              </el-text>
            </div>
            <div v-else-if="realPrice == 0">
              <!--              不应该出现此情况-->
              <el-text class="wupin_sb_price">
                <el-icon><Pouring /></el-icon>
                冤种价：￥{{ (facePrice / 100).toFixed(2) }} / 件
                <el-text v-if="realPrice > 0" class="wupin_sb_real_price wupin_sb_real_price_line_through">
                  原价：免费送
                </el-text>
              </el-text>
            </div>
            <div v-else>
              <!--              不应该出现此情况-->
              <el-text class="wupin_real_price">
                <el-icon><Shop /></el-icon>
                售价：￥{{ (facePrice / 100).toFixed(2) }} / 件
                <el-text v-if="realPrice > 0" class="wupin_else_real_price wupin_else_real_price_line_through">
                  原价：￥{{ (realPrice / 100).toFixed(2) }} / 件
                </el-text>
              </el-text>
            </div>
          </div>

          <div v-if="mode !== recordmode" class="buy_box">
            <div style="display: flex; justify-content: right">
              <el-input-number v-model="num" :precision="0" :min="0" :max="99" size="large" class="buy_item">
                <template #suffix>
                  <span> 件 </span>
                </template>
              </el-input-number>
              <el-button-group>
                <el-button class="buy_item" type="primary" size="large" @click="onClickBag">
                  <el-icon style="margin-right: 3px"><Handbag /></el-icon> 加入购物车
                </el-button>
                <el-button class="buy_item" type="success" size="large" @click="buy">
                  <el-icon style="margin-right: 3px"><Money /></el-icon>
                  立即购买
                  <span v-if="num >= 1">
                    （ 总价：{{ totalPrice > 0 ? '￥' + (totalPrice / 100).toFixed(2) : '免费' }} ）
                  </span>
                </el-button>
              </el-button-group>
            </div>
          </div>
        </div>
      </div>
    </template>
  </el-card>
  <div v-else></div>
  <Buynew ref="byn"></Buynew>
</template>

<style scoped lang="scss">
  .base_card {
    --base-card-height: #{var(--custom-height)};
    --base-card-width: #{var(--custom-little-width)};
    height: #{var(--base-card-height)};
    max-height: #{var(--base-card-height)};
    width: #{var(--base-card-width)};
  }

  .box {
    display: flow-root;
    --base-card-body-height: calc(
      #{var(--base-card-height)} - v-bind(headerHeight) - v-bind(footerHeight) - 40px
    ); // el_card对body内置的padding
    height: calc(#{var(--base-card-body-height)} - 6px);
    max-height: calc(#{var(--base-card-body-height)} - 6px);
    margin-top: 3px;
    margin-bottom: 3px;
  }

  .left_box {
    float: left;
    width: calc(25% - 5px);
    height: calc(#{var(--base-card-body-height)} - 6px);
    max-height: calc(#{var(--base-card-body-height)} - 6px);
    margin-right: 2.5px;
  }

  .right_box {
    float: right;
    width: calc(75% - 5px);
    height: calc(#{var(--base-card-body-height)} - 6px);
    max-height: calc(#{var(--base-card-body-height)} - 6px);
    margin-right: 2.5px;
  }

  .wupin_name {
    display: inline-block;
    font-size: 2rem;
    font-weight: bold;
    margin-right: 5px;
    vertical-align: bottom;
  }

  .wupin_tag {
    margin-top: 10px;
    margin-left: 5px;
  }

  .wupin_hot_price {
    color: red;
    font-size: 1.5rem;
  }

  .wupin_hot_real_price {
    margin-left: 5px;
    color: black;
    font-size: 1.3rem;
  }

  .wupin_hot_real_price_line-through {
    text-decoration: line-through;
  }

  .wupin_sb_price {
    color: blue;
    font-size: 1.3rem;
  }

  .wupin_sb_real_price {
    margin-left: 5px;
    color: black;
    font-size: 1.3rem;
  }

  .wupin_sb_real_price_line_through {
    text-decoration: line-through;
  }

  .wupin_real_price {
    color: black;
    font-size: 1.3rem;
  }

  .wupin_else_real_price {
    margin-left: 5px;
    color: black;
    font-size: 0.7vw;
  }

  .wupin_else_real_price_line_through {
    text-decoration: line-through;
  }

  .buy_item {
    margin-left: 3px;
    margin-right: 3px;
  }

  .info_box {
    margin-top: 10px;
  }

  .wupin_info_text {
    font-size: 0.6vw;
  }

  .wupin_info_box,
  .wupin_buy_total_box {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .wupin_buy_total_text {
    font-size: 0.6vw;
  }

  .footer_box {
    display: flow-root;
  }

  .price_box {
    float: left;
  }

  .buy_box {
    float: right;
  }

  .class_box {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */

    border: 1px solid #333333;
    padding: 5px;
    border-radius: 10px;

    margin-right: 5px;
    margin-left: 5px;
  }

  .class_box_click {
    cursor: pointer;
    background-color: white;
  }

  .class_box_click:hover {
    background-color: rgb(220, 220, 220);
  }

  .class_text {
    font-size: 1.15rem;
    vertical-align: middle;
  }

  .title_btn_box {
    display: flex;
    justify-content: left;

    margin-right: 5px;
    margin-left: 5px;
  }

  .img_outside_box {
    display: flex;
    justify-content: left;

    width: 100%;
    height: auto;
  }

  .img_box {
    height: auto;
    width: 60%;
  }

  .img_box > .el-image {
    height: auto;
    width: 100%;
  }

  .divider_height {
    margin-top: 30px;
    margin-bottom: 30px;
  }
</style>
