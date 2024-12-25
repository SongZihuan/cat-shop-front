<script setup lang="ts">
import WupinLst from "@/components/shop/wupinlist.vue"
import Search from "@/components/shop/search.vue"
import {Wupin} from "@/store/hotwupin"
import {apiGetSearchWupin} from "#/center/search"

const route = useRoute()

const wupinlst = ref([] as Wupin[])
const currentPage = ref(Number(route.query?.page).valueOf() || 1)
const pagemax = ref(0)
const pagesize = ref(20)
if (currentPage.value < 1) {
  currentPage.value = 1
}

const data = ref({
  select: [],
  search: "",
} as { select?: number[], search?: string })

const changePage = async () => {
  if (route.query?.info) {
    data.value = JSON.parse(route.query?.info as string) as { select?: number[], search?: string }
  }

  await apiGetSearchWupin(data.value?.search || "", data.value?.select || [], currentPage.value, 20).then((res) => {
    wupinlst.value = res.data.data.list
    pagemax.value = res.data.data.maxpage
  })
}

watch(() => route.query?.info, changePage)
changePage()

</script>

<template>
  <div style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <div style="width: 65%;">
      <Search  style="margin-top: 10px; margin-bottom: 10px" :tyoe="-1"></Search>
    </div>
  </div>
  <div style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <div style="width: 90%; display: flex; justify-content: space-between; margin-top: 10px">
      <WupinLst :wp="wupinlst"></WupinLst>
    </div>
  </div>
  <div style="display: flex; justify-content: center">
    <el-pagination v-model:current-page="currentPage" class="pager" background layout="prev, pager, next" :total="pagemax" :page-size="pagesize" @change="changePage" />
  </div>
</template>

<style scoped lang="scss">

</style>