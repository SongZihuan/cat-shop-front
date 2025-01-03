<script setup lang="ts">
  import WupinLst from '@/components/shop/wupinlist.vue'
  import Search from '@/components/shop/search.vue'
  import { Wupin } from '@/store/hotwupin'
  import { apiGetSearchWupin } from '#/center/search'

  const route = useRoute()

  const wupinlst = ref([] as Wupin[])
  const currentPage = ref(Number(route.query?.page).valueOf() || 1)
  const maxcount = ref(0)
  const pagesize = ref(20)
  if (currentPage.value < 1) {
    currentPage.value = 1
  }

  const data = ref({
    select: 0,
    search: ''
  } as { select?: number; search?: string })

  const changePage = async () => {
    if (route.query?.info) {
      data.value = JSON.parse(route.query?.info as string) as { select?: number; search?: string }
    }

    await apiGetSearchWupin(data.value?.search || '', data.value?.select || 0, currentPage.value, 20).then((res) => {
      wupinlst.value = res.data.data.list
      maxcount.value = res.data.data.maxcount
    })
  }

  onBeforeRouteUpdate(changePage)
  changePage()
</script>

<template>
  <div class="outside">
    <div class="search">
      <Search></Search>
    </div>
    <div class="wupinlst">
      <WupinLst :wp="wupinlst"></WupinLst>
    </div>
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        class="pager"
        background
        layout="prev, pager, next"
        :total="maxcount"
        :page-size="pagesize"
        @change="changePage"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .outside {
    display: flex;
    flex-direction: column; /* 竖直排列 */
    align-items: center; /* 水平居中 */
  }

  .search {
    width: #{var(--custom-little-width)};
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .wupinlst {
    display: flex;
    justify-content: center;

    width: #{var(--custom-width)};
    margin-top: 10px;
  }

  .pagination {
    display: flex;
    justify-content: center;

    width: #{var(--custom-width)};
    margin-top: 10px;
  }
</style>
