<script setup lang="ts">
  import { apiGetUserShoppingRecord, ShopRecord } from '#/center/shoppingbag'
  import Shoppingbag from '@/components/center/shoppingbag.vue'

  let offset = 0
  const limit = 20
  const stop = ref(false)
  const loading = ref(false)
  const shopRecord = ref([] as ShopRecord[])

  const updater = async () => {
    if (stop.value || loading.value) {
      return
    }

    loading.value = true
    apiGetUserShoppingRecord(offset, limit)
      .then((res) => {
        if (res.data.data.total < limit) {
          stop.value = true
        }

        offset += res.data.data.total
        shopRecord.value = shopRecord.value.concat(res.data.data.list)
      })
      .catch(() => {
        stop.value = true
      })
      .finally(() => {
        loading.value = false
      })
  }
  updater()

  const headerCustomer = ref<HTMLElement>()
  const headerHeight = ref('0')
  const el_card_header_px = 37

  const updateHeaderHeight = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      headerHeight.value = entry.contentRect.height + el_card_header_px + 'px'
    })
  })

  watch(headerCustomer, () => headerCustomer.value && updateHeaderHeight.observe(headerCustomer.value))
</script>

<template>
  <el-card class="base_card">
    <template #header>
      <div ref="headerCustomer">
        <div class="title_box">
          <el-text class="title">购物车</el-text>
        </div>
      </div>
    </template>
    <div v-if="stop && shopRecord.length === 0">
      <el-result icon="success" title="您的购物车还没有任何记录呢" sub-title="欢迎到别处去看看吧">
        <template #extra>
          <el-button type="primary">到我的中心</el-button>
        </template>
      </el-result>
    </div>
    <div v-else>
      <div class="box">
        <div class="scroll">
          <van-list v-model="loading" :finished="stop" finished-text="没有更多数据了" @load="updater">
            <div v-for="(item, index) in shopRecord" :key="index" class="bag_box">
              <Shoppingbag ref="shopper" :record="item"></Shoppingbag>
            </div>
          </van-list>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
  .base_card {
    --base-card-height: #{var(--custom-height)};
    --base-card-width: #{var(--custom-little-width)};
    min-height: #{var(--base-card-height)};
    width: #{var(--base-card-width)};
  }

  .box {
    display: flow-root;
    --base-card-body-height: calc(
      #{var(--base-card-height)} - v-bind(headerHeight) - 40px
    ); // el_card对body内置的padding
    height: calc(#{var(--base-card-body-height)} - 6px);
    margin-top: 3px;
    margin-bottom: 3px;
  }

  .scroll {
    height: 100%;
    overflow-y: auto;
  }

  .title {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .bag_box {
    margin-left: 15px;
    margin-right: 25px;
    margin-bottom: 25px;
  }
</style>
