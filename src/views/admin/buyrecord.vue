<script setup lang="ts">
import {apiAdminGetBuyRecordInfo, AdminBuyRecord as AdminBuyRecordData } from "#/admin/buyrecord"
import AdminBuyRecord from "@/components/admin/adminbuyrecord.vue"
import {isAdmin} from "@/store/admin"
import useAdminUserStore, {AdminUser} from "@/store/admin/user"
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

const recordId = ref(Number(route.query?.recordId).valueOf() || 0)
const record = ref(null as AdminBuyRecordData | null)

const onChangeUser = () => {
  userId.value = Number(route.query?.userId).valueOf() || 0
  user.value = null

  if (userId.value) {
    userAdminStore.getUser(userId.value).then((res) => {
      user.value = res as AdminUser
      onChangeRecord()
    }, () => {
      toBack()
    })
  } else {
    toBack()
  }
}

const onChangeRecord = () => {
  recordId.value = Number(route.query?.recordId).valueOf() || 0
  record.value = null

  if (recordId.value) {
    apiAdminGetBuyRecordInfo(recordId.value as number, userId.value || 0).then((res) => {
      record.value = res.data.data as AdminBuyRecordData
    }, () => {
      toBack()
    })
  } else {
    toBack()
  }
}

watch(() => route.query?.userId, onChangeUser)
watch(() => route.query?.recordId, onChangeUser)
onChangeUser()

const reload = () => {
  recordId.value && user.value && apiAdminGetBuyRecordInfo(recordId.value as number, userId.value as number).then((res) => {
    record.value = res.data.data as AdminBuyRecordData
  }).catch(() => {
    router.push({
      path: "/system/error",
      query: {
        msg: "获取数据失败"
      }
    })
  })
}

</script>

<template>
  <div v-if="user && record && isAdmin()" style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <div style="width: 80%;">
      <AdminBuyRecord :record="record" :safe="true" :xiangqing="false" :adminuser="true" @reload="reload"></AdminBuyRecord>
    </div>
  </div>
  <div v-else></div>
</template>

<style scoped lang="scss">

.wupin_name {
  display: inline-block;
  font-size: 1.5vw;
  font-weight: bold;
  margin-right: 5px;
  vertical-align: bottom;
  cursor: pointer;
}

.wupin_name:hover {
  text-decoration: underline;
}

.wupin_name:active {
  color: blue;
}

.wupin_tag {
  margin-top: 10px;
  margin-left: 5px;
}

.wupin_class_name {
  margin-top: 10px;
  display: inline-block;
  margin-left: 5px;
  font-size: 0.6vw;
}

.wupin_class_name_btn {
  margin-left: 1px;
  font-size: 0.6vw;
  vertical-align: bottom;
  cursor: pointer;
}

.wupin_class_name_btn:hover {
  text-decoration: underline;
}

.wupin_class_name_btn:active {
  color: blue;
}

</style>