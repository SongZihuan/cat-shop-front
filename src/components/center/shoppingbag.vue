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

const onClassClick = () => {
  record.value && record.value.wupin.classid > 1 && router.push({
    path: "/shop/search",
    query: {
      "info": JSON.stringify({
        select: [record.value.wupin.classid],
        search: "",
      })
    }
  })
}

const onWupinClick = () => {
  if (!record.value) {
    // NOT-THING-TO-DO
  } else if (record.down) {
    ElMessageBox.alert('商品暂时下架啦，搜同款看看吧！', '下架通知', {
      confirmButtonText: 'OK',
    })
  } else {
    record.value && router.push({
      path: "/shop/wupin",
      query: {
        id: record.value.wupin.id,
      }
    })
  }
}

const onClickBag = () => {
  record.value && !record.value.down && apiPostAddToShoppingBag(record.value.wupin.id, num.value).then((res) => {
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
if (record.value.down) {
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

  if (!record.value || record.value.down) {
    return;
  }

  if (num.value <= 0) {
    return
  }

  byn.value.openWithShop(record.value)
}

</script>

<template>
  <div  style="border: 2px solid rgba(0, 0, 0, 0.1); border-radius: 25px; box-shadow: 10px 5px 5px rgba(0, 0, 0, 0.1); margin-bottom: 10px">
    <div v-if="record" class="record_box">
      <div class="inbox">
        <div class="header">
          <div style="display: flow-root">
            <div style="display:block; float: left">
              <el-badge  class="title" :value="record.wupin.tag" style="margin-top: 10px">
                <el-text class="wupin_name" @click="onWupinClick"> {{ record.wupin.name }} </el-text>
              </el-badge>
              <el-text v-if="record.wupin.classid > 1 && record.wupin.classOf" class="title wupin_class_name">
                商品来源：
                <el-text class="title wupin_class_name_btn" @click="onClassClick"> {{ record.wupin.classOf.name }} > </el-text>
              </el-text>
            </div>
            <div style="float: right">
              <el-button type="primary" @click="onSameClick">
                搜同类
              </el-button>
            </div>
          </div>
        </div>
        <el-divider></el-divider>
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
                    <el-text class="wupin_hot_price">
                      商品下架，暂时无法出售
                    </el-text>
                  </div>
                  <div v-else-if="facePrice == 0">
                    <el-text class="wupin_hot_price">
                      现在：免费抢购
                      <br>
                      <el-text v-if="realPrice > 0" class="wupin_hot_real_price">
                        原价：￥{{ (realPrice / 100).toFixed(2) }}
                      </el-text>
                    </el-text>
                  </div>
                  <div v-else-if="facePrice < realPrice">
                    <el-text class="wupin_hot_price">
                      促销：￥{{ (facePrice / 100).toFixed(2) }} / 件
                      <br>
                      <el-text v-if="realPrice > 0" class="wupin_hot_real_price">
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
                      <el-text v-if="realPrice > 0" class="wupin_sb_real_price">
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
                      <el-text v-if="realPrice > 0" class="wupin_sb_real_price">
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
                      <el-text v-if="realPrice > 0" class="wupin_else_real_price">
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
          <el-divider direction="vertical" style="height: 20vh; border-width: 1px; margin-left: 15px; margin-right: 15px"></el-divider>
          <div style="display: flex; flex-direction: column; justify-content: space-between; height: 20vh">
            <div style="display: flex">
              <el-input-number v-model="num" :disabled="record.value" :min="0" :max="99" size="large" class="buy_item">
                <template #suffix>
                  <span> 件 </span>
                </template>
              </el-input-number>
              <el-button :disabled="record.value" class="buy_item" size="large" @click="onClickBag">
                <el-icon style="margin-right: 3px"><Handbag /></el-icon> 重新加入加入购物车
              </el-button>
            </div>
            <div style="display: flex">
              <el-button v-if="record.value" disabled class="buy_item" size="large">
                <el-icon style="margin-right: 3px"><Money /></el-icon>
                立即购买
              </el-button>
              <el-button v-else class="buy_item" size="large" :disabled="num <= 0" @click="buy">
                <el-icon style="margin-right: 3px"><Money /></el-icon>
                立即购买
                <el-text v-if="num >= 1"> （ 实际价格：{{ totalPrice > 0 ? "￥" + (totalPrice / 100).toFixed(2) : "免费" }} ） </el-text>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
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

.price_box {
  margin-top: 10px;
  margin-bottom: 5px;
}

.wupin_hot_price {
  color: red;
  font-size: 1vw;
}

.wupin_hot_real_price {
  color: black;
  font-size: 0.7vw;
  text-decoration: line-through;
}

.wupin_sb_price {
  color: blue;
  font-size: 1vw;
}

.wupin_sb_real_price {
  color: black;
  font-size: 0.7vw;
  text-decoration: line-through;
}

.wupin_real_price {
  color: black;
  font-size: 1vw;
}

.wupin_else_real_price {
  color: black;
  font-size: 0.7vw;
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