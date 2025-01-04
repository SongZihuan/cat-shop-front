<script setup lang="ts">
  import BaseBack from '@/_back.vue'
  import useAdminUserStore from '@/store/admin/user'
  import { AdminUser } from '@/store/admin/user'
  import { isAdmin, isRootAdmin } from '@/store/admin'
  import { AdminWupin, apiAdminGetWupin } from '#/admin/wupin'
  import { AdminClass, apiAdminGetClass } from '#/admin/class'
  import { AdminBuyRecord as AdminBuyRecordData, apiAdminGetBuyRecordInfo } from '#/admin/buyrecord'
  import { MenuItemRegistered } from 'element-plus'
  import pushTo from '@/views/admin/router_push'
  import useUserStore, { UserTypeList } from '@/store/user'

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

  const pathPointer = 'admin'
  const basePath = '/' + pathPointer + '/'

  const active = computed(() => {
    if (!route.path.startsWith(basePath)) {
      router.push({
        path: '/system/error',
        query: {
          msg: '页面错误'
        }
      })
      return '/user/list'
    }

    const routePath = (route.meta.vpath || route.path || '/') as string
    const pathLst = routePath.split('/')
    if (pathLst.length < 2 || pathLst[0] !== '' || pathLst[1] !== pathPointer) {
      router.push({
        path: '/system/error',
        query: {
          msg: '页面错误'
        }
      })
      return '/user/list'
    }

    return routePath.slice(basePath.length, routePath.length)
  })

  const userAdminStore = useAdminUserStore()
  const userStore = useUserStore()

  const userId = ref(0)
  const user = ref(null as AdminUser | null)
  const userPermissions = ref(false)

  const onChangeUser = () => {
    userId.value = Number(route.query?.userId).valueOf() || 0
    user.value = null
    userPermissions.value = false

    console.log('userId.value', userId.value, route.query)
    if (userId.value) {
      userAdminStore
        .getUser(userId.value)
        .then(
          (res) => {
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
          },
          () => {
            user.value = null
            userPermissions.value = false
          }
        )
        .finally(() => {
          console.log('user.value', user.value)
        })
    } else {
      user.value = null
      userPermissions.value = false
    }
  }

  const wupinId = ref(0)
  const wupin = ref(null as AdminWupin | null)

  const onChangeWupin = () => {
    wupinId.value = Number(route.query?.wupinId).valueOf() || 0
    wupin.value = null

    if (wupinId.value) {
      apiAdminGetWupin(wupinId.value).then(
        (res) => {
          wupin.value = res.data.data as AdminWupin
          console.log('get', wupin.value)
        },
        () => {
          wupin.value = null
        }
      )
    } else {
      wupin.value = null
    }
  }

  const classId = ref(Number(route.query?.classId).valueOf() || 0)
  const classObj = ref(null as AdminClass | null)

  const onChangeClass = () => {
    classId.value = Number(route.query?.classId).valueOf() || 0
    classObj.value = null

    if (classId.value) {
      apiAdminGetClass(classId.value).then(
        (res) => {
          classObj.value = res.data.data as AdminClass
        },
        () => {
          classObj.value = null
        }
      )
    } else {
      classObj.value = null
    }
  }

  const recordId = ref(Number(route.query?.recordId).valueOf() || 0)
  const record = ref(null as AdminBuyRecordData | null)

  const onChangeRecord = () => {
    recordId.value = Number(route.query?.recordId).valueOf() || 0
    record.value = null

    if (recordId.value) {
      apiAdminGetBuyRecordInfo(recordId.value as number).then(
        (res) => {
          record.value = res.data.data as AdminBuyRecordData
        },
        () => {
          record.value = null
        }
      )
    } else {
      record.value = null
    }
  }

  watch(
    () => route.query,
    () => {
      onChangeUser()
      onChangeClass()
      onChangeWupin()
      onChangeRecord()
    }
  )
  onChangeUser()
  onChangeClass()
  onChangeWupin()
  onChangeRecord()

  const defaultOpeneds = ref([
    'user',
    'user/buy',
    'user/buy/wupin',
    'user/edit',
    'user/bag',
    'user/other',
    'class',
    'wupin',
    'buy',
    'buy/wupin',
    'xieyi',
    'bconfig',
    'config',
    'config/list',
    'config/httpserver'
  ])

  const onClick = (event: MenuItemRegistered) => {
    pushTo(router, route, basePath + (event.index || 'user/list'))
  }

  const userNaame = computed(() => userStore?.user?.name || '未知用户')
  const userPhone = computed(() => userStore?.user?.phone || '000-0000-0000')
  const userType = computed(() => userStore?.user?.type || 1)
  const userTypeName = computed(() => UserTypeList?.[userType.value] || '普通用户')

  const waterMarkFont = reactive({
    color: 'rgba(0, 0, 0, 0.20)',
    fontSize: 20
  })

  const waterMarkContent = ref(computed(() => [userNaame.value, userPhone.value, userTypeName.value]))

  const waterMarkGap = ref([120, 150] as [number, number])
</script>

<template>
  <BaseBack v-if="isAdmin()">
    <div class="base">
      <div class="menu">
        <el-scrollbar class="menu_scroll" :tabindex="2">
          <div class="menu_box">
            <el-menu :default-active="active" :default-openeds="defaultOpeneds">
              <el-sub-menu index="user">
                <template #title> 用户管理 </template>
                <el-menu-item index="user/list" @click="onClick">用户列表</el-menu-item>
                <el-menu-item index="user/info" :disabled="!user" @click="onClick">用户详情</el-menu-item>
                <el-sub-menu index="user/edit">
                  <template #title> 编辑用户 </template>
                  <el-menu-item index="user/edit/info" :disabled="!user || !userPermissions" @click="onClick"
                    >编辑用户</el-menu-item
                  >
                  <el-menu-item
                    index="user/edit/password"
                    :disabled="!user || !isRootAdmin() || !userPermissions"
                    @click="onClick"
                    >编辑用户密码</el-menu-item
                  >
                  <el-menu-item
                    index="user/edit/phone"
                    :disabled="!user || !isRootAdmin() || !userPermissions"
                    @click="onClick"
                    >编辑用户手机号</el-menu-item
                  >
                </el-sub-menu>
                <el-menu-item index="user/msg" :disabled="!user" @click="onClick">用户留言</el-menu-item>

                <el-sub-menu index="user/buy">
                  <template #title> 用户订单 </template>
                  <el-menu-item index="user/buy/list" :disabled="!user" @click="onClick">用户购物记录</el-menu-item>
                  <el-menu-item index="user/buy/info" :disabled="!user || !recordId" @click="onClick"
                    >用户订单详情</el-menu-item
                  >

                  <el-sub-menu index="user/buy/wupin">
                    <template #title> 用户订单商品详情 </template>
                    <el-menu-item index="user/buy/wupin/sale" :disabled="!user || !record" @click="onClick"
                      >用户订单商品售卖详情</el-menu-item
                    >
                    <el-menu-item index="user/buy/wupin/lock" :disabled="!user || !record" @click="onClick"
                      >用户订单商品详情存档</el-menu-item
                    >
                  </el-sub-menu>
                </el-sub-menu>

                <el-sub-menu index="user/bag">
                  <template #title> 用户购物车 </template>
                  <el-menu-item index="user/bag/list" :disabled="!user" @click="onClick">用户购物车列表</el-menu-item>
                </el-sub-menu>

                <el-sub-menu index="user/other">
                  <template #title> 其他操作 </template>
                  <el-menu-item index="user/other/add" @click="onClick">添加用户</el-menu-item>
                  <el-menu-item index="user/other/msg" @click="onClick">用户留言列表</el-menu-item>
                </el-sub-menu>
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

              <el-sub-menu index="buy">
                <template #title>
                  <el-text>订单管理</el-text>
                </template>
                <el-menu-item index="buy/list" @click="onClick">订单列表</el-menu-item>
                <el-menu-item index="buy/info" :disabled="!record" @click="onClick">订单详情</el-menu-item>

                <el-sub-menu index="buy/wupin">
                  <template #title> 订单商品详情 </template>
                  <el-menu-item index="buy/wupin/sale" :disabled="!record" @click="onClick"
                    >订单商品售卖详情</el-menu-item
                  >
                  <el-menu-item index="buy/wupin/lock" :disabled="!record" @click="onClick"
                    >订单商品详情存档</el-menu-item
                  >
                </el-sub-menu>
              </el-sub-menu>

              <el-sub-menu index="xieyi">
                <template #title>
                  <el-text>用户协议</el-text>
                </template>
                <el-menu-item index="xieyi/show" @click="onClick">查看用户协议</el-menu-item>
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
                    <el-text>后端服务管理</el-text>
                  </template>
                  <el-menu-item index="config/httpserver/stop" :disabled="!isRootAdmin()" @click="onClick"
                    >关闭服务</el-menu-item
                  >
                  <el-menu-item index="config/httpserver/restart" :disabled="!isRootAdmin()" @click="onClick"
                    >重启服务</el-menu-item
                  >
                </el-sub-menu>
              </el-sub-menu>
            </el-menu>
          </div>
        </el-scrollbar>
      </div>
      <div class="main">
        <div class="main_middle">
          <el-watermark
            :font="waterMarkFont"
            :content="waterMarkContent"
            :rotate="-22"
            :gap="waterMarkGap"
            class="inner_box"
          >
            <div class="inner_child">
              <el-scrollbar class="main_scroll">
                <div class="center_class">
                  <router-view />
                </div>
              </el-scrollbar>
            </div>
          </el-watermark>
        </div>
      </div>
    </div>
  </BaseBack>
  <div v-else></div>
</template>

<style lang="scss">
  .admin_root_main_base_card {
    --card-height: calc(#{var(--custom-height)} * 0.9);
    --card-width: calc(#{var(--custom-body-width)} * 0.9);

    width: #{var(--card-width)};

    margin: 1%;
  }
</style>

<style scoped lang="scss">
  .menu {
    --menu-outside-width: #{var(--custom-menu-width)};
    --menu-outside-height: #{var(--custom-height)};
  }

  .main {
    --main-outside-width: #{var(--custom-body-width)};
    --main-outside-height: #{var(--custom-height)};
  }

  .base {
    display: flow-root;
    height: #{var(--base-height)};
    width: #{var(--base-width)};
  }

  .menu {
    float: left;
    border-radius: 15px;

    height: #{var(--menu-outside-height)};
    width: #{var(--menu-outside-width)};
  }

  .menu_box {
    width: calc(100% - 5px);
    margin-right: 5px;
  }

  .menu_scroll {
    height: #{var(--menu-outside-height)};
    width: #{var(--menu-outside-width)};
  }

  .main {
    float: right;
    height: #{var(--main-outside-height)};
    width: #{var(--main-outside-width)};
  }

  .main_middle {
    display: flex;
    justify-content: center;
    align-items: center;
    height: #{var(--main-outside-height)};
    width: #{var(--main-outside-width)};
  }

  .inner_box {
    display: flex;
    justify-content: center;

    height: #{var(--main-outside-height)};
    width: #{var(--main-outside-width)};
  }

  .inner_child {
    display: flex;
    justify-content: center;

    height: 100%;
    width: 100%;
  }

  .main_scroll {
    height: 100%;
    width: 100%;
  }

  .center_class {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    min-height: #{var(--main-outside-height)};
  }
</style>
