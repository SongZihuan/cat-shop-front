<script setup lang="ts">
  import {Search as SearchIcon} from '@element-plus/icons-vue'
  import {apiGetClass, Class, AllClass, apiGetClassLstByPage} from "#/center/class";

  const router = useRouter()
  const route = useRoute()

  const props = defineProps({
    "select": {
      type: Number,
      required: false,
    },
    "search": {
      type: String,
      required: false,
    },
  })

  const data = ref({
        select: props.search,
        search: props.select,
  } as { select?: number | undefined, search?: string })

  const infoController = (info?: any) => {
    if (!info) {
      return
    }

    data.value = JSON.parse(info as string) as { select?: number, search?: string }
    getSelectClass()
  }

  const getSelectClass = () => {
    if (!data.value || !data.value.select || !classLst.value) {
      data.value.select = undefined
      return
    }

    if (classLst.value.every((item) => item.id !== data.value.select)) {
      if (data.value.select === 1) {
        classLst.value = [AllClass].concat(classLst.value)
        return
      }

      apiGetClass(data.value.select).then((res)=>{
        if (res.data.data.hasfound) {
          classLst.value.push(res.data.data.class)
        } else {
          data.value.select = undefined
        }
      })
    }
  }

  onMounted(() => {
    infoController(route.query?.info)

    if (!data.value.search) {
      data.value.search = props.search
    }

    if (!data.value.search) {
      data.value.select = props.select
    }

    watch(() => route.query?.info, infoController)
  })

  const classLst = ref([] as Class[])
  const classLstPage = ref(1)
  const classLstMaxPage = ref(0)
  const classLstPagesize = ref(20)

  const onClassLstChange = () => {
    apiGetClassLstByPage(classLstPage.value, classLstPagesize.value).then((res) => {
      classLstMaxPage.value = res.data.data.maxcount
      classLst.value = [AllClass].concat(res.data.data.list)

      getSelectClass()
    })
  }
  onClassLstChange()

  const onSearch = () => {
    router.push({
      path: "/shop/search",
      query: {
        "info": JSON.stringify({
          select: data.value.select || 0,
          search: data.value.search || "",
        })
      }
    })
  }

</script>

<template>
  <div style="display: flex; justify-content: space-between; margin-top: 10px">
    <el-select
        v-model="data.select"
        placeholder="请选择商品分类"
        size="large"
        style="width: 20%; margin-right: 5px"
        :multiple="false"
        :clearable="true"
    >
      <el-option
          v-for="(item, j) in classLst"
          :key="j"
          :label="item.name"
          :value="item.id"
      >
      </el-option>
      <template #footer>
        <div style="display: flex; justify-content: center; margin-top: 10px;">
          <el-pagination v-model:current-page="classLstPage" class="pager" background layout="prev, pager, next" :page-size="classLstPagesize" :total="classLstMaxPage || 0" @change="onClassLstChange" />
        </div>
      </template>
    </el-select>
    <el-input v-model="data.search" maxlength="120" placeholder="搜索感兴趣的内容吧" size="large" :clearable="true"></el-input>
    <el-button size="large" :bg="true" type="success" style="margin-left: 5px" @click="onSearch"> <el-icon style="margin-right: 3px"><SearchIcon /></el-icon> 立刻搜索 </el-button>
  </div>
</template>

<style scoped lang="scss">
</style>