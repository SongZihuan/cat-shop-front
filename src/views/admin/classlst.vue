<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import {isAdmin} from "@/store/admin"
import {
  AdminClass,
  apiAdminGetClassLst,
  apiAdminPostChangeClassName,
  apiAdminPostChangeClassShow
} from "#/admin/class";

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

const maxcount = ref(0)
const page = ref(Number(route.query?.page).valueOf() || 1)
const pagesize = ref(20)
if (page.value < 1) {
  page.value = 1
}

const classLst = ref([] as AdminClass[])

const onChange = () => {
  apiAdminGetClassLst(page.value, pagesize.value).then((res) => {
    maxcount.value = res.data.data.maxcount
    classLst.value = res.data.data.list
  })
}
onChange()

const changeName = (classId: number, oldName: string) => {
  ElMessageBox.prompt(`新名字不能于旧名字（${oldName}）相同`, '请输入新名字', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
  }).then(({ value: newName }) => {
    console.log("newName", newName, typeof newName)
    if (!newName || newName.length === 0) {
      ElMessage({
        type: "error",
        message: "新名字不能为空",
      })
      return
    }

    if (newName == oldName) {
      ElMessage({
        type: "error",
        message: "新旧名字不能相同",
      })
      return
    }

    if (newName.length > 10) {
      ElMessage({
        type: "error",
        message: "新名字不能超过10个字符",
      })
      return
    }

    apiAdminPostChangeClassName(classId, newName).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: "修改成功",
        })
        onChange()
      } else {
        ElMessage({
          type: 'error',
          message: "修改失败",
        })
      }
    })
  })
}

const startShow = (classId: number, name: string) => {
  ElMessageBox.confirm(
      `是否开启商品分类 ${name} 的显示功能？`,
      '操作提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    apiAdminPostChangeClassShow(classId, true).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: "操作成功",
        })
        onChange()
      } else {
        ElMessage({
          type: 'error',
          message: "操作失败",
        })
      }
    })
  })
}

const stopShow = (classId: number, name: string) => {
  ElMessageBox.confirm(
      `是否关闭商品分类 ${name} 的显示功能？`,
      '操作提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    apiAdminPostChangeClassShow(classId, false).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: "操作成功",
        })
        onChange()
      } else {
        ElMessage({
          type: 'error',
          message: "操作失败",
        })
      }
    })
  })
}

</script>

<template>
  <div v-if="isAdmin()" style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <el-card style="display: flex; min-height: 70vh; width: 80vw; justify-content: center; margin-top: 10px">
      <el-table :data="classLst" style="width: 77vw" height="60vh">
        <el-table-column prop="id" label="商品分类ID" />
        <el-table-column prop="name" label="商品分类名称" />
        <el-table-column label="修改名称" >
          <template #default="{row}">
            <el-button type="primary" plain @click="changeName(row.id, row.name)">
              点击修改
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="显示" >
          <template #default="{row}">
            <el-button v-if="row.show" type="danger" plain @click="stopShow(row.id, row.name)">
              关闭显示
            </el-button>
            <el-button v-else type="success" plain @click="startShow(row.id, row.name)">
              开启显示
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; justify-content: center; margin-top: 10px;">
        <el-pagination v-model:current-page="page" class="pager" background layout="prev, pager, next" :page-size="pagesize" :total="maxcount || 0" @change="onChange" />
      </div>
    </el-card>
  </div>
  <div v-else></div>
</template>

<style scoped lang="scss">

</style>