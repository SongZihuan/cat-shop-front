<script setup lang="ts">
  import useAdminUserStore, { AdminUser, RootAdminUserStatus, RootAdminUserType } from '@/store/admin/user'
  import useConfigStore from '@/store/config'
  import { isAdmin } from '@/store/admin'
  import { ElMessage } from 'element-plus'
  import pushTo from '@/views/admin/router_push'
  import { RouteLocationNormalized } from 'vue-router'

  const route = useRoute()
  const router = useRouter()

  if (!isAdmin()) {
    router.push({
      path: '/system/error',
      query: {
        msg: '页面错误'
      }
    })
  }

  const maxcount = ref(0)
  const querypage = ref(Number(route.query?.page).valueOf() || 1)
  if (querypage.value < 1) {
    querypage.value = 1
  }
  const page = ref(querypage.value)
  const pagesize = ref(20)

  const configStore = useConfigStore()
  const adminUserStore = useAdminUserStore()
  const userLst = ref([] as AdminUser[])

  const onChange = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
    let nowQueryPage = Number(to.query?.page).valueOf() || 1
    if (nowQueryPage < 1) {
      nowQueryPage = 1
    }

    if (nowQueryPage !== querypage.value) {
      querypage.value = nowQueryPage
      page.value = nowQueryPage
    }

    adminUserStore.getUserLst(page.value, pagesize.value).then((res) => {
      maxcount.value = res.maxcount
      userLst.value = res.list
    })
    next()
  }
  onBeforeRouteUpdate(onChange)
  onChange(route, route, () => {})

  const avatarUrl = ref('')
  const openAvatar = (avatar: string) => {
    if (avatar.length === 0) {
      avatar = configStore.config?.avatar
    }

    if (avatar.length === 0) {
      ElMessage({
        type: 'error',
        message: '对方无头像'
      })
      return
    }

    avatarUrl.value = avatar
  }

  const onChangePage = () => {
    onChange(route, route, () => {})
  }

  const toInfo = (id: number) => {
    pushTo(router, route, '/admin/user/info', {
      userId: id
    })
  }
</script>

<template>
  <el-card v-if="isAdmin()" class="base_card admin_root_main_base_card">
    <el-table :data="userLst" style="width: 100%" height="100%" :scrollbar-tabindex="3">
      <el-table-column prop="id" label="用户ID" />
      <el-table-column label="类型">
        <template #default="{ row }">
          {{ RootAdminUserType[row.type] || '未知' }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template #default="{ row }">
          {{ RootAdminUserStatus[row.status] || '未知' }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="昵称" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="location" label="地址" />
      <el-table-column label="头像">
        <template #default="{ row }">
          <el-button
            size="small"
            plain
            type="success"
            :disabled="!configStore.config?.avatar || configStore.config.avatar.length === 0"
            @click="openAvatar(row.avatar)"
          >
            查看头像
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="总消费金额">
        <template #default="{ row }"> ￥{{ (row.totalPrice / 100).toFixed(2) }} </template>
      </el-table-column>
      <el-table-column prop="totalBuy" label="总购物次数" />
      <el-table-column prop="totalGood" label="总购买件数" />
      <el-table-column prop="totalShouHuo" label="总收货次数" />
      <el-table-column prop="totalPingJia" label="总评价次数" />
      <el-table-column label="平均消费金额">
        <template #default="{ row }">
          <span v-if="row.pricePre"> ￥{{ (row.pricePre / 100).toFixed(2) || '0.00' }} </span>
          <span v-else> ￥0.00 </span>
        </template>
      </el-table-column>
      <el-table-column label="评价率">
        <template #default="{ row }">
          <span v-if="row.pingjiaPre"> {{ row.pingjiaPre.toFixed(2) || 0 }}% </span>
          <span v-else> 0% </span>
        </template>
      </el-table-column>
      <el-table-column label="好评率">
        <template #default="{ row }">
          <span v-if="row.pingjiaPre"> {{ row.goodPre.toFixed(2) || 0 }}% </span>
          <span v-else> 0% </span>
        </template>
      </el-table-column>
      <el-table-column label="详情">
        <template #default="{ row }">
          <el-button plain type="primary" size="small" @click="toInfo(row.id)"> 查看详情 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: center; margin-top: 10px">
      <el-pagination
        v-model:current-page="page"
        class="pager"
        background
        layout="prev, pager, next"
        :page-size="pagesize"
        :total="maxcount || 0"
        @change="onChangePage"
      />
    </div>
  </el-card>
  <div v-else></div>
  <Showimg v-model="avatarUrl"></Showimg>
</template>

<style scoped lang="scss"></style>
