<script setup lang="ts">
  import {Wupin} from "@/store/hotwupin"
  import { ElNotification } from 'element-plus'
  import {Location} from "@element-plus/icons-vue"
  import {getFacePrice, getRealPrice, getTotalPrice} from "@/utils/price"
  import {apiPostAddToShoppingBag} from "#/center/shoppingbag"
  import {apiGetWupin} from "#/center/wupin"
  import { ElMessage } from 'element-plus'
  const route = useRoute()
  const router = useRouter()

  const wupinId = ref(route.query.id as number | null | undefined)
  if (!wupinId.value || wupinId.value <= 0) {
    router.push({
      path: "/system/error",
      query: {
        msg: "商品不存在",
      }
    })
  }

  const wupin = ref(null as Wupin | null)
  apiGetWupin(wupinId.value as number).then((res) => {
    wupin.value = res.data.data
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

  const totalBuy = computed(() => (wupin.value && wupin.value.buytotal >= 0) ? wupin.value.buytotal : 0)
  const totalDaoHuo = computed(() => (wupin.value && wupin.value.buydaohuo >= 0) ? wupin.value.buydaohuo : 0)
  const totalBuyGood = computed(() => {
    const g = (wupin.value && wupin.value.buygood >= 0) ? wupin.value.buygood : 0
    if (g > totalDaoHuo.value) {
      return totalDaoHuo.value
    }
    return g
  })

  const goodBuyPre = computed(() => (totalBuyGood.value / totalDaoHuo.value) * 100)
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

  const onClickBag = () => {
    wupin.value && apiPostAddToShoppingBag(wupin.value.id, num.value).then((res) => {
      if (res.data.data.success) {
        wupin.value && ElNotification({
          title: '已经加入购物车',
          message: `尊敬的用户您好，我们已经将 ${num.value}件 ${wupin.value.name} 添加到您的购物车。请您进行接下来的操作。若现在购买，预测价格为￥${totalPrice.value}。`,
          duration: 5000,
          type: "success",
          position: 'top-left',
        })
      } else {
        ElMessage({
          type: 'error',
          message: "加入购物车失败",
        })
      }
    })
  }

  const byn = ref(null as any)
  const buy = () => {
    if (!byn.value) {
      ElMessage({
        type: 'warning',
        message: "系统出现了问题，请重试。"
      })
      return
    }

    if (num.value <= 0) {
      return
    }

    byn.value.open(wupin.value, num.value)
  }
</script>

<template>
  <div v-if="wupin" style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <el-card style="display: flex; max-width: 75%; justify-content: center; margin-top: 10px">
      <div style="display: inline-block; width: 15vw; height: 70vh; margin-right: 20px; margin-left: 20px">
        <el-scrollbar height="70vh">
          <div style="padding-right: 5px">
            <el-image :src="wupin.pic" fit="contain" style="height: auto; width: 100%" :initial-index="0" :preview-src-list="[wupin.pic]"></el-image>
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
            <el-badge :value="wupin.tag" style="margin-top: 10px">
              <el-text class="wupin_name"> {{ wupin.name }} </el-text>
            </el-badge>
            <el-text v-if="wupin.classid > 1 && wupin.classOf" class="wupin_class_name">
              商品来源：
              <el-text class="wupin_class_name_btn"> {{ wupin.classOf.name }} > </el-text>
            </el-text>
            <div class="price_box">
              <div v-if="facePrice == 0">
                <el-text class="wupin_hot_price">
                  <el-icon><BellFilled /></el-icon>
                  现在：免费抢购
                  <el-text v-if="realPrice > 0" class="wupin_hot_real_price">
                    原价：￥{{ (realPrice / 100).toFixed(2) }}
                  </el-text>
                </el-text>
              </div>
              <div v-else-if="facePrice < realPrice">
                <el-text class="wupin_hot_price">
                  <el-icon><GobletSquareFull /></el-icon>
                  促销：￥{{ (facePrice / 100).toFixed(2) }} / 件
                  <el-text v-if="realPrice > 0" class="wupin_hot_real_price">
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
                  <el-text v-if="realPrice > 0" class="wupin_sb_real_price">
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
                  <el-text v-if="realPrice > 0" class="wupin_sb_real_price">
                    原价：免费送
                  </el-text>
                </el-text>
              </div>
              <div v-else>
                <!--              不应该出现此情况-->
                <el-text class="wupin_real_price">
                  <el-icon><Shop /></el-icon>
                  售价：￥{{ (facePrice / 100).toFixed(2) }} / 件
                  <el-text v-if="realPrice > 0" class="wupin_else_real_price">
                    原价：￥{{ (realPrice / 100).toFixed(2) }} / 件
                  </el-text>
                </el-text>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; justify-content: space-between; height: 20vh">
              <div style="display: flex">
                <el-input-number v-model="num" :min="0" :max="99" size="large" class="buy_item">
                  <template #suffix>
                    <span> 件 </span>
                  </template>
                </el-input-number>
                <el-button class="buy_item" size="large" @click="onClickBag">
                  <el-icon style="margin-right: 3px"><Handbag /></el-icon> 加入购物车
                </el-button>
              </div>
              <div style="display: flex">
                <el-button class="buy_item" size="large" @click="buy">
                  <el-icon style="margin-right: 3px"><Money /></el-icon>
                  立即购买
                  <span v-if="num >= 1"> （ 实际价格：{{ totalPrice > 0 ? "￥" + (totalPrice / 100).toFixed(2) : "免费" }} ） </span>
                </el-button>
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

  .wupin_info_box {
    margin-top: 1px;
    margin-bottom: 1px;
  }

  .wupin_buy_total_text {
    font-size: 0.6vw;
  }

  .wupin_buy_total_box {
    margin-top: 1px;
    margin-bottom: 1px;
  }
  #info_box * {
    all: initial;
    width: 100%;
  }
</style>