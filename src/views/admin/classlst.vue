<script setup lang="ts">
  import { isAdmin } from '@/store/admin'
  import { AdminClass, apiAdminGetClassLst } from '#/admin/class'
  import pushTo from '@/views/admin/router_push'
  import { RouteLocationNormalized } from 'vue-router'

  const route = useRoute()
  const router = useRouter()

  if (!isAdmin()) {
    router.push({
      path: '/system/error',
      query: {
        msg: '页面错误'
      }
    })
  }

  const maxcount = ref(0)
  const querypage = ref(Number(route.query?.page).valueOf() || 1)
  if (querypage.value < 1) {
    querypage.value = 1
  }
  const page = ref(querypage.value)
  const pagesize = ref(20)

  const classLst = ref([] as AdminClass[])

  const onChange = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
    let nowQueryPage = Number(to.query?.page).valueOf() || 1
    if (nowQueryPage < 1) {
      nowQueryPage = 1
    }

    if (nowQueryPage !== querypage.value) {
      querypage.value = nowQueryPage
      page.value = nowQueryPage
    }

    apiAdminGetClassLst(page.value, pagesize.value).then((res) => {
      maxcount.value = res.data.data.maxcount
      classLst.value = res.data.data.list
    })
    next()
  }
  onBeforeRouteUpdate(onChange)
  onChange(route, route, () => {})

  const onChangePage = () => {
    onChange(route, route, () => {})
  }

  const toInfo = (id: number) => {
    pushTo(router, route, '/admin/class/info', {
      classId: id
    })
  }
</script>

<template>
  <el-card v-if="isAdmin()" class="base_card admin_root_main_base_card">
    <el-table :data="classLst" style="width: 77vw" height="60vh">
      <el-table-column prop="id" label="商品分类ID" />
      <el-table-column prop="name" label="商品分类名称" />
      <el-table-column label="公开显示">
        <template #default="{ row }">
          <el-text> {{ row.show && !row.down ? '公开显示' : '不公开显示' }} </el-text>
        </template>
      </el-table-column>
      <el-table-column label="继续销售">
        <template #default="{ row }">
          <el-text> {{ row.down ? '该类别下商品不在销售' : '正常销售' }} </el-text>
        </template>
      </el-table-column>
      <el-table-column label="查看详情">
        <template #default="{ row }">
          <el-button plain type="primary" size="small" @click="toInfo(row.id)"> 查看详情 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: center; margin-top: 10px">
      <el-pagination
        v-model:current-page="page"
        class="pager"
        background
        layout="prev, pager, next"
        :page-size="pagesize"
        :total="maxcount || 0"
        @change="onChangePage"
      />
    </div>
  </el-card>
  <div v-else></div>
</template>

<style scoped lang="scss">
  .base_card {
    width: auto;
    max-width: 98%;
    min-width: 15vw;
  }
</style>
