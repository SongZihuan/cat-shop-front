<script setup lang="ts">
import AdminSearch from "@/components/admin/adminsearch.vue"
import {AdminWupin} from "#/admin/wupin";
import {apiAdminGetSearchWupin} from "#/admin/search";
import Adminwupinlist from "@/components/admin/adminwupinlist.vue";

const route = useRoute()

const wupinlst = ref([] as AdminWupin[])
const currentPage = ref(Number(route.query?.page).valueOf() || 1)
const maxcount = ref(0)
const pagesize = ref(20)
if (currentPage.value < 1) {
  currentPage.value = 1
}

const data = ref({
  select: 0,
  search: "",
} as { select?: number, search?: string })

const changePage = () => {
  if (route.query?.info) {
    data.value = JSON.parse(route.query?.info as string) as { select?: number, search?: string }
  }

  apiAdminGetSearchWupin(data.value?.search || "", data.value?.select || 0, currentPage.value, 20).then((res) => {
    wupinlst.value = res.data.data.list
    maxcount.value = res.data.data.maxcount
  })
}

watch(() => route.query?.info, changePage)
changePage()

</script>

<template>
  <el-scrollbar height="75vh">
    <div style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
      <div style="width: 65%;">
        <AdminSearch  style="margin-top: 10px; margin-bottom: 10px" :tyoe="-1"></AdminSearch>
      </div>
    </div>
    <div style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
      <div style="width: 90%; display: flex; justify-content: space-between; margin-top: 10px">
        <Adminwupinlist :wp="wupinlst"></Adminwupinlist>
      </div>
    </div>
    <div style="display: flex; justify-content: center">
      <el-pagination v-model:current-page="currentPage" class="pager" background layout="prev, pager, next" :total="maxcount" :page-size="pagesize" @change="changePage" />
    </div>
  </el-scrollbar>
</template>

<style scoped lang="scss">

</style>