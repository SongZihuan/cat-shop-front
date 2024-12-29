<script setup lang="ts">
import {apiPostAddToShoppingBag, ShopRecord} from "#/center/shoppingbag"
import {formatDate} from "@/utils/time"
import {getFacePrice, getRealPrice, getTotalPrice} from "@/utils/price"
import {ElNotification} from "element-plus"
import { ElMessage } from "element-plus"

const props = defineProps({
  "record": {
    type: Object as PropType<ShopRecord>,
    required: true,
  }
})

const router = useRouter()

const emits = defineEmits(["reload"])

const record = computed(() => props.record)

const realPrice = computed(() => {
  return getRealPrice(record.value.wupin?.realPrice)
})

const facePrice = computed(() => {
  return getFacePrice(record.value.wupin?.hotPrice, record.value.wupin?.realPrice)
})
const totalPrice = computed(() => {
  return getTotalPrice(record.value.wupin?.hotPrice, record.value.wupin?.realPrice, num.value)
})

const onWupinClick = () => {
  record.value && !record.value.down && router.push({
    path: "/shop/wupin",
    query: {
      id: record.value.wupin.id,
    }
  })
}

const onClickBag = () => {
  record.value && apiPostAddToShoppingBag(record.value.wupin.id, num.value).then((res) => {
    if (res.data.data.success) {
      if (num.value <= 0) {
        ElNotification({
          title: '已经移出购物车',
          message: `尊敬的用户您好，我们已经将 ${record.value.wupin.name} 从您的购物车移出。请您进行接下来的操作。`,
          duration: 5000,
          type: "success",
          position: 'top-left',
        })
      } else {
        ElNotification({
          title: '已经加入购物车',
          message: `尊敬的用户您好，我们已经将 ${num.value}件 ${record.value.wupin.name} 添加到您的购物车。请您进行接下来的操作。若现在购买，预测价格为￥${totalPrice.value}。`,
          duration: 5000,
          type: "success",
          position: 'top-left',
        })
      }
      emits("reload")
    } else {
      ElMessage({
        type: 'error',
        message: "加入购物车失败",
      })
    }
  })
}

const onSameClick = () => {
  record.value && router.push({
    path: "/shop/search",
    query: {
      "info": JSON.stringify({
        select: [record.value.wupin.classid],
        search: record.value.wupin.name,
      })
    }
  })
}

const num = ref(record.value && record.value.num || 0)
if (num.value < 0) {
  num.value = 0
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

  byn.value.openWithShop(record.value)
}

const wupinNameClass = computed(() => {
  if (record.value.down) {
    return ["wupin_name"]
  }

  return ["wupinname", "wupin_name_click"]
})

</script>

<template>
  <div  style="border: 2px solid rgba(0, 0, 0, 0.1); border-radius: 25px; box-shadow: 10px 5px 5px rgba(0, 0, 0, 0.1); margin-bottom: 10px">
    <el-card v-if="record" class="record_box">
      <template #header>
        <div class="header">
          <div style="display: flow-root">
            <div style="display: flow-root">
              <div style="float: left">
                <el-badge :value="record.wupin.tag" style="margin-top: 10px">
                  <el-text :class="wupinNameClass" @click="onWupinClick"> {{ record.wupin.name }} </el-text>
                </el-badge>
              </div>
              <div style="float: right">
                <el-button-group>
                  <el-button v-if="record.wupin.classid !== 1 && record.wupin.classOf && record.wupin.classOf.id !== 1" size="large" class="class_btn" disabled>
                    商品分类： {{ record.wupin.classOf.name }}
                  </el-button>
                  <el-button v-else size="large" class="class_btn" disabled>
                    商品暂无分类
                  </el-button>
                  <el-button type="primary" @click="onSameClick">
                    搜同类
                  </el-button>
                </el-button-group>
              </div>
            </div>
          </div>
        </div>
      </template>
        <div style="display: flex; justify-content: left">
          <div class="record_box_pic" style="height: 20vh">
            <el-image
                :src="record.wupin.pic"
            />
          </div>
          <div style="margin-left: 10px; height: 20vh">
            <el-scrollbar height="20vh">
              <div style="display: flow-root">
                <div class="price_box" style="float: left">
                  <div v-if="record.down">
                    <el-text class="wupin_down_price">
                      商品已下架
                      <br>
                      <el-text v-if="facePrice > 0" class="wupin_down_price wupin_down_price_line_through">
                        售价：￥{{ (facePrice / 100).toFixed(2) }}
                      </el-text>
                      <br>
                      <el-text v-if="realPrice > 0 && facePrice != realPrice" class="wupin_down_price wupin_down_price_line_through">
                        原价：￥{{ (realPrice / 100).toFixed(2) }}
                      </el-text>
                    </el-text>
                  </div>
                  <div v-if="facePrice == 0">
                    <el-text class="wupin_hot_price">
                      现在：免费抢购
                      <br>
                      <el-text v-if="realPrice > 0" class="wupin_hot_real_price wupin_hot_real_price_line_through">
                        原价：￥{{ (realPrice / 100).toFixed(2) }}
                      </el-text>
                    </el-text>
                  </div>
                  <div v-else-if="facePrice < realPrice">
                    <el-text class="wupin_hot_price">
                      促销：￥{{ (facePrice / 100).toFixed(2) }} / 件
                      <br>
                      <el-text v-if="realPrice > 0" class="wupin_hot_real_price wupin_hot_real_price_line_through">
                        原价：￥{{ (realPrice / 100).toFixed(2) }} / 件
                      </el-text>
                      <br>
                      <el-text v-if="realPrice > 0" class="wupin_hot_real_price">
                        惊喜：{{ ((facePrice / realPrice) * 10).toFixed(1) }} 折扣
                      </el-text>
                      <br>
                      <el-text class="record_info">
                        放入购物车时间：{{ formatDate(record.time) }}
                      </el-text>
                    </el-text>
                  </div>
                  <div v-else-if="facePrice > realPrice">
                    <!--              不应该出现此情况-->
                    <el-text class="wupin_sb_price">
                      冤种价：￥{{ (facePrice / 100).toFixed(2) }} / 件
                      <br>
                      <el-text v-if="realPrice > 0" class="wupin_sb_real_price wupin_sb_real_price_line_through">
                        原价：￥{{ (realPrice / 100).toFixed(2) }} / 件
                      </el-text>
                      <br>
                      <el-text class="record_info">
                        放入购物车时间：{{ formatDate(record.time) }}
                      </el-text>
                    </el-text>
                  </div>
                  <div v-else-if="facePrice == realPrice">
                    <el-text class="wupin_real_price">
                      售价：￥{{ (facePrice / 100).toFixed(2) }} / 件
                    </el-text>
                    <br>
                    <el-text class="record_info">
                      放入购物车时间：{{ formatDate(record.time) }}
                    </el-text>
                  </div>
                  <div v-else-if="realPrice == 0">
                    <!--              不应该出现此情况-->
                    <el-text class="wupin_sb_price">
                      冤种价：￥{{ (facePrice / 100).toFixed(2) }} / 件
                      <br>
                      <el-text v-if="realPrice > 0" class="wupin_sb_real_price wupin_sb_real_price_line_through">
                        原价：免费送
                      </el-text>
                      <br>
                      <el-text class="record_info">
                        放入购物车时间：{{ formatDate(record.time) }}
                      </el-text>
                    </el-text>
                  </div>
                  <div v-else>
                    <!--              不应该出现此情况-->
                    <el-text class="wupin_real_price">
                      售价：￥{{ (facePrice / 100).toFixed(2) }} / 件
                      <br>
                      <el-text v-if="realPrice > 0" class="wupin_else_real_price wupin_else_real_price_line_through">
                        原价：￥{{ (realPrice / 100).toFixed(2) }} / 件
                      </el-text>
                      <br>
                      <el-text class="record_info">
                        放入购物车时间：{{ formatDate(record.time) }}
                      </el-text>
                    </el-text>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
      <template #footer>
        <div style="display: flex; justify-content: right;">
          <el-input-number v-model="num" :disabled="record.down" :min="0" :max="99" size="large" class="buy_item">
            <template #suffix>
              <span> 件 </span>
            </template>
          </el-input-number>
          <el-button-group>
            <el-button :disabled="record.down" class="buy_item" size="large" @click="onClickBag">
              <el-icon style="margin-right: 3px"><Handbag /></el-icon> 加入加入购物车
            </el-button>
            <el-button v-if="record.down" disabled class="buy_item" size="large">
              <el-icon style="margin-right: 3px"><Money /></el-icon>
              商品已下架
            </el-button>
            <el-button v-else class="buy_item" size="large" :disabled="num <= 0" @click="buy">
              <el-icon style="margin-right: 3px"><Money /></el-icon>
              立即购买 <el-text v-if="num >= 1"> （ 总价：{{ totalPrice > 0 ? "￥" + (totalPrice / 100).toFixed(2) : "免费" }} ） </el-text>
            </el-button>
          </el-button-group>
        </div>
      </template>
    </el-card>
  </div>
  <Buynew ref="byn"></Buynew>
</template>

<style scoped lang="scss">
.buy_item {
  margin-left: 3px;
  margin-right: 3px;
}

.record_box {
  display: inline;
}

.inbox {
  margin: 10px;
}

.record_box_pic {
  display: flex;
  justify-content: center;
  align-content: center;
  margin-top: 10px;
}

.wupin_name {
  display: inline-block;
  font-size: 1.2vw;
  font-weight: bold;
  margin-right: 5px;
  vertical-align: bottom;
  cursor: pointer;
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

.price_box {
  margin-top: 10px;
  margin-bottom: 5px;
}

.wupin_down_price {
  color: #595959;
  font-size: 1vw;
}

.wupin_down_price_line_through {
  text-decoration: line-through;
}

.wupin_hot_price {
  color: red;
  font-size: 1vw;
}

.wupin_hot_real_price {
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
  color: black;
  font-size: 0.7vw;
}

.wupin_else_real_price_line_through {
  text-decoration: line-through;
}

.title {
  display: inline-block;
  vertical-align: bottom;
}

.record_info {
  color: black;
  font-size: 0.7vw;
}
</style>