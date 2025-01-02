<script setup lang="ts">
  import { apiAdminGetBuyRecordInfo, AdminBuyRecord as AdminBuyRecordData } from '#/admin/buyrecord'
  import AdminBuyRecord from '@/components/admin/adminbuyrecord.vue'
  import { isAdmin } from '@/store/admin'
  import pushTo from '@/views/admin/router_push'

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

  const recordId = ref(Number(route.query?.recordId).valueOf() || 0)
  const record = ref(null as AdminBuyRecordData | null)

  const toBack = () => {
    pushTo(router, route, '/admin/user/list')
  }

  const onChangeRecord = () => {
    recordId.value = Number(route.query?.recordId).valueOf() || 0
    record.value = null

    if (recordId.value) {
      apiAdminGetBuyRecordInfo(recordId.value as number).then(
        (res) => {
          record.value = res.data.data as AdminBuyRecordData
        },
        () => {
          toBack()
        }
      )
    } else {
      toBack()
    }
  }

  watch(() => route.query?.recordId, onChangeRecord)
  onChangeRecord()

  const reload = () => {
    recordId.value &&
      apiAdminGetBuyRecordInfo(recordId.value as number)
        .then((res) => {
          record.value = res.data.data as AdminBuyRecordData
        })
        .catch(() => {
          router.push({
            path: '/system/error',
            query: {
              msg: '获取数据失败'
            }
          })
        })
  }
</script>

<template>
  <el-card v-if="record && isAdmin()" class="base_card admin_root_main_base_card">
    <div style="width: 80%">
      <AdminBuyRecord
        :record="record"
        :safe="true"
        :xiangqing="false"
        :adminuser="false"
        @reload="reload"
      ></AdminBuyRecord>
    </div>
  </el-card>
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
