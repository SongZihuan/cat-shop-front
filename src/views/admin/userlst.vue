<script setup lang="ts">
import useAdminUserStore, {AdminUser, GetAdminUserStatus, AdminUserType} from "@/store/admin/user"
import useConfigStore from "@/store/config"
import {isAdmin} from "@/store/admin"
import { ElMessage } from "element-plus"

const route = useRoute()
const router = useRouter()

if (!isAdmin()) {
  router.push({
    path: "error",
    query: {
      msg: "页面错误"
    }
  })
}

const maxpage = ref(0)
const page = ref(Number(route.query?.page).valueOf() || 1)
const pagesize = ref(20)
if (page.value < 1) {
  page.value = 1
}

const configStore = useConfigStore()
const adminUserStore = useAdminUserStore()
const userLst = ref([] as AdminUser[])

const onChange = () => {
  adminUserStore.getUserLst(page.value, pagesize.value).then((res) => {
    maxpage.value = res.maxpage
    userLst.value = res.list
  })
}
onChange()

const showAvatar = ref(false)
const avatarUrl = ref("")

const openAvatar = (avatar: string) => {
  if (avatar.length === 0) {
    avatar = configStore.config?.avatar
  }

  if (avatar.length === 0) {
    ElMessage({
      type: "error",
      message: "对方无头像",
    })
    return
  }

  avatarUrl.value = avatar
  showAvatar.value = true
}

const toInfo = (id: number) => {
  router.push({
    path: "/admin/user/list/info",
    query: {
      userId: id,
    }
  })
}

</script>

<template>
  <div v-if="isAdmin()" style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <el-card style="display: flex; min-height: 70vh; width: 80vw; justify-content: center; margin-top: 10px">
      <el-table :data="userLst" style="width: 77vw" height="60vh">
        <el-table-column prop="id" label="用户ID" />
        <el-table-column label="类型" >
          <template #default="{row}">
            {{ AdminUserType[row.type] || "未知" }}
          </template>
        </el-table-column>
        <el-table-column label="状态" >
          <template #default="{row}">
            {{ GetAdminUserStatus()[row.status] || "未知" }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="location" label="地址" />
        <el-table-column label="头像" >
          <template #default="{ row }">
            <el-button size="small" plain type="success" :disabled="(!configStore.config?.avatar) || configStore.config.avatar.length === 0" @click="openAvatar(row.avatar)">
              点击查看头像
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="总消费金额" >
          <template #default="{ row }">
            ￥{{ (row.totalPrice / 100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="totalBuy" label="总购物次数" />
        <el-table-column prop="totalGood" label="总购买件数" />
        <el-table-column prop="totalShouHuo" label="总收货次数" />
        <el-table-column prop="totalPingJia" label="总评价次数" />
        <el-table-column label="平均消费金额" >
          <template #default="{ row }">
            ￥{{ (row.pricePre / 100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="好评率" >
          <template #default="{ row }">
            {{ row.goodPre.toFixed(2) }}%
          </template>
        </el-table-column>
        <el-table-column label="详情" >
          <template #default="{ row }">
            <el-button plain type="primary" size="small" @click="toInfo(row.id)"> 查看详情 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; justify-content: center; margin-top: 10px;">
        <el-pagination v-model:current-page="page" class="pager" background layout="prev, pager, next" :page-size="pagesize" :total="maxpage || 0" @change="onChange" />
      </div>
    </el-card>
  </div>
  <div v-else></div>

  <el-dialog
      v-model="showAvatar"
      style="height: 50vh; width: 20vw;"
      destroy-on-close
  >
    <div style="height: 35vh; width: 100%; display: flex; justify-content: center">
      <img alt="wechat" style="height: 100%; width: 100%; object-fit: contain;" :src="avatarUrl"/>
    </div>

    <template #footer>
      <div class="dialog-footer" style="height: 10vh">
        <el-button type="success" @click="showAvatar = false">
          关闭
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>