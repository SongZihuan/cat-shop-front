<script setup lang="ts">
import {apiGetUserShoppingRecord, ShopRecord} from "#/center/shoppingbag"
import Shoppingbag from "@/components/center/shoppingbag.vue"

let offset = 0
const limit = 20
const stop = ref(false)
const shopRecord = ref([] as ShopRecord[])

const updater = () => {
  if (stop.value) {
    return
  }

  return apiGetUserShoppingRecord(offset, limit).then((res) => {
    if (res.data.data.total < limit) {
      stop.value = true
    }

    offset += res.data.data.total
    shopRecord.value = shopRecord.value.concat(res.data.data.list)
  }).catch(() => {
    stop.value = true
  })
}
updater()

</script>

<template>
  <div style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <el-card style="display: flex; max-width: 50%; justify-content: center; margin-top: 10px">
      <div v-if="stop && shopRecord.length === 0">
        <el-result
            icon="success"
            title="您的购物车还没有任何记录呢"
            sub-title="欢迎到别处去看看吧"
        >
          <template #extra>
            <el-button type="primary">到我的中心</el-button>
          </template>
        </el-result>
      </div>
      <div v-else v-infinite-scroll="updater" style="height: 60vh; width: 50vw; overflow: auto">
        len: {{ shopRecord.length }}
        <div v-for="(item, index) in shopRecord" :key="index">
          AAA {{ index }}
          <Shoppingbag ref="shopper" :record="item"></Shoppingbag>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">

</style>