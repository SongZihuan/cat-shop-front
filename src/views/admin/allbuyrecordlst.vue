<script setup lang="ts">
import {BuyRecordStatus} from "#/center/buyrecord"
import AdminBuyRecord from "@/components/admin/adminbuyrecord.vue"
import {isAdmin} from "@/store/admin"
import {apiAdminGetBuyRecordByPage} from "#/admin/buyrecord"
import { ElMessage } from "element-plus"

const router = useRouter()

if (!isAdmin()) {
  router.push({
    path: "error",
    query: {
      msg: "页面错误"
    }
  })
}

const activeModel = ref("1")
const dataInfo = ref({} as any)
const currentPage = ref<{ [key: string]: number }>({})

const changePage = (status: string) => {
  console.log("status", status, typeof status)

  const page = currentPage.value[status] || 1
  apiAdminGetBuyRecordByPage(page, 20, Number(status).valueOf()).then((res) => {
    dataInfo.value[status] = {
      data: res.data.data.list,
      pagesizze:20,
      total: res.data.data.total,
      maxcount: res.data.data.maxcount,
      pagesize: 20,
    }
    console.log(res.data.data.maxcount)
  }).catch(() => {
    ElMessage({
      type: "error",
      message: "获取数据失败",
    })
  })
}

changePage(activeModel.value)

</script>

<template>
  <div v-if="isAdmin()" style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <el-card style="display: flex; height: 70vh; width: 80vw; justify-content: center; margin-top: 10px">
      <el-tabs v-model="activeModel" style="width: 75vw" :stretch="true" @tab-change="changePage(activeModel)">
        <el-tab-pane v-for="(status, index) in BuyRecordStatus" :key="index" :hidden="!dataInfo[index]" :label="status as unknown as string" :name="index">
          AAA {{ typeof  status }}  {{ status }}
          <div v-if="dataInfo[index]?.data && dataInfo[index].data.length > 0">
           <el-scrollbar height="60vh">
             <div style="display: flex; justify-content: center; margin-bottom: 10px; margin-top: 10px;">
               <el-pagination v-model:current-page="currentPage[index]" class="pager" background layout="prev, pager, next" :page-size="dataInfo[index]?.pgesize || 20" :total="dataInfo[index]?.maxcount || 0" @change="changePage(index as unknown as string)" />
             </div>
             <div style="width: 100%; display: flex; justify-content: center">
               <div style="width: 100%;">
                   <div v-for="(record, idx) in dataInfo[index]?.data || {}" :key="idx" style="margin-top: 10px; width: 100%;">
                     <AdminBuyRecord :record="record" :safe="false" :xiangqing="true"> </AdminBuyRecord>
                   </div>
               </div>
             </div>
             <div style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
(               <el-pagination v-model:current-page="currentPage[index]" class="pager" background layout="prev, pager, next" :page-size="dataInfo[index]?.pgesize || 20" :total="dataInfo[index]?.maxcount || 0" @change="changePage(index as unknown as string)" />
)             </div>
           </el-scrollbar>
         </div>
          <div v-else>
            <el-result
                icon="info"
                title="在此处您没有任何销售记录"
                sub-title="欢迎到别处去看看吧"
            >
            </el-result>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
  <div v-else></div>
</template>

<style scoped lang="scss">
.pager {
  margin-bottom: 5px;
  margin-top: 5px;
}
</style>