<script setup lang="ts">
  import { Location } from '@element-plus/icons-vue'
  import { apiGetWupin } from '#/center/wupin'
  import { getFacePrice, getRealPrice } from '@/utils/price'
  import { isAdmin } from '@/store/admin'
  import { AdminWupin } from '#/admin/wupin'
  import { AdminBuyRecord, apiAdminGetBuyRecordInfo } from '#/admin/buyrecord'
  import pushTo from '@/views/admin/router_push'
  import Showhtml from '@/components/utils/showhtml.vue'
  import useAdminUserStore, { AdminUser } from '@/store/admin/user'
  import { RouteLocationNormalized } from 'vue-router'
  const router = useRouter()
  const route = useRoute()

  if (!isAdmin()) {
    router.push({
      path: '/system/error',
      query: {
        msg: '页面错误'
      }
    })
  }

  const modesale = 'sale'
  const modelock = 'lock'
  const modeinfo = 'info'

  const wupinfromuser = 'user'
  const wupinfromwupin = 'wupin'
  const wupinfromrecord = 'record'

  const mode = computed(() => route.meta.wupinmode || modeinfo)
  const wupinfrom = computed(() => route.meta.wupinfrom || wupinfromwupin)

  const recordId = ref(Number(route.query?.recordId).valueOf() || 0)
  const wupinId = ref(Number(route.query?.wupinId).valueOf() || 0)
  const userId = ref(Number(route.query?.userId).valueOf() || 0)

  const record = ref(null as AdminBuyRecord | null)
  const wupin = ref(null as AdminWupin | null)
  const user = ref(null as AdminUser | null)

  const userAdminStore = useAdminUserStore()

  const getData = (to: RouteLocationNormalized) => {
    recordId.value = Number(to.query?.recordId).valueOf() || 0
    wupinId.value = Number(to.query?.wupinId).valueOf() || 0

    if (wupinfrom.value === wupinfromuser && (!userId.value || !user.value || user.value.id !== userId.value)) {
      router.push({
        path: '/system/error',
        query: {
          msg: '页面错误'
        }
      })
    } else if (
      (wupinfrom.value === wupinfromuser || wupinfrom.value === wupinfromrecord) &&
      (mode.value === modesale || mode.value === modelock)
    ) {
      if (!recordId.value) {
        router.push({
          path: '/system/error',
          query: {
            msg: '订单不存在'
          }
        })
      }

      apiAdminGetBuyRecordInfo(recordId.value as number, userId.value).then((res) => {
        record.value = res.data.data as AdminBuyRecord

        if (mode.value == modesale) {
          wupin.value = record.value.nowwupin as AdminWupin
        } else if (mode.value == modelock) {
          wupin.value = record.value.nowwupin as AdminWupin
        } else {
          router.push({
            path: '/system/error',
            query: {
              msg: '页面错误'
            }
          })
          return
        }

        if (wupinfrom.value === wupinfromuser && record.value.userId !== userId.value) {
          router.push({
            path: '/system/error',
            query: {
              msg: '页面错误'
            }
          })
        }
      })
    } else if (mode.value === modeinfo && wupinfrom.value === wupinfromwupin) {
      if (!wupinId.value) {
        router.push({
          path: '/system/error',
          query: {
            msg: '商品不存在'
          }
        })
      }

      apiGetWupin(wupinId.value as number).then((res) => {
        record.value = null
        wupin.value = res.data.data as AdminWupin
      })
    } else {
      router.push({
        path: '/system/error',
        query: {
          msg: '页面错误'
        }
      })
    }
  }

  const realPrice = computed(() => {
    return getRealPrice(wupin.value?.realPrice)
  })
  const facePrice = computed(() => {
    return getFacePrice(wupin.value?.hotPrice, wupin.value?.realPrice)
  })

  const totalDaoHuo = computed(() => (wupin.value && wupin.value.buydaohuo >= 0 ? wupin.value.buydaohuo : 0))
  const totalAllUserPrice = computed(() => (wupin.value && wupin.value.buyprice >= 0 ? wupin.value.buyprice : 0))
  const totalBuy = computed(() => (wupin.value && wupin.value.buytotal >= 0 ? wupin.value.buytotal : 0))
  const totalPingJia = computed(() => (wupin.value && wupin.value.buypingjia >= 0 ? wupin.value.buypingjia : 0))
  const totalBuyGood = computed(() => (wupin.value && wupin.value.buygood >= 0 ? wupin.value.buygood : 0))
  const totalJian = computed(() => (wupin.value && wupin.value.buyjian >= 0 ? wupin.value.buyjian : 0))

  const daohuoPre = computed(() => (totalDaoHuo.value / totalBuy.value) * 100)
  const pingjiaPre = computed(() => (totalPingJia.value / totalDaoHuo.value) * 100)
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

  const onGoRecord = () => {
    if (record.value && wupinfrom.value === wupinfromuser) {
      pushTo(router, route, '/admin/user/buy/info')
    } else if (record.value && wupinfrom.value === wupinfromrecord) {
      pushTo(router, route, '/admin/buy/info')
    } else if (record.value && wupinfrom.value === wupinfromwupin) {
      pushTo(router, route, '/admin/wupin/info')
    }
  }

  const onGoUserBuyPage = () => {
    wupin.value &&
      router.push({
        path: '/user/shop/wupin',
        query: {
          wupinId: wupin.value.id
        }
      })
  }

  const toBack = () => {
    if (wupinfrom.value === wupinfromuser) {
      pushTo(router, route, '/admin/user/buy/list')
    } else if (wupinfrom.value === wupinfromrecord) {
      pushTo(router, route, '/admin/buy/list')
    } else if (wupinfrom.value === wupinfromwupin) {
      pushTo(router, route, '/admin/wupin/list')
    } else {
      router.push({
        path: '/system/error',
        query: {
          msh: '页面错误'
        }
      })
    }
  }

  const onChangeUser = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
    userId.value = Number(to.query?.userId).valueOf() || 0

    user.value = null
    wupin.value = null
    record.value = null

    if (wupinId.value || recordId.value) {
      if (wupinfrom.value === wupinfromuser && userId.value) {
        userAdminStore.getUser(userId.value).then(
          (res) => {
            user.value = res as AdminUser
            getData(to)
          },
          () => {
            user.value = null
            toBack()
          }
        )
      } else {
        user.value = null
        getData(to)
      }
    } else {
      toBack()
    }
    next()
  }

  onBeforeRouteUpdate(onChangeUser)
  onChangeUser(route, route, () => {})

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
  <el-card v-if="wupin" class="base_card admin_root_main_base_card">
    <template #header>
      <div ref="headerCustomer">
        <div style="display: flow-root">
          <div style="float: left">
            <el-text class="wupin_name"> {{ wupin.name }} {{ mode === modelock ? '（存档）' : '' }}</el-text>
          </div>
          <div style="float: right">
            <div class="title_btn_box">
              <el-button-group>
                <el-button type="warning" size="large" @click="onGoUserBuyPage"> 前往用户购买页面 </el-button>
                <el-button
                  v-if="mode === modesale || mode === modelock"
                  type="primary"
                  size="large"
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

            <el-divider border-style="solid" content-position="left" class="divider_height"> 商品数据 </el-divider>

            <div class="wupin_buy_total_box" style="margin-top: 0">
              <el-text class="wupin_buy_total_text"> 是否热销：{{ wupin.hot ? '热销' : '非热销' }} </el-text>
            </div>

            <div v-if="wupin.tag" class="wupin_buy_total_box">
              <el-text class="wupin_buy_total_text"> 标签：{{ wupin.tag }} </el-text>
            </div>

            <div v-if="wupin.tag" class="wupin_buy_total_box">
              <el-text class="wupin_buy_total_text"> 商品是否在售：{{ wupin.down ? '已下架' : '在售' }} </el-text>
            </div>

            <el-divider border-style="solid" content-position="left" class="divider_height"> 商品分类数据 </el-divider>

            <div class="wupin_buy_total_box">
              <el-text class="wupin_buy_total_text">
                商品分类：{{
                  wupin.classOf &&
                  wupin.classOf.id !== 1 &&
                  wupin.classOf.id !== 0 &&
                  wupin.classId === wupin.classOf.id
                    ? wupin.classOf.name
                    : '暂无分类'
                }}
              </el-text>
            </div>

            <div
              v-if="
                wupin.classOf && wupin.classOf.id !== 1 && wupin.classOf.id !== 0 && wupin.classId === wupin.classOf.id
              "
              class="wupin_buy_total_box"
            >
              <el-text class="wupin_buy_total_text">
                商品分类是否展示：{{ wupin.classOf.show ? '展示' : '隐藏' }}
              </el-text>
            </div>

            <div
              v-if="
                wupin.classOf && wupin.classOf.id !== 1 && wupin.classOf.id !== 0 && wupin.classId === wupin.classOf.id
              "
              class="wupin_buy_total_box"
            >
              <el-text class="wupin_buy_total_text">
                商品分了是否下架：{{ wupin.classOf.down ? '下架' : '销售中' }}
              </el-text>
            </div>

            <el-divider border-style="solid" content-position="left" class="divider_height"> 售价数据 </el-divider>

            <div class="wupin_buy_total_box" style="margin-top: 0">
              <el-text class="wupin_buy_total_text">
                热销价格：
                {{ wupin.hotPrice && wupin.hotPrice >= 0 ? '￥' + (wupin.hotPrice / 100).toFixed(2) : '暂无' }}
              </el-text>
            </div>

            <div class="wupin_buy_total_box" style="margin-top: 0">
              <el-text class="wupin_buy_total_text">
                实际价格： {{ wupin.realPrice >= 0 ? '￥' + (wupin.realPrice / 100).toFixed(2) : '￥0.00' }}
              </el-text>
            </div>

            <div
              v-if="wupin.hotPrice && wupin.hotPrice > wupin.realPrice"
              class="wupin_buy_total_box"
              style="margin-top: 0"
            >
              <el-text class="wupin_buy_total_text"> 热销价格异常：热销价格比实际价格昂贵。 </el-text>
            </div>

            <div v-if="wupin.realPrice <= 0" class="wupin_buy_total_box" style="margin-top: 0">
              <el-text class="wupin_buy_total_text"> 实际价格异常：实际价格为免费。 </el-text>
            </div>

            <el-divider border-style="solid" content-position="left" class="divider_height"> 购物数据 </el-divider>

            <div class="wupin_buy_total_box" style="margin-top: 0">
              <el-text class="wupin_buy_total_text">
                购买人数：
                {{ totalBuy }}
              </el-text>
            </div>

            <div class="wupin_buy_total_box" style="margin-top: 0">
              <el-text class="wupin_buy_total_text">
                到货人数：
                {{ totalDaoHuo }}
              </el-text>
            </div>

            <div class="wupin_buy_total_box" style="margin-top: 0">
              <el-text class="wupin_buy_total_text">
                评价人数：
                {{ totalDaoHuo }}
              </el-text>
            </div>

            <div class="wupin_buy_total_box">
              <el-text class="wupin_buy_total_text">
                好评人数：
                {{ totalBuyGood }}
              </el-text>
            </div>

            <div class="wupin_buy_total_box">
              <el-text class="wupin_buy_total_text">
                购买总件数：
                {{ totalJian }}
              </el-text>
            </div>

            <div class="wupin_buy_total_box">
              <el-text class="wupin_buy_total_text">
                总消费金额： ￥{{ (totalAllUserPrice / 100).toFixed(2) }}
              </el-text>
            </div>

            <div class="wupin_buy_total_box">
              <el-text class="wupin_buy_total_text">
                购买到货率：
                {{ daohuoPre.toFixed(2) }}%
              </el-text>
            </div>

            <div class="wupin_buy_total_box">
              <el-text class="wupin_buy_total_text">
                购买评价率：
                {{ pingjiaPre.toFixed(2) }}%
              </el-text>
            </div>

            <div class="wupin_buy_total_box">
              <el-text class="wupin_buy_total_text">
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
        </div>
      </div>
    </template>
  </el-card>
  <div v-else></div>
</template>

<style scoped lang="scss">
  .box {
    display: flow-root;
    --base-card-body-height: calc(
      #{var(--card-height)} - v-bind(headerHeight) - v-bind(footerHeight) - 40px
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

  .class_btn {
    margin-top: 10px;
    margin-right: 10px;
    font-size: 1.3rem;
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
    width: 40%;
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
