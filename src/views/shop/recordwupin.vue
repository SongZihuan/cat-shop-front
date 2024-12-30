<script setup lang="ts">
  import {Wupin} from "@/store/hotwupin"
  import {Location} from "@element-plus/icons-vue"
  import {getFacePrice, getRealPrice, getTotalPrice} from "@/utils/price"
  import {apiGetBuyRecordInfo, BuyRecord} from "#/center/buyrecord"
  const route = useRoute()
  const router = useRouter()

  const recordId = ref(route.query.id as number | null | undefined)
  if (!recordId.value || recordId.value <= 0) {
    router.push({
      path: "/system/error",
      query: {
        msg: "商品不存在",
      }
    })
  }

  const record = ref(null as BuyRecord | null)
  const wupin = ref(null as Wupin | null)

  apiGetBuyRecordInfo(recordId.value as number).then((res) => {
    record.value = res.data.data as BuyRecord
    wupin.value = record.value.nowwupin as Wupin
  }).catch(() => {
    router.push({
      path: "/system/error",
      query: {
        msg: "商品不存在",
      }
    })
  })

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

  const totalDaoHuo = computed(() => (wupin.value && wupin.value.buydaohuo >= 0) ? wupin.value.buydaohuo : 0)
  const totalAllUserPrice = computed(() => (wupin.value && wupin.value.buyprice >= 0) ? wupin.value.buyprice : 0)
  const totalBuy = computed(() => (wupin.value && wupin.value.buytotal >= 0) ? wupin.value.buytotal : 0)
  const totalPingJia = computed(() => (wupin.value && wupin.value.buypingjia >= 0) ? wupin.value.buypingjia : 0)
  const totalBuyGood = computed(() => (wupin.value && wupin.value.buygood >= 0) ? wupin.value.buygood : 0)

  const daohuoPre = computed(() => (totalDaoHuo.value / totalBuy.value) * 100)
  const pingjiaPre = computed(() => (totalPingJia.value / totalDaoHuo.value) * 100)
  const goodBuyPre = computed(() => (totalBuyGood.value / totalPingJia.value) * 100)
  const goodBuyMsg = computed(() => {
    if (goodBuyPre.value >= 85) {
      return "好评如潮"
    } else if (goodBuyPre.value >= 50) {
      return "部分好评"
    } else if (goodBuyPre.value >= 30) {
      return "好评甚少"
    }

    return "谨慎购买"
  })

  const backToRecord = () => {
    record.value && router.push({
      path: "/center/buyrecord",
      query: {
        id: record.value.id,
      }
    })
  }

  const onSameClick = () => {
    record.value && router.push({
      path: "/shop/search",
      query: {
        "info": JSON.stringify({
          select: record.value.wupin.classid || 0,
          search: record.value.wupin.name || "",
        })
      }
    })
  }

</script>

<template>
  <div v-if="wupin" style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <el-card style="display: flex; max-width: 75%; justify-content: center; margin-top: 10px">
      <div style="display: inline-block; width: 15vw; height: 70vh; margin-right: 20px; margin-left: 20px">
        <el-scrollbar height="70vh">
          <div style="padding-right: 5px">
            <el-image :src="wupin.pic" fit="contain" style="height: auto; width: 85%" :initial-index="0" :preview-src-list="[wupin.pic]"></el-image>
            <div v-if="wupin.ren" class="wupin_info_box">
              <el-text class="wupin_info_text">
                <el-icon><Microphone /></el-icon>
                客服专属称号
                {{ wupin.ren }}
              </el-text>
            </div>
            <div v-if="wupin.phone" class="wupin_info_box">
              <el-text class="wupin_info_text">
                <el-icon><Iphone /></el-icon>
                客服专属电话
                {{ wupin.phone }}
              </el-text>
            </div>
            <div v-if="wupin.email" class="wupin_info_box">
              <el-text class="wupin_info_text">
                <el-icon><Message /></el-icon>
                客服专属邮箱
                {{ wupin.email }}
              </el-text>
            </div>
            <div v-if="wupin.wechat" class="wupin_info_box">
              <el-text class="wupin_info_text">
                <el-icon><Service /></el-icon>
                客服专属微信
                {{ wupin.wechat }}
              </el-text>
            </div>
            <div v-if="wupin.wechat" class="wupin_info_box">
              <el-text class="wupin_info_text">
                <el-icon><Location /></el-icon>
                客服专属地址
                {{ wupin.location }}
              </el-text>
            </div>

            <el-divider border-style="solid" content-position="left" style="margin-top: 50px;">
              购物数据
            </el-divider>

            <div class="wupin_buy_total_box" style="margin-top: 0">
              <el-text class="wupin_buy_total_text">
                <el-icon><UserFilled /></el-icon>
                购买人数：
                {{ totalBuy }}
              </el-text>
            </div>

            <div class="wupin_buy_total_box">
              <el-text class="wupin_buy_total_text">
                <el-icon><IceCream /></el-icon>
                购买好评人数：
                {{ totalBuyGood }}
              </el-text>
            </div>

            <div class="wupin_buy_total_box">
              <el-text class="wupin_buy_total_text">
                <el-icon><Money /></el-icon>
                总消费金额：
                ￥{{ (totalAllUserPrice / 100).toFixed(2) }}
              </el-text>
            </div>

            <div class="wupin_buy_total_box">
              <el-text class="wupin_buy_total_text">
                <el-icon><Goblet /></el-icon>
                购买到货率：
                {{ daohuoPre.toFixed(2) }}%
              </el-text>
            </div>

            <div class="wupin_buy_total_box">
              <el-text class="wupin_buy_total_text">
                <el-icon><Goblet /></el-icon>
                购买评价率：
                {{ pingjiaPre.toFixed(2) }}%
              </el-text>
            </div>

            <div class="wupin_buy_total_box">
              <el-text class="wupin_buy_total_text">
                <el-icon><Goblet /></el-icon>
                购买好评率：
                <el-badge :value="goodBuyMsg">
                  {{ goodBuyPre.toFixed(2) }}%
                </el-badge>
              </el-text>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div style="display: inline-block; width: 50vw; height: 70vh; margin-right: 20px; margin-left: 20px">
        <el-scrollbar height="70vh">
          <div style="padding-right: 5px">
            <div style="display: flow-root">
              <div style="float: left">
                <el-badge :value="wupin.tag" style="margin-top: 10px">
                  <el-text class="wupin_name"> {{ wupin.name }} </el-text>
                </el-badge>
              </div>
              <div style="float: right">
                <div class="class_box">
                  <el-text v-if="wupin.classid !== 1 && wupin.classOf && wupin.classOf.id !== 1" class="class_text">
                    商品分类：{{ wupin.classOf.name }}
                  </el-text>
                  <el-text v-else class="class_text">
                    商品暂无分类
                  </el-text>
                </div>
                <div class="class_box class_box_click" @click="onSameClick">
                  <el-text class="class_text">
                    搜同类
                  </el-text>
                </div>
              </div>
            </div>
            <div class="price_box">
              <div v-if="facePrice == 0">
                <el-text class="wupin_hot_price">
                  <el-icon><BellFilled /></el-icon>
                  现在：免费抢购
                  <el-text v-if="realPrice > 0" class="wupin_hot_real_price wupin_hot_real_price_line_through">
                    原价：￥{{ (realPrice / 100).toFixed(2) }}
                  </el-text>
                </el-text>
              </div>
              <div v-else-if="facePrice < realPrice">
                <el-text class="wupin_hot_price">
                  <el-icon><GobletSquareFull /></el-icon>
                  促销：￥{{ (facePrice / 100).toFixed(2) }} / 件
                  <el-text v-if="realPrice > 0" class="wupin_hot_real_price wupin_hot_real_price_line_through">
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

            <div style="display: flex; flex-direction: column; justify-content: space-between;">
              <div style="display: flex">
                <el-input-number v-model="num" :min="0" :max="99" size="large" class="buy_item">
                  <template #suffix>
                    <span> 件 </span>
                  </template>
                </el-input-number>
                <el-button-group>
                  <el-button class="buy_item" size="large">
                    <el-icon style="margin-right: 3px"><Handbag /></el-icon> 加入购物车
                  </el-button>
                  <el-button class="buy_item" size="large">
                    <el-icon style="margin-right: 3px"><Money /></el-icon>
                    立即购买
                    <span v-if="num >= 1"> （ 总价：{{ totalPrice > 0 ? "￥" + (totalPrice / 100).toFixed(2) : "免费" }} ） </span>
                  </el-button>
                  <el-button v-if="record && record.id" @click="backToRecord" class="buy_item" size="large">
                    返回订单
                  </el-button>
                </el-button-group>
              </div>
            </div>
            <div id="info_box" class="info_box">
              <div v-html="wupin.info"></div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </el-card>
  </div>
  <div v-else></div>
  <Buynew ref="byn"></Buynew>
</template>

<style scoped lang="scss">
  .wupin_name {
    display: inline-block;
    font-size: 1.8vw;
    font-weight: bold;
    margin-right: 5px;
    vertical-align: bottom;
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

  .price_box {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .wupin_hot_price {
    color: red;
    font-size: 1vw;
  }

  .wupin_hot_real_price {
    margin-left: 5px;
    color: black;
    font-size: 0.7vw;
  }

  .wupin_hot_real_price_line_through {
    text-decoration: line-through;
  }

  .wupin_sb_price {
    color: blue;
    font-size: 1vw;
  }

  .wupin_sb_real_price {
    margin-left: 5px;
    color: black;
    font-size: 0.7vw;
  }

  .wupin_sb_real_price_line_through {
    text-decoration: line-through;
  }

  .wupin_real_price {
    color: black;
    font-size: 1vw;
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
  .wupin_buy_total_text {
    font-size: 0.6vw;
  }

  #info_box * {
    all: initial;
    width: 100%;
  }

  .wupin_info_box, .wupin_buy_total_box {
    margin-top: 1px;
    margin-bottom: 3px;
  }

  .class_box {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */

    border: 1px solid #333333;;
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
</style>