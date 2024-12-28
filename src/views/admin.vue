<script setup lang="ts">
import useAdminUserStore from "@/store/admin/user"
import { AdminUser } from "@/store/admin/user"
import {isAdmin, isRootAdmin} from "@/store/admin"
import {AdminWupin, apiAdminGetWupin} from "#/admin/wupin"
import {AdminClass, apiAdminGetClass} from "#/admin/class"
import {AdminBuyRecord as AdminBuyRecordData, apiAdminGetBuyRecordInfo} from "#/admin/buyrecord"
import {MenuItemRegistered} from "element-plus"

const router = useRouter()
const route = useRoute()

if (!isAdmin()) {
  router.push({
    path: "error",
    query: {
      msg: "页面错误"
    }
  })
}

const active = ref("")
const pathPointer = "admin"
const basePath = "/" + pathPointer

const changePage = () => {
  if (!route.path.startsWith(basePath)) {
    router.push({
      path: "/system/error",
      query: {
        msg: "页面错误"
      }
    })
  }

  const routePath = (route.meta.vpath || route.path || "/") as string
  const pathLst = routePath.split("/")
  if (pathLst.length < 2 || pathLst[0] !== "" || pathLst[1] !== pathPointer) {
    router.push({
      path: "/system/error",
      query: {
        msg: "页面错误"
      }
    })
  }

  active.value = routePath.slice(routePath.length, routePath.length)
}

watch(() => route.path, changePage)
changePage()

const userAdminStore = useAdminUserStore()

const userId = ref(0)
const user = ref(null as AdminUser | null)
const userPermissions = ref(false)

const onChangeUser = () => {
  userId.value = Number(route.query?.userId).valueOf() || 0
  user.value = null
  userPermissions.value = false

  if (userId.value) {
    userAdminStore.getUser(userId.value).then((res) => {
      user.value = res as AdminUser

      if (user.value.type === 3 && !isRootAdmin()) {
        userPermissions.value = false
      } else {
        userPermissions.value = true
      }

      if (user.value.status === 3 && !isRootAdmin()) {
        user.value = null
        userPermissions.value = false
      }
    }, () => {
      user.value = null
      userPermissions.value = false
    })
  } else {
    user.value = null
    userPermissions.value = false
  }
}

watch(() => route.query?.userId, onChangeUser)
onChangeUser()

const wupinId = ref(0)
const wupin = ref(null as AdminWupin | null)

const onChangeWupin = () => {
  wupinId.value = Number(route.query?.wupinId).valueOf() || 0
  wupin.value = null

  if (wupinId.value) {
    apiAdminGetWupin(wupinId.value).then((res) => {
      wupin.value = res.data.data as AdminWupin
    }, () => {
      wupin.value = null
    })
  } else {
    wupin.value = null
  }
}

watch(() => route.query?.wupinId, onChangeWupin)
onChangeWupin()

const classId = ref(Number(route.query?.classId).valueOf() || 0)
const classObj = ref(null as AdminClass | null)

const onChangeClass = () => {
  classId.value = Number(route.query?.classId).valueOf() || 0
  classObj.value = null

  if (classId.value) {
    apiAdminGetClass(classId.value).then((res) => {
      classObj.value = res.data.data as AdminClass
    }, () => {
      classObj.value = null
    })
  } else {
    classObj.value = null
  }
}

watch(() => route.query?.classId, onChangeClass)
onChangeClass()

const recordId = ref(Number(route.query?.recordId).valueOf() || 0)
const record = ref(null as AdminBuyRecordData | null)

const onChangeRecord = () => {
  recordId.value = Number(route.query?.recordId).valueOf() || 0
  record.value = null

  if (recordId.value) {
    apiAdminGetBuyRecordInfo(recordId.value as number).then((res) => {
      record.value = res.data.data as AdminBuyRecordData
    }, () => {
      record.value = null
    })
  } else {
    record.value = null
  }
}

watch(() => route.query?.recordId, onChangeRecord)
onChangeRecord()

const defaultOpeneds = ref([
  "user", "user/buy", "user/nuy/wupin", "user/edit",
  "user/bag", "user/other",
  "class", "wupin", "buyrecord",
  "xieyi", "bconfig",
  "config", "config/list", "config/httpserver"
])

const onClick = (event: MenuItemRegistered) => {
  const path = basePath + "/" + (event.index || "admin/user/list")
  router.push({
    path: path,
  })
}

console.log("GGBond")

</script>

<template>
  <el-container v-if="isAdmin()">
    <el-aside style=" width: 12vw; height: 85vh; border-radius: 15px">
      <el-scrollbar height="100%" style="width: 100%">
        <el-menu
            :default-active="active"
            :default-openeds='defaultOpeneds'
        >
          <el-sub-menu index="user">
            <template #title>
              用户管理
            </template>
            <el-menu-item index="user/list" @click="onClick">用户列表</el-menu-item>
            <el-menu-item index="user/info" :disabled="!user" @click="onClick">用户详情</el-menu-item>
            <el-sub-menu index="user/edit">
              <template #title>
                编辑用户
              </template>
              <el-menu-item index="user/edit/info" :disabled="!user || !userPermissions" @click="onClick">编辑用户</el-menu-item>
              <el-menu-item index="user/edit/password" :disabled="!user || !isRootAdmin() || !userPermissions" @click="onClick">编辑用户密码</el-menu-item>
              <el-menu-item index="user/edit/phone" :disabled="!user || !isRootAdmin() || !userPermissions" @click="onClick">编辑用户手机号</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="user/msg" :disabled="!user" @click="onClick">用户留言</el-menu-item>

            <el-sub-menu index="user/buy">
              <template #title>
                用户订单
              </template>
              <el-menu-item index="user/buy/list" :disabled="!user" @click="onClick">用户订单列表</el-menu-item>
              <el-menu-item index="user/buy/info" :disabled="!user || !recordId" @click="onClick">用户订单详情</el-menu-item>

              <el-sub-menu index="user/buy/wupin">
                <template #title>
                  商品
                </template>
                <el-menu-item index="user/buy/wupin/sale" :disabled="!user || !record" @click="onClick">用户订单商品详情</el-menu-item>
                <el-menu-item index="user/buy/wupin/lock" :disabled="!user || !record" @click="onClick">用户订单商品详情存档页面</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
          </el-sub-menu>

          <el-sub-menu index="user/bag">
            <template #title>
              购物车
            </template>
            <el-menu-item index="user/bag/list" :disabled="!user" @click="onClick">用户购物车列表</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="user/other">
            <template #title>
              其他操作
            </template>
            <el-menu-item index="user/other/add" @click="onClick">添加用户</el-menu-item>
            <el-menu-item index="user/other/msg" @click="onClick">用户留言列表</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="class">
            <template #title>
              <el-text>商品分类管理</el-text>
            </template>
            <el-menu-item index="class/list" @click="onClick">商品分类列表</el-menu-item>
            <el-menu-item index="class/info" :disabled="!classObj" @click="onClick">商品分类详情</el-menu-item>
            <el-menu-item index="class/edit" :disabled="!classObj" @click="onClick">商品分类编辑</el-menu-item>
            <el-menu-item index="class/add" @click="onClick">添加商品分类</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="wupin">
            <template #title>
              <el-text>商品管理</el-text>
            </template>
            <el-menu-item index="wupin/list" @click="onClick">商品列表</el-menu-item>
            <el-menu-item index="wupin/info" :disabled="!wupin" @click="onClick">商品详情</el-menu-item>
            <el-menu-item index="wupin/edit" :disabled="!wupin" @click="onClick">商品编辑</el-menu-item>
            <el-menu-item index="wupin/add" @click="onClick">添加商品</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="buyrecord">
            <template #title>
              <el-text>订单管理</el-text>
            </template>
            <el-menu-item index="buyrecord/list" @click="onClick">订单列表</el-menu-item>
            <el-menu-item index="buyrecord/info" :disabled="!record" @click="onClick">订单详情</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="xieyi">
            <template #title>
              <el-text>用户协议</el-text>
            </template>
            <el-menu-item index="xieyi/show" :disabled="!isRootAdmin()" @click="onClick">查看用户协议</el-menu-item>
            <el-menu-item index="xieyi/edit" :disabled="!isRootAdmin()" @click="onClick">编辑用户协议</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="config">
            <template #title>
              <el-text>系统配置</el-text>
            </template>

            <el-sub-menu index="config/list">
              <template #title>
                <el-text>系统配置管理</el-text>
              </template>
              <el-menu-item index="config/list" :disabled="!isRootAdmin()" @click="onClick">注册表</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="config/httpserver">
              <template #title>
                <el-text>后端Http服务管理</el-text>
              </template>
              <el-menu-item index="config/httpserver/stop" :disabled="!isRootAdmin()" @click="onClick">关闭</el-menu-item>
              <el-menu-item index="config/httpserver/restart" :disabled="!isRootAdmin()" @click="onClick">重启</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>

        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
  <div v-else></div>
</template>

<style scoped lang="scss">

</style>