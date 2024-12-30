<script setup lang="ts">
import {isAdmin} from "@/store/admin"
import useAdminUserStore, {AdminUser} from "@/store/admin/user"
import {AdminMsg, apiAdminGetUserMsg} from "#/admin/msg"
import {formatDate} from "@/utils/time"
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
const msgLst = ref([] as AdminMsg[])

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
  <el-card v-if="user && isAdmin()" class="base_card">
    <div v-if="msgLst && msgLst.length > 0">
      <div style="display: flex; justify-content: center; margin-bottom: 10px;">
        <el-pagination v-model:current-page="page" class="pager" background layout="prev, pager, next" :page-size="pagesize" :total="maxcount || 0" @change="onChange" />
      </div>
      <div style="width: 55vw; display: flex; justify-content: center">
        <div style="width: 100%;">
          <div v-for="(item, index) in msgLst" :key="index" style="margin-left: 30px; margin-right: 30px">
            <el-card style="margin-bottom: 5px">
              <div style="width: 50vw; font-size: 0.8vw; font-weight: bold;">
                <el-text>
                  {{ item.msg }}
                </el-text>
              </div>
              <div style="width: 50vw; text-align: right">
                <el-text style="font-size: 0.5vw">
                  留言时间：{{ formatDate(item.time) }}
                </el-text>
              </div>
            </el-card>
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: center; margin-top: 10px;">
        <el-pagination v-model:current-page="page" class="pager" background layout="prev, pager, next" :page-size="pagesize" :total="maxcount || 0" @change="onChange" />
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

</style>