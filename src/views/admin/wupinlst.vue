<script setup lang="ts">
import {isAdmin} from "@/store/admin"
import {AdminWupin, apiAdminGetWupinLst} from "#/admin/wupin"
import pushTo from "@/views/admin/router_push"
import { ElMessage } from "element-plus"

const route = useRoute()
const router = useRouter()

if (!isAdmin()) {
  router.push({
    path: "error",
    query: {
      msg: "页面错误"
    }
  })
}

const maxpage = ref(0)
const page = ref(Number(route.query?.page).valueOf() || 1)
const pagesize = ref(20)
if (page.value < 1) {
  page.value = 1
}

const wupinLst = ref([] as AdminWupin[])

const onChange = () => {
  apiAdminGetWupinLst(page.value, pagesize.value).then((res) => {
    maxpage.value = res.data.data.maxpage
    wupinLst.value = res.data.data.list
  })
}
onChange()

const showPic = ref(false)
const picUrl = ref("")

const openPic = (url: string) => {
  if (url.length === 0) {
    ElMessage({
      type: "error",
      message: "图片不存在",
    })
    return
  }

  picUrl.value = url
  showPic.value = true
}

const toClass = (classId: number) => {
  pushTo(router, route, "/admin/class/list/info", {
    classId: classId.toString(),
  })
}

const toInfo = (wupinId: number) => {
  pushTo(router, route, "/admin/wupin/list/info", {
    wupinId: wupinId.toString(),
  })
}

</script>

<template>
  <div v-if="isAdmin()" style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <el-card style="display: flex; min-height: 70vh; width: 80vw; justify-content: center; margin-top: 10px">
      <el-table :data="wupinLst" style="width: 77vw" height="60vh">
        <el-table-column prop="id" label="商品ID" />
        <el-table-column prop="name" label="商品名字" />
        <el-table-column label="图片" >
          <template #default="{ row }">
            <el-button size="small" plain type="success" :disabled="!row.pic" @click="openPic(row.pic)">
              点击查看图片
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="类别" >
          <template #default="{ row }">
            <div style="text-align: center">
              <div style="margin-bottom: 3px">
                <el-text>
                  {{ row.classOf.name }}
                </el-text>
              </div>
              <div>
                <el-button size="small" plain type="success" :disabled="!row.pic" @click="toClass(row.classOf.id)">
                  点击查看属性
                </el-button>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="tag" label="标签" />
        <el-table-column label="火爆价" >
          <template #default="{ row }">
            <span v-if="row.hotPrice >= 0">
              ￥{{ (row.hotPrice / 100).toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="真实价" >
          <template #default="{ row }">
            ￥{{ (row.realPrice / 100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="ren" label="联系人" />
        <el-table-column prop="phone" label="联系号码" />
        <el-table-column prop="email" label="联系邮箱" />
        <el-table-column prop="location" label="联系地址" />
        <el-table-column prop="wechat" label="联系微信" />
        <el-table-column prop="buytotal" label="购买统计" />
        <el-table-column prop="buygood" label="好评统计" />
        <el-table-column label="是否热门" >
          <template #default="{ row }">
            <span v-if="row.isHot"> 热门 </span>
            <span v-else> 非热门 </span>
          </template>
        </el-table-column>
        <el-table-column label="是否出售" >
          <template #default="{ row }">
            <span v-if="row.isShow"> 出售 </span>
            <span v-else> 不出售 </span>
          </template>
        </el-table-column>
        <el-table-column label="详情" >
          <template #default="{ row }">
            <el-button plain type="primary" size="small" @click="toInfo(row.id)"> 查看详情 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; justify-content: center; margin-top: 10px;">
        <el-pagination v-model:current-page="page" class="pager" background layout="prev, pager, next" :page-size="pagesize" :total="maxpage || 0" @change="onChange" />
      </div>
    </el-card>
  </div>
  <div v-else></div>

  <el-dialog
      v-model="showPic"
      style="height: 50vh; width: 20vw;"
      destroy-on-close
  >
    <div style="height: 35vh; width: 100%; display: flex; justify-content: center">
      <img alt="wechat" style="height: 100%; width: 100%; object-fit: contain;" :src="picUrl"/>
    </div>

    <template #footer>
      <div class="dialog-footer" style="height: 10vh">
        <el-button type="success" @click="showPic = false">
          关闭
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>