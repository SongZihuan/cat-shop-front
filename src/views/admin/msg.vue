<script setup lang="ts">
import {isAdmin} from "@/store/admin"
import {AdminMsg, apiAdminGetMsg} from "#/admin/msg"
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

const maxcount = ref(0)
const page = ref(Number(route.query?.page).valueOf() || 1)
const pagesize = ref(20)
if (page.value < 1) {
  page.value = 1
}
const msgLst = ref([] as AdminMsg[])

const onChange = () => {
  apiAdminGetMsg(page.value, pagesize.value).then((res) => {
    maxcount.value = res.data.data.maxcount
    msgLst.value = res.data.data.list
  })
}
onChange()

const toUser = (userId: number) => {
  userId && pushTo(router, route, "/admin/user/info", {
    userId: userId,
  })
}

const toBack = () => {
  pushTo(router, route, "/admin/user/list")
}

</script>

<template>
  <div v-if="isAdmin()" style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <el-card style="display: flex; height: 70vh; width: 60vw; justify-content: center; margin-top: 10px">
      <div v-if="msgLst && msgLst.length > 0">
        <el-scrollbar height="60vh">
          <div style="display: flex; justify-content: center; margin-bottom: 10px;">
            <el-pagination v-model:current-page="page" class="pager" background layout="prev, pager, next" :page-size="pagesize" :total="maxcount || 0" @change="onChange" />
          </div>
          <div style="width: 55vw; display: flex; justify-content: center">
            <div style="width: 100%;">
              <el-scrollbar>
                <div v-for="(item, index) in msgLst" :key="index" style="margin-left: 30px; margin-right: 30px">
                  <el-card style="margin-bottom: 5px">
                    <div style="width: 50vw; font-size: 0.8vw; font-weight: bold;">
                      <el-text>
                        {{ item.msg }}
                      </el-text>
                    </div>
                    <div style="width: 50vw; text-align: right">
                      <div>
                        <el-text style="font-size: 0.5vw">
                          留言时间：{{ formatDate(item.time) }}
                        </el-text>
                      </div>
                      <div>
                        <el-button @click="toUser(item.userid)">
                          查看用户详情
                        </el-button>
                      </div>
                    </div>
                  </el-card>
                </div>
              </el-scrollbar>
            </div>
          </div>
          <div style="display: flex; justify-content: center; margin-top: 10px;">
            <el-pagination v-model:current-page="page" class="pager" background layout="prev, pager, next" :page-size="pagesize" :total="maxcount || 0" @change="onChange" />
          </div>
        </el-scrollbar>
      </div>
      <div v-else>
        <el-result
            icon="info"
            title="该用户暂时还没有留言哦"
            sub-title="请用户留言了再来看吧！"
        >
          <template #extra>
            <el-button type="primary" @click="toBack">到我的中心</el-button>
          </template>
        </el-result>
      </div>
    </el-card>
  </div>
  <div v-else></div>
</template>

<style scoped lang="scss">

</style>