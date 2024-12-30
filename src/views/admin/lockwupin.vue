<script setup lang="ts">
  import {Location} from "@element-plus/icons-vue"
  import {getFacePrice, getRealPrice, getTotalPrice} from "@/utils/price"
  import {isAdmin} from "@/store/admin"
  import {AdminWupin} from "#/admin/wupin"
  import pushTo from "@/views/admin/router_push"
  import {AdminBuyRecord, apiAdminGetBuyRecordInfo} from "#/admin/buyrecord";
  import {apiAdminPostAddToShoppingBag} from "#/admin/shoppingbag";
  import {ElMessage} from "element-plus";

  const router = useRouter()
  const route = useRoute()

  if (!isAdmin()) {
    router.push({
      path: "/system/error",
      query: {
        msg: "页面错误"
      }
    })
  }

  const toBack = () => {
    pushTo(router, route, "/admin/user/list")
  }

  const recordId = ref(0)
  const record = ref(null as AdminBuyRecord | null)
  const wupin = ref(null as AdminWupin | null)

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
    } else {
      return "谨慎购买"
    }
  })

  const onChangeWupin = () => {
    recordId.value = Number(route.query?.recordId).valueOf() || 0
    wupin.value = null

    if (recordId.value) {
      apiAdminGetBuyRecordInfo(recordId.value).then((res) => {
        record.value = res.data.data as AdminBuyRecord
        wupin.value = record.value.wupin as AdminWupin
        openTips()
      }, () => {
        toBack()
      })
    } else {
      toBack()
    }
  }

  watch(() => route.query?.recordId, onChangeWupin)
  onChangeWupin()

  const onClassClick = () => {
    wupin.value && wupin.value.classId > 1 && pushTo(router, route, "/admin/class/info", {
      classId: wupin.value?.classOf.id
    })
  }

  const dialogVisible = ref(false)
  const openTips = () => {
    dialogVisible.value = true
  }

  const onBackToBuyRecord = () => {
    record.value && pushTo(router, route, "/admin/user/buyrecord", {
      recordId: record.value.id
    })
  }

  const num = computed(() => {
    return record.value && record.value.num > 0 ? record.value.num : 1
  })

  const onClickBag = () => {
    record.value && apiAdminPostAddToShoppingBag(record.value.userId, record.value.wupin.id, num.value).then((res) => {
      if (res.data.data.success) {
        if (num.value <= 0) {
          record.value && ElMessage({
            type: 'success',
            message: `已经将 ${record.value.wupin.name} 从用户的购物车移出。`,
          })
        } else {
          record.value && ElMessage({
            type: 'success',
            message: `已经将 ${num.value}件 ${record.value.wupin.name} 添加到用户的购物车。`,
          })
        }
        onChangeWupin()
      } else {
        record.value && ElMessage({
          type: 'error',
        })
      }
    })
  }

</script>

<template>
  <el-card v-if="record && wupin && isAdmin()" class="base_card">
    <div style="display: inline-block; width: 15vw; height: 70vh; margin-right: 20px; margin-left: 20px">
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
    </div>
    <div style="display: inline-block; width: 50vw; height: 70vh; margin-right: 20px; margin-left: 20px">
      <div style="padding-right: 5px">
        <el-badge  class="title" :value="(record.down ? (record.wupin.tag ? `已下架 | ${record.wupin.tag}` : '已下架') : record.wupin.tag)" style="margin-top: 10px">
          <el-text class="wupin_name"> {{ wupin.name }} </el-text>
        </el-badge>
        <el-text v-if="wupin.classId > 1 && wupin.classOf" class="wupin_class_name">
          商品来源：
          <el-text class="wupin_class_name_btn" @click="onClassClick"> {{ wupin.classOf.name }} > </el-text>
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
        <div style="display: flex; justify-content: left">
          <div class="btn_box" style="display: flex">
            <el-input-number v-model="num" :min="0" :max="99" size="large" class="buy_item" :disabled="record.down">
              <template #suffix>
                <span> 件 </span>
              </template>
            </el-input-number>
            <el-button class="buy_item" size="large" :disabled="record.down" @click="onClickBag">
              <el-icon style="margin-right: 3px"><Handbag /></el-icon> 重新加入加入购物车
            </el-button>
          </div>
          <div class="btn_box" style="display: flex">
            <el-tooltip
                effect="dark"
                content="只有用户能为自己购买"
                placement="bottom"
            >
              <el-button class="buy_item" size="large" disabled>
                <el-icon style="margin-right: 3px"><Money /></el-icon>
                立即购买
                <span v-if="num >= 1"> （ 总价：{{ totalPrice > 0 ? "￥" + (totalPrice / 100).toFixed(2) : "免费" }} ） </span>
              </el-button>
            </el-tooltip>
          </div>
          <div class="btn_box" style="display: flex" @click="onBackToBuyRecord">
            <el-button type="primary" size="large" plain>
              返回订单
            </el-button>
          </div>
        </div>
        <div id="info_box" class="info_box">
          <div v-html="wupin.info"></div>
        </div>
      </div>
    </div>
  </el-card>
  <div v-else></div>
  <el-dialog
      v-model="dialogVisible"
      title="温馨提示"
      width="500"
  >
    <el-text>请注意，本页面为历史保存页面，旨在保存用户购买商品时，售卖页面的历史信息。</el-text>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
  .btn_box {
    margin-right: 5px;
  }

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