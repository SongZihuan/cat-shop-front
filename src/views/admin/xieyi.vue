<script setup lang="ts">

import {isAdmin, isRootAdmin} from "@/store/admin"
import {apiAdminGetXieyi} from "#/admin/xieyi"
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

const xieyi = ref("")

const getXieyi = () => {
  apiAdminGetXieyi().then((res) => {
    xieyi.value = res.data.data.xieyi
  })
}
getXieyi()

const toEdit = () => {
  pushTo(router, route, "/admin/xieyi/edit")
}

</script>

<template>
  <el-card v-if="isAdmin()" class="base_card">
    <div id="info_box" class="info_box">
      <div v-html="xieyi"></div>
    </div>
    <template #footer>
      <el-button v-if="isRootAdmin()" @click="toEdit"> 去编辑 </el-button>
    </template>
  </el-card>
  <div v-else></div>
</template>
<style scoped lang="scss">
#info_box * {
  all: initial;
  width: 100%;
}
</style>