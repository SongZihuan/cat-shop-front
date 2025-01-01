<script setup lang="ts">
import {isAdmin} from "@/store/admin"
import useAdminUserStore, {AdminUser} from "@/store/admin/user"
import {AdminMsg as AdminMsgType, apiAdminGetUserMsg} from "#/admin/msg"
import AdminMsg from "@/components/admin/adminmsg.vue"
import pushTo from "@/views/admin/router_push"

const router = useRouter()
const route = useRoute()

if (!isAdmin()) {
  router.push({
    path: "/system/error",
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

const maxcount = ref(0)
const page = ref(Number(route.query?.page).valueOf() || 1)
const pagesize = ref(20)
if (page.value < 1) {
  page.value = 1
}
const msgLst = ref([] as AdminMsgType[])

const onChangeUser = () => {
  userId.value = Number(route.query?.userId).valueOf() || 0
  user.value = null

  if (userId.value) {
    userAdminStore.getUser(userId.value).then((res) => {
      user.value = res as AdminUser
      onChange()
    }, () => {
      toBack()
    })
  } else {
    toBack()
  }
}

watch(() => route.query?.userId, onChangeUser)
onChangeUser()

const onChange = () => {
  user.value && apiAdminGetUserMsg(userId.value, page.value, pagesize.value).then((res) => {
    maxcount.value = res.data.data.maxcount
    msgLst.value = res.data.data.list
  })
}

</script>

<template>
  <el-card v-if="user && isAdmin()" class="base_card admin_root_main_base_card">
    <div v-if="msgLst && msgLst.length > 0" class="msg_box">
      <div class="inner_box">
        <div class="page_box">
          <el-pagination v-model:current-page="page" class="pager" background layout="prev, pager, next" :page-size="pagesize" :total="maxcount || 0" @change="onChange" />
        </div>
        <div>
          <div v-for="(item, index) in msgLst" :key="index" class="msg_item">
            <AdminMsg :msg="item.msg" :user-id="item.userId" :user="item.username" :time="item.time"></AdminMsg>
          </div>
        </div>
        <div class="page_box">
          <el-pagination v-model:current-page="page" class="pager" background layout="prev, pager, next" :page-size="pagesize" :total="maxcount || 0" @change="onChange" />
        </div>
      </div>
    </div>
    <div v-else>
      <el-result
          icon="info"
          title="该用户暂时还没有留言哦"
          sub-title="请用户留言了再来看吧！"
      >
        <template #extra>
          <el-button type="primary">到我的中心</el-button>
        </template>
      </el-result>
    </div>
  </el-card>
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