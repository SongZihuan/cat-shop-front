<script setup lang="ts">
  import { apiAdminPostAddToShoppingBag, AdminShopRecord } from '#/admin/shoppingbag'
  import { formatDate } from '@/utils/time'
  import { getFacePrice, getRealPrice, getTotalPrice } from '@/utils/price'
  import { ElMessage } from 'element-plus'
  import pushTo from '@/views/admin/router_push'

  const props = defineProps({
    record: {
      type: Object as PropType<AdminShopRecord>,
      required: true
    }
  })

  const router = useRouter()
  const route = useRoute()

  const emits = defineEmits(['reload'])

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
    record.value &&
      pushTo(router, route, '/admin/wupin/info', {
        wupinId: record.value.wupinId
      })
  }

  const onClassClick = () => {
    record.value &&
      record.value.classId !== 1 &&
      record.value.classId !== 0 &&
      pushTo(router, route, '/admin/class/info', {
        classId: record.value.classId
      })
  }

  const onClickBag = () => {
    record.value &&
      apiAdminPostAddToShoppingBag(record.value.userId, record.value.wupin.id, num.value).then((res) => {
        if (res.data.data.success) {
          if (num.value <= 0) {
            ElMessage({
              type: 'success',
              message: `已经将 ${record.value.wupin.name} 从用户的购物车移出。`
            })
          } else {
            ElMessage({
              type: 'success',
              message: `已经将 ${num.value}件 ${record.value.wupin.name} 添加到用户的购物车。`
            })
          }
          emits('reload')
        } else {
          ElMessage({
            type: 'error',
            message: '加入购物车失败'
          })
        }
      })
  }

  const num = ref((record.value && record.value.num) || 0)
  if (num.value < 0) {
    num.value = 0
  }
</script>

<template>
  <el-card v-if="record" class="record_box">
    <template #header>
      <div style="display: flow-root">
        <div style="float: left">
          <el-text class="wupin_name" @click="onWupinClick"> {{ record.wupin.name }} </el-text>
        </div>
        <div style="float: right">
          <el-button-group>
            <el-button type="success" size="large" @click="onWupinClick"> 查看商品 </el-button>
            <el-button
              :disabled="record.classId === 1 || record.classId === 0"
              type="primary"
              size="large"
              @click="onClassClick"
            >
              查看商品分类
            </el-button>
          </el-button-group>
        </div>
      </div>
    </template>
    <div style="display: flex; justify-content: left">
      <div class="record_box_pic" style="height: 20vh">
        <el-image :src="record.wupin.pic" />
      </div>
      <div style="margin-left: 10px; height: 20vh">
        <div style="display: flow-root">
          <div class="price_box" style="float: left">
            <div v-if="record.down" class="info_box">
              <el-text class="wupin_down_price">
                商品已下架
                <br />
                <el-text v-if="facePrice > 0" class="wupin_down_price wupin_down_price_line_through">
                  售价：￥{{ (facePrice / 100).toFixed(2) }}
                </el-text>
                <br />
                <el-text
                  v-if="realPrice > 0 && facePrice != realPrice"
                  class="wupin_down_price wupin_down_price_line_through"
                >
                  原价：￥{{ (realPrice / 100).toFixed(2) }}
                </el-text>
              </el-text>
            </div>
            <div v-else-if="facePrice == 0" class="info_box">
              <el-text class="wupin_hot_price">
                现在：免费抢购
                <br />
                <el-text v-if="realPrice > 0" class="wupin_hot_real_price wupin_hot_real_price_line_through">
                  原价：￥{{ (realPrice / 100).toFixed(2) }}
                </el-text>
              </el-text>
            </div>
            <div v-else-if="facePrice < realPrice" class="info_box">
              <el-text class="wupin_hot_price">
                促销：￥{{ (facePrice / 100).toFixed(2) }} / 件
                <br />
                <el-text v-if="realPrice > 0" class="wupin_hot_real_price wupin_hot_real_price_line_through">
                  原价：￥{{ (realPrice / 100).toFixed(2) }} / 件
                </el-text>
                <br />
                <el-text v-if="realPrice > 0" class="wupin_hot_real_price">
                  惊喜：{{ ((facePrice / realPrice) * 10).toFixed(1) }} 折扣
                </el-text>
              </el-text>
            </div>
            <div v-else-if="facePrice > realPrice" class="info_box">
              <!--              不应该出现此情况-->
              <el-text class="wupin_sb_price">
                冤种价：￥{{ (facePrice / 100).toFixed(2) }} / 件
                <br />
                <el-text v-if="realPrice > 0" class="wupin_sb_real_price wupin_sb_real_price_line_through">
                  原价：￥{{ (realPrice / 100).toFixed(2) }} / 件
                </el-text>
              </el-text>
            </div>
            <div v-else-if="facePrice == realPrice" class="info_box">
              <el-text class="wupin_real_price"> 售价：￥{{ (facePrice / 100).toFixed(2) }} / 件 </el-text>
              <br />
            </div>
            <div v-else-if="realPrice == 0" class="info_box">
              <!--              不应该出现此情况-->
              <el-text class="wupin_sb_price">
                冤种价：￥{{ (facePrice / 100).toFixed(2) }} / 件
                <br />
                <el-text v-if="realPrice > 0" class="wupin_sb_real_price wupin_sb_real_price_line_through">
                  原价：免费送
                </el-text>
              </el-text>
            </div>
            <div v-else class="info_box">
              <!--              不应该出现此情况-->
              <el-text class="wupin_real_price">
                售价：￥{{ (facePrice / 100).toFixed(2) }} / 件
                <br />
                <el-text v-if="realPrice > 0" class="wupin_else_real_price wupin_else_real_price_line_through">
                  原价：￥{{ (realPrice / 100).toFixed(2) }} / 件
                </el-text>
              </el-text>
            </div>
            <div v-if="record.time" class="info_box">
              <el-text class="record_info"> 放入购物车时间：{{ formatDate(record.time) }} </el-text>
            </div>
            <div class="info_box">
              <el-text
                v-if="
                  record.wupin &&
                  record.wupin.classId !== 1 &&
                  record.wupin.classOf &&
                  record.wupin.classOf.id === record.wupin.classId
                "
                class="record_info"
              >
                商品分类：{{ record.wupin.classOf.name }}
              </el-text>
              <el-text v-else class="class_text"> 商品暂无分类 </el-text>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div style="display: flex; justify-content: right">
        <div style="display: flex">
          <el-input-number
            v-model="num"
            :disabled="record.down"
            :min="0"
            :max="99"
            size="large"
            class="buy_item"
            :precision="0"
            @click="onClickBag"
          >
            <template #suffix>
              <span> 件 </span>
            </template>
          </el-input-number>
          <el-button class="buy_item" size="large" :disabled="record.down" @click="onClickBag">
            <el-icon style="margin-right: 3px"><Handbag /></el-icon> 重设用户购物车
          </el-button>
        </div>
        <div style="display: flex">
          <el-tooltip effect="dark" content="只有用户能为自己购买" placement="bottom">
            <el-button class="buy_item" size="large" disabled>
              <el-icon style="margin-right: 3px"><Money /></el-icon>
              立即购买
              <span v-if="num >= 1">
                （ 总价：{{ totalPrice > 0 ? '￥' + (totalPrice / 100).toFixed(2) : '免费' }} ）
              </span>
            </el-button>
          </el-tooltip>
        </div>
      </div>
    </template>
  </el-card>
</template>

<style scoped lang="scss">
  .buy_item {
    margin-left: 3px;
    margin-right: 3px;
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
    font-size: 1.5rem;
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

  .info_box {
    margin-bottom: 5px;
  }
</style>
