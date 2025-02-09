<script setup lang="ts">
  import { isAdmin } from '@/store/admin'
  import useAdminUserStore, { AdminUser } from '@/store/admin/user'
  import { AdminMsg as AdminMsgType, apiAdminGetMsg, apiAdminGetUserMsg } from '#/admin/msg'
  import AdminMsg from '@/components/admin/adminmsg.vue'
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

  const toBack = () => {
    pushTo(router, route, '/admin/user/list')
  }

  const userAdminStore = useAdminUserStore()

  const userId = ref(Number(route.query?.userId).valueOf() || 0)
  const user = ref(null as AdminUser | null)

  const isall = computed(() => !!route.meta.msgisall)

  const maxcount = ref(0)
  const querypage = ref(Number(route.query?.page).valueOf() || 1)
  if (querypage.value < 1) {
    querypage.value = 1
  }
  const page = ref(querypage.value)
  const pagesize = ref(20)
  const msgLst = ref([] as AdminMsgType[])

  const getData = () => {
    if (!isall.value && (!userId.value || !user.value || user.value.id !== userId.value)) {
      router.push({
        path: '/system/error',
        query: {
          msg: '页面错误'
        }
      })
    } else if (isall.value) {
      apiAdminGetMsg(page.value, pagesize.value).then((res) => {
        maxcount.value = res.data.data.maxcount
        msgLst.value = res.data.data.list
      })
    } else {
      apiAdminGetUserMsg(userId.value, page.value, pagesize.value).then((res) => {
        maxcount.value = res.data.data.maxcount
        msgLst.value = res.data.data.list
      })
    }
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

    if (isall.value) {
      getData()
    } else if (userId.value) {
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

  const onChangePage = () => {
    getData()
  }

  onBeforeRouteUpdate(onChangeUser)
  onChangeUser(route, route, () => {})
</script>

<template>
  <div v-if="(isall || user) && isAdmin()" class="base_card admin_root_main_base_card">
    <div v-if="msgLst && msgLst.length > 0" class="msg_box">
      <div class="inner_box">
        <div class="page_box">
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
        <div>
          <div v-for="(item, index) in msgLst" :key="index" class="msg_item">
            <AdminMsg :msg="item.msg" :user-id="item.userId" :user="item.username" :time="item.time"></AdminMsg>
          </div>
        </div>
        <div class="page_box">
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
    <div v-else>
      <el-result icon="info" title="该用户暂时还没有留言哦" sub-title="请用户留言了再来看吧！">
        <template #extra>
          <el-button type="primary">到我的中心</el-button>
        </template>
      </el-result>
    </div>
  </div>
  <div v-else></div>
</template>

<style scoped lang="scss">
  .base_card {
    width: 70%;
  }

  .msg_box {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }

  .inner_box {
    width: 85%;
  }

  .page_box {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .msg_item {
    margin-bottom: 20px;
  }
</style>
