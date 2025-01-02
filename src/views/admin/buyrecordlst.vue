<script setup lang="ts">
  import { BuyRecordStatus } from '#/center/buyrecord'
  import { isAdmin } from '@/store/admin'
  import useAdminUserStore, { AdminUser } from '@/store/admin/user'
  import { apiAdminGetUserBuyRecordByPage } from '#/admin/buyrecord'
  import pushTo from '@/views/admin/router_push'
  import { ElMessage } from 'element-plus'
  import AdminBuyRecord from '@/components/admin/adminbuyrecord.vue'

  const activeModel = ref('1')
  const dataInfo = ref({} as any)
  const currentPage = ref<{ [key: string]: number }>({})

  const router = useRouter()
  const route = useRoute()

  if (!isAdmin()) {
    router.push({
      path: '/system/error',
      query: {
        msg: '页面错误'
      }
    })
  }

  const toBack = () => {
    pushTo(router, route, '/admin/user/list')
  }

  const userAdminStore = useAdminUserStore()

  const userId = ref(Number(route.query?.userId).valueOf() || 0)
  const user = ref(null as AdminUser | null)

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
        path: '/system/error',
        query: {
          msg: '页面错误'
        }
      })
      return
    }

    const page = currentPage.value[status] || 1
    apiAdminGetUserBuyRecordByPage(userId.value, page, 20, Number(status).valueOf())
      .then((res) => {
        dataInfo.value[status] = {
          data: res.data.data.list,
          total: res.data.data.total,
          maxcount: res.data.data.maxcount,
          pagesize: 20
        }
      })
      .catch(() => {
        ElMessage({
          type: 'error',
          message: '获取数据失败'
        })
      })
  }
</script>

<template>
  <el-card v-if="dataInfo && isAdmin()" class="base_card admin_root_main_base_card">
    <div>
      <el-tabs v-model="activeModel" @tab-change="changePage(activeModel)">
        <el-tab-pane
          v-for="(status, index) in BuyRecordStatus"
          :key="index"
          :hidden="!dataInfo[index]"
          :label="status as unknown as string"
          :name="index"
        >
          <div v-if="(dataInfo[index]?.maxcount || 0) > 0">
            <div class="pager">
              <el-pagination
                v-model:current-page="currentPage[index]"
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
                  <AdminBuyRecord :record="record" :safe="false" :xiangqing="true"> </AdminBuyRecord>
                </div>
              </div>
            </div>
            <div class="pager">
              <el-pagination
                v-model:current-page="currentPage[index]"
                background
                layout="prev, pager, next"
                :page-size="dataInfo[index]?.pgesize || 20"
                :total="dataInfo[index]?.maxcount || 0"
                @change="changePage(index)"
              />
            </div>
          </div>
          <div v-else>
            <el-result icon="success" title="用户在此处没有任何销售记录" sub-title="欢迎到别处去看看吧"></el-result>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
  .pager {
    display: flex;
    justify-content: center;
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
