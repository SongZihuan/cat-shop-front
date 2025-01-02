<script setup lang="ts">
  import AdminShoppingbag from '@/components/admin/adminshoppingbag.vue'
  import { isAdmin } from '@/store/admin'
  import useAdminUserStore, { AdminUser } from '@/store/admin/user'
  import { AdminShopRecord, apiAdminGetUserShoppingRecord } from '#/admin/shoppingbag'
  import pushTo from '@/views/admin/router_push'
  import AdminBuyRecord from '@/components/admin/adminbuyrecord.vue'

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
  const page = ref(Number(route.query?.page).valueOf() || 1)
  const pagesize = ref(20)
  if (page.value < 1) {
    page.value = 1
  }
  const shoppingbagLst = ref([] as AdminShopRecord[])

  const onChangeUser = () => {
    userId.value = Number(route.query?.userId).valueOf() || 0
    user.value = null

    if (userId.value) {
      userAdminStore.getUser(userId.value).then(
        (res) => {
          user.value = res as AdminUser
          onChange()
        },
        () => {
          toBack()
        }
      )
    } else {
      toBack()
    }
  }

  const toBack = () => {
    pushTo(router, route, '/admin/user/list')
  }

  watch(() => route.query?.userId, onChangeUser)
  onChangeUser()

  const onChange = () => {
    user.value &&
      apiAdminGetUserShoppingRecord(userId.value, page.value, pagesize.value).then((res) => {
        maxcount.value = res.data.data.maxcount
        shoppingbagLst.value = res.data.data.list
      })
  }
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
              @change="onChange"
            />
          </div>
          <div style="width: 100%; display: flex; justify-content: center">
            <div style="width: 100%">
              <div v-for="(item, index) in shoppingbagLst" :key="index" class="record_box">
                <AdminShoppingbag :record="item" @reload="onChange"></AdminShoppingbag>
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
              @change="onChange"
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
