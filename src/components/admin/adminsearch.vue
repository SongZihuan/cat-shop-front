<script setup lang="ts">
  import { AdminClass, apiAdminGetClassLst } from '#/admin/class'
  import { Search as SearchIcon } from '@element-plus/icons-vue'
  import pushTo from '@/views/admin/router_push'

  const router = useRouter()
  const route = useRoute()

  const props = defineProps({
    type: {
      type: String,
      required: false
    },
    select: {
      type: Array<number>,
      required: false
    },
    search: {
      type: String,
      required: false
    }
  })

  const data = ref({
    select: [],
    search: ''
  } as { select?: number[]; search?: string })

  const infoController = (info?: any) => {
    if (!info) {
      return
    }

    data.value = JSON.parse(info as string) as { select?: number[]; search?: string }
  }

  infoController(route.query?.info)
  onBeforeRouteUpdate(infoController)

  const select = ref(0 as number)
  const search = ref(data.value.search || props.search || ('' as string))

  const classLst = ref([] as AdminClass[])
  const classLstPage = ref(1)
  const classLstMaxPage = ref(0)
  const classLstPagesize = ref(20)

  const onClassLstChange = () => {
    apiAdminGetClassLst(classLstPage.value, classLstPagesize.value).then((res) => {
      classLstMaxPage.value = res.data.data.maxcount
      classLst.value = [{ id: 0, name: '全部', show: false, down: false } as AdminClass].concat(res.data.data.list)
      if (select && !classLst.value.some((item) => item.id === select.value)) {
        select.value = 0
      }
    })
  }
  onClassLstChange()

  const onSearch = () => {
    pushTo(router, route, '/admin/wupin/list', {
      info: JSON.stringify({
        select: select.value,
        search: search.value
      })
    })
  }
</script>

<template>
  <div style="display: flex; justify-content: space-between; margin-top: 10px">
    <el-select
      v-model="select"
      placeholder="请选择商品分类"
      size="large"
      style="width: 20%; margin-right: 5px"
      :multiple="false"
      :clearable="true"
    >
      <el-option v-for="(item, j) in classLst" :key="j" :label="item.name" :value="item.id"> </el-option>
      <template #footer>
        <div style="display: flex; justify-content: center; margin-top: 10px">
          <el-pagination
            v-model:current-page="classLstPage"
            class="pager"
            background
            layout="prev, pager, next"
            :page-size="classLstPagesize"
            :total="classLstMaxPage || 0"
            @change="onClassLstChange"
          />
        </div>
      </template>
    </el-select>
    <el-input
      v-model="search"
      maxlength="120"
      placeholder="搜索感兴趣的内容吧"
      size="large"
      :clearable="true"
    ></el-input>
    <el-button size="large" :bg="true" type="success" style="margin-left: 5px" @click="onSearch">
      <el-icon style="margin-right: 3px"><SearchIcon /></el-icon> 立刻搜索
    </el-button>
  </div>
</template>

<style scoped lang="scss"></style>
