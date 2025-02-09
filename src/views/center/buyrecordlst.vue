<script setup lang="ts">
  import { ElNotification } from 'element-plus'
  import BuyRecord from '@/components/center/buyrecord.vue'
  import { apiGetUserBuyRecordByPage } from '#/center/buyrecord'
  import { BuyRecordStatus } from '#/center/buyrecord'

  const activeModel = ref('1')
  const dataInfo = ref({} as any)
  const currentPage = ref<{ [key: string]: number }>({})

  const changePage = (status: number | string) => {
    const page = currentPage.value[status] || 1
    apiGetUserBuyRecordByPage(page, 20, Number(status).valueOf()).then((res) => {
      dataInfo.value[status] = {
        data: res.data.data.list,
        pagesizze: 20,
        total: res.data.data.total,
        maxcount: res.data.data.maxcount,
        pagesize: 20
      }

      if (status === '2' && res.data.data.total > 0) {
        ElNotification({
          title: '支付提示',
          message: '有订单支付失败哦，请尝试重新支付！',
          type: 'warning',
          duration: 5000,
          position: 'top-left'
        })
      }
    })
  }

  changePage(activeModel.value)

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
          <el-text class="title">购物记录列表</el-text>
        </div>
      </div>
    </template>
    <div class="box">
      <el-tabs v-model="activeModel" @tab-change="changePage(activeModel)">
        <el-tab-pane
          v-for="(status, index) in BuyRecordStatus"
          :key="index"
          :hidden="!dataInfo[index]"
          :label="status as unknown as string"
          :name="index"
        >
          <div v-if="(dataInfo[index]?.maxcount || 0) > 0">
            <div style="display: flex; justify-content: center">
              <el-pagination
                v-model:current-page="currentPage[index]"
                class="pager"
                background
                layout="prev, pager, next"
                :page-size="dataInfo[index]?.pgesize || 20"
                :total="dataInfo[index]?.maxcount || 0"
                @change="changePage(index)"
              />
            </div>
            <div style="width: 100%; display: flex; justify-content: center">
              <div style="width: 100%">
                <div v-for="(record, idx) in dataInfo[index]?.data || {}" :key="idx" class="record_box">
                  <BuyRecord :record="record" :safe="false" :xiangqing="true"> </BuyRecord>
                </div>
              </div>
            </div>
            <div style="display: flex; justify-content: center">
              <el-pagination
                v-model:current-page="currentPage[index]"
                class="pager"
                background
                layout="prev, pager, next"
                :page-size="dataInfo[index]?.pgesize || 20"
                :total="dataInfo[index]?.maxcount || 0"
                @change="changePage(index)"
              />
            </div>
          </div>
          <div v-else>
            <el-result icon="success" title="在此处您没有任何销售记录" sub-title="欢迎到别处去看看吧">
              <template #extra>
                <el-button type="primary">到我的中心</el-button>
              </template>
            </el-result>
          </div>
        </el-tab-pane>
      </el-tabs>
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
    min-height: calc(#{var(--base-card-body-height)} - 6px);
    margin-top: 3px;
    margin-bottom: 3px;
  }

  .pager {
    margin-bottom: 5px;
    margin-top: 5px;
  }

  .title {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .record_box {
    margin-bottom: 15px;
    width: 100%;
  }
</style>
