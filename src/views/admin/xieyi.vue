<script setup lang="ts">

import {isAdmin} from "@/store/admin"
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
  <div v-if="isAdmin()" style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <el-card v-if="xieyi" style="display: flex; min-height: 50vh; width: 50vw; justify-content: center; margin-top: 10px">
      <el-scrollbar height="48vh">
        <div id="info_box" class="info_box">
          <div v-html="xieyi"></div>
        </div>
      </el-scrollbar>
    </el-card>
    <el-result
        v-else
        icon="warning"
        title="暂无协议"
        sub-title="协议目前是空白的。"
    >
      <template #extra>
        <el-button type="primary" @click="toEdit">前往编辑</el-button>
      </template>
    </el-result>
  </div>
  <div v-else></div>
</template>
<style scoped lang="scss">
#info_box * {
  all: initial;
  width: 100%;
}
</style>