<script setup lang="ts">
import {BuyRecordStatus} from "#/center/buyrecord"
import AdminBuyRecord from "@/components/admin/adminbuyrecord.vue"
import {isAdmin} from "@/store/admin"
import useAdminUserStore, {AdminUser} from "@/store/admin/user"
import {apiAdminGetUserBuyRecordByPage} from "#/admin/buyrecord"
import pushTo from "@/views/admin/router_push"
import { ElMessage } from "element-plus"

const router = useRouter()
const route = useRoute()

if (!isAdmin()) {
  router.push({
    path: "error",
    query: {
      msg: "页面错误"
    }
  })
}

const toBack = () => {
  pushTo(router, route, "/admin/user/list")
}

const userAdminStore = useAdminUserStore()

const userId = ref(Number(route.query?.userId).valueOf() || 0)
const user = ref(null as AdminUser | null)

const activeModel = ref("1")
const dataInfo = ref({} as any)
const currentPage = ref<{ [key: string]: number }>({})

const onChangeUser = () => {
  userId.value = Number(route.query?.userId).valueOf() || 0
  user.value = null

  if (userId.value) {
    userAdminStore.getUser(userId.value).then((res) => {
      user.value = res as AdminUser
      changePage(activeModel.value)
    })
  } else {
    toBack()
  }
}

watch(() => route.query?.userId, onChangeUser)
onChangeUser()

const changePage = (status: number | string) => {
  if (!user.value) {
    router.push({
      path: "/system/error",
      query: {
        msg: "页面错误"
      }
    })
    return
  }

  const page = currentPage.value[status] || 1
  apiAdminGetUserBuyRecordByPage(userId.value, page, 20, Number(status).valueOf()).then((res) => {
    dataInfo.value[status] = {
      data: res.data.data.list,
      pagesizze:20,
      total: res.data.data.total,
      maxcount: res.data.data.maxcount,
      pagesize: 20,
    }
  }).catch(() => {
    ElMessage({
      type: "error",
      message: "获取数据失败",
    })
  })
}

const toHome = () => {
  pushTo(router, route, "/admin/user/info")
}
</script>

<template>
  <div v-if="user && isAdmin()" style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <el-card style="display: flex; height: 70vh; width: 80vw; justify-content: center; margin-top: 10px">
      <el-tabs v-model="activeModel" style="width: 75vw" :stretch="true" @tab-change="changePage(activeModel)">
        <el-tab-pane v-for="(status, index) in BuyRecordStatus" :key="index" :hidden="!dataInfo[index]" :label="status as unknown as string" :name="index">
         <div v-if="dataInfo[index]?.data && dataInfo[index].data.length > 0">
           <el-scrollbar height="60vh">
             <div style="display: flex; justify-content: center; margin-bottom: 10px; margin-top: 10px;">
               <el-pagination v-model:current-page="currentPage[index]" class="pager" background layout="prev, pager, next" :page-size="dataInfo[index]?.pgesize || 20" :total="dataInfo[index]?.maxcount || 0" @change="changePage(index)" />
             </div>
             <div style="width: 100%; display: flex; justify-content: center">
               <div style="width: 100%;">
                   <div v-for="(record, idx) in dataInfo[index]?.data || {}" :key="idx" style="margin-top: 10px; width: 100%;">
                     <AdminBuyRecord :record="record" :safe="false" :xiangqing="true" :adminuser="true"> </AdminBuyRecord>
                   </div>
               </div>
             </div>
             <div style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
               <el-pagination v-model:current-page="currentPage[index]" class="pager" background layout="prev, pager, next" :page-size="dataInfo[index]?.pgesize || 20" :total="dataInfo[index]?.maxcount || 0" @change="changePage(index)" />
             </div>
           </el-scrollbar>
         </div>
          <div v-else>
            <el-result
                icon="info"
                title="在此处您没有任何销售记录"
                sub-title="欢迎到别处去看看吧"
            >
              <template #extra>
                <el-button type="primary" @click="toHome">到我的中心</el-button>
              </template>
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