<script setup lang="ts">
  import { isAdmin } from '@/store/admin'
  import { AdminWupin, apiAdminGetWupinLst } from '#/admin/wupin'
  import { getFacePrice, getRealPrice } from '@/utils/price'
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

  const wupinlst = ref([] as AdminWupin[])
  const maxcount = ref(0)
  const querypage = ref(Number(route.query?.page).valueOf() || 1)
  if (querypage.value < 1) {
    querypage.value = 1
  }
  const page = ref(querypage.value)
  const pagesize = ref(20)

  const onChange = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
    let nowQueryPage = Number(to.query?.page).valueOf() || 1
    if (nowQueryPage < 1) {
      nowQueryPage = 1
    }

    if (nowQueryPage !== querypage.value) {
      querypage.value = nowQueryPage
      page.value = nowQueryPage
    }

    apiAdminGetWupinLst(page.value, pagesize.value).then((res) => {
      wupinlst.value = res.data.data.list
      maxcount.value = res.data.data.maxcount
    })
    next()
  }
  onBeforeRouteUpdate(onChange)
  onChange(route, route, () => {})

  const toInfo = (id: number) => {
    pushTo(router, route, '/admin/wupin/info', {
      wupinId: id
    })
  }

  const toClass = (id: number) => {
    pushTo(router, route, '/admin/class/info', {
      classId: id
    })
  }

  const onChangePage = () => {
    onChange(route, route, () => {})
  }

  const picUrl = ref('')
  const showPic = (pic: string) => {
    picUrl.value = pic
  }
</script>

<template>
  <el-card v-if="isAdmin()" class="base_card admin_root_main_base_card">
    <el-table :data="wupinlst" style="width: 100%" height="100%" :scrollbar-tabindex="3">
      <el-table-column prop="id" label="商品ID" />
      <el-table-column prop="name" label="商品名称" />
      <el-table-column label="商品类型">
        <template #default="{ row }">
          <el-button
            v-if="row.classId !== 0 && row.classId !== 1 && row.classOf && row.classOf.id === row.classId"
            size="small"
            type="info"
            text
            @click="toClass(row.classId)"
          >
            {{ row.classOf.name }}
          </el-button>
          <el-button v-else disabled size="small" type="info" text> 商品暂无分类 </el-button>
        </template>
      </el-table-column>
      <el-table-column label="查看商品图片">
        <template #default="{ row }">
          <el-button :disabled="!row.pic" size="small" type="success" plain @click="showPic(row.pic)">
            点击查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="商品标签">
        <template #default="{ row }">
          {{ row.tag || '' }}
        </template>
      </el-table-column>
      <el-table-column label="售卖价格">
        <template #default="{ row }">
          {{ '￥' + (getFacePrice(row?.hotPrice, row.realPrice) / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="实际价格">
        <template #default="{ row }">
          {{ '￥' + (getRealPrice(row.realPrice) / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="热销价格（后台）">
        <template #default="{ row }">
          {{ row.hotPrice && row.hotPrice >= 0 ? '￥' + (row.hotPrice / 100).toFixed(2) : '' }}
        </template>
      </el-table-column>
      <el-table-column label="实际价格（后台）">
        <template #default="{ row }">
          {{ row.realPrice >= 0 ? '￥' + (row.realPrice / 100).toFixed(2) : '￥0.00' }}
        </template>
      </el-table-column>
      <el-table-column label="详情">
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
  <Showimg v-model="picUrl"></Showimg>
</template>

<style scoped lang="scss"></style>
