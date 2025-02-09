<script setup lang="ts">
  import AdminShoppingbag from '@/components/admin/adminshoppingbag.vue'
  import { isAdmin } from '@/store/admin'
  import useAdminUserStore, { AdminUser } from '@/store/admin/user'
  import { AdminShopRecord, apiAdminGetUserShoppingRecord } from '#/admin/shoppingbag'
  import pushTo from '@/views/admin/router_push'
  import { RouteLocationNormalized } from 'vue-router'

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

  const userAdminStore = useAdminUserStore()

  const userId = ref(Number(route.query?.userId).valueOf() || 0)
  const user = ref(null as AdminUser | null)

  const maxcount = ref(0)
  const querypage = ref(Number(route.query?.page).valueOf() || 1)
  if (querypage.value < 1) {
    querypage.value = 1
  }
  const page = ref(querypage.value)
  const pagesize = ref(20)
  const shoppingbagLst = ref([] as AdminShopRecord[])

  const getData = () => {
    user.value &&
      apiAdminGetUserShoppingRecord(userId.value, page.value, pagesize.value).then((res) => {
        maxcount.value = res.data.data.maxcount
        shoppingbagLst.value = res.data.data.list
      })
  }

  const onChangeUser = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
    let nowQueryPage = Number(to.query?.page).valueOf() || 1
    if (nowQueryPage < 1) {
      nowQueryPage = 1
    }

    if (nowQueryPage !== querypage.value) {
      querypage.value = nowQueryPage
      page.value = nowQueryPage
    }

    userId.value = Number(to.query?.userId).valueOf() || 0
    user.value = null

    if (userId.value) {
      userAdminStore.getUser(userId.value).then(
        (res) => {
          user.value = res as AdminUser
          getData()
        },
        () => {
          toBack()
        }
      )
    } else {
      toBack()
    }
    next()
  }

  const toBack = () => {
    pushTo(router, route, '/admin/user/list')
  }

  const onChangePage = () => {
    getData()
  }

  onBeforeRouteUpdate(onChangeUser)
  onChangeUser(route, route, () => {})
</script>

<template>
  <el-card v-if="user && isAdmin()" class="base_card admin_root_main_base_card">
    <div v-if="shoppingbagLst && shoppingbagLst.length > 0">
      <div style="display: flex; justify-content: center">
        <div style="width: 100%">
          <div class="pager">
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
          <div style="width: 100%; display: flex; justify-content: center">
            <div style="width: 100%">
              <div v-for="(item, index) in shoppingbagLst" :key="index" class="record_box">
                <AdminShoppingbag :record="item" @reload="onChangePage"></AdminShoppingbag>
              </div>
            </div>
          </div>
          <div style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
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
        </div>
      </div>
    </div>
    <div v-else>
      <el-result icon="info" title="用户的购物车还没有任何记录呢" sub-title="欢迎到别处去看看吧"></el-result>
    </div>
  </el-card>
  <div v-else></div>
</template>

<style scoped lang="scss">
  .pager {
    display: flex;
    justify-content: center;
    margin-bottom: 5px;
    margin-top: 5px;
  }

  .record_box {
    margin-bottom: 15px;
    width: 100%;
  }
</style>
