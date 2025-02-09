<script setup lang="ts">
  import { apiAdminGetBuyRecordInfo, AdminBuyRecord as AdminBuyRecordData } from '#/admin/buyrecord'
  import AdminBuyRecord from '@/components/admin/adminbuyrecord.vue'
  import { isAdmin } from '@/store/admin'
  import useAdminUserStore, { AdminUser } from '@/store/admin/user'
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

  const userAdminStore = useAdminUserStore()

  const isall = computed(() => !!route.meta.recordisall)
  const userId = ref(Number(route.query?.userId).valueOf() || 0)
  const user = ref(null as AdminUser | null)
  const recordId = ref(Number(route.query?.recordId).valueOf() || 0)
  const record = ref(null as AdminBuyRecordData | null)

  const toBack = () => {
    if (isall.value) {
      pushTo(router, route, '/admin/buy/list')
    } else {
      pushTo(router, route, '/admin/user/list')
    }
  }

  const onChangeRecord = (to: RouteLocationNormalized) => {
    recordId.value = Number(to.query?.recordId).valueOf() || 0

    if (!isall.value && (!userId.value || !user.value || user.value.id !== userId.value)) {
      router.push({
        path: '/system/error',
        query: {
          msg: '页面错误'
        }
      })
    } else if (recordId.value) {
      apiAdminGetBuyRecordInfo(recordId.value as number, (user.value && user.value.id) || 0).then(
        (res) => {
          record.value = res.data.data as AdminBuyRecordData

          if (!isall.value && userId.value && record.value && userId.value !== record.value.userId) {
            router.push({
              path: '/system/error',
              query: {
                msg: '页面错误'
              }
            })
          }
        },
        () => {
          toBack()
        }
      )
    } else {
      toBack()
    }
  }

  const onChangeUser = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
    userId.value = Number(to.query?.userId).valueOf() || 0
    user.value = null
    record.value = null

    if (isall.value) {
      user.value = null
      onChangeRecord(to)
    } else if (userId.value) {
      userAdminStore.getUser(userId.value).then(
        (res) => {
          user.value = res as AdminUser
          onChangeRecord(to)
        },
        () => {
          user.value = null
          toBack()
        }
      )
    } else {
      toBack()
    }
    next()
  }

  onBeforeRouteUpdate(onChangeUser)
  onChangeUser(route, route, () => {})

  const reload = () => {
    recordId.value &&
      apiAdminGetBuyRecordInfo(recordId.value as number, userId.value as number).then((res) => {
        record.value = res.data.data as AdminBuyRecordData
      })
  }
</script>

<template>
  <div v-if="(isall || user) && record && record.wupin && isAdmin()" class="base_card admin_root_main_base_card">
    <AdminBuyRecord
      :zhifutishi="true"
      :record="record as AdminBuyRecordData"
      :safe="true"
      :xiangqing="false"
      @reload="reload"
    ></AdminBuyRecord>
  </div>
  <div v-else>
    <el-result icon="warning" title="此商品已下架" sub-title="欢迎到别处去看看吧"> </el-result>
  </div>
</template>

<style scoped lang="scss">
  .base_card {
    display: flex;
    justify-content: center;
    width: 60%;
    min-height: 0;
  }

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
