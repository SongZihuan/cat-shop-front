<script setup lang="ts">
  import pushTo from '@/views/admin/router_push'
  import {
    AdminClass,
    apiAdminGetClass,
    apiAdminPostChangeClassDown,
    apiAdminPostChangeClassName,
    apiAdminPostChangeClassShow
  } from '#/admin/class'
  import { ElMessage, ElMessageBox } from 'element-plus'

  const route = useRoute()
  const router = useRouter()

  const toBack = () => {
    pushTo(router, route, '/admin/class/list')
  }

  const classId = ref(Number(route.query?.classId).valueOf() || 0)
  const classObj = ref(null as AdminClass | null)

  const onChangeClass = () => {
    classId.value = Number(route.query?.classId).valueOf() || 0
    classObj.value = null

    if (classId.value && classId.value > 1) {
      apiAdminGetClass(classId.value).then(
        (res) => {
          classObj.value = res.data.data as AdminClass
        },
        () => {
          toBack()
        }
      )
    } else {
      toBack()
    }
  }

  watch(() => route.query?.wupinId, onChangeClass)
  onChangeClass()

  const changeName = () => {
    classObj.value &&
      ElMessageBox.prompt(`新名字不能于旧名字（${classObj.value.name}）相同`, '请输入新名字', {
        confirmButtonText: '提交',
        cancelButtonText: '取消'
      }).then(({ value: newName }) => {
        if (!classObj.value) {
          return
        }

        if (!newName || newName.length === 0) {
          ElMessage({
            type: 'error',
            message: '新名字不能为空'
          })
          return
        }

        if (newName == classObj.value.name) {
          ElMessage({
            type: 'error',
            message: '新旧名字不能相同'
          })
          return
        }

        if (newName.length > 10) {
          ElMessage({
            type: 'error',
            message: '新名字不能超过10个字符'
          })
          return
        }

        apiAdminPostChangeClassName(classObj.value.id, newName).then((res) => {
          if (res.data.data.success) {
            ElMessage({
              type: 'success',
              message: '修改成功'
            })
            onChangeClass()
          } else {
            ElMessage({
              type: 'error',
              message: '修改失败'
            })
          }
        })
      })
  }

  const startShow = () => {
    classObj.value &&
      ElMessageBox.confirm(`是否开启商品分类 ${classObj.value.name} 的显示功能？`, '操作提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        classObj.value &&
          apiAdminPostChangeClassShow(classObj.value.id, true).then((res) => {
            if (res.data.data.success) {
              ElMessage({
                type: 'success',
                message: '操作成功'
              })
              onChangeClass()
            } else {
              ElMessage({
                type: 'error',
                message: '操作失败'
              })
            }
          })
      })
  }

  const stopShow = () => {
    classObj.value &&
      ElMessageBox.confirm(`是否关闭商品分类 ${classObj.value.name} 的显示功能？`, '操作提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        classObj.value &&
          apiAdminPostChangeClassShow(classObj.value.id, false).then((res) => {
            if (res.data.data.success) {
              ElMessage({
                type: 'success',
                message: '操作成功'
              })
              onChangeClass()
            } else {
              ElMessage({
                type: 'error',
                message: '操作失败'
              })
            }
          })
      })
  }

  const upClass = () => {
    classObj.value &&
      ElMessageBox.confirm(`是确定商品分类 ${classObj.value.name} 上架。`, '操作提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        classObj.value &&
          apiAdminPostChangeClassDown(classObj.value.id, true).then((res) => {
            if (res.data.data.success) {
              ElMessage({
                type: 'success',
                message: '操作成功'
              })
              onChangeClass()
            } else {
              ElMessage({
                type: 'error',
                message: '操作失败'
              })
            }
          })
      })
  }

  const downClass = () => {
    classObj.value &&
      ElMessageBox.confirm(`是确定商品分类 ${classObj.value.name} 下架？`, '操作提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        classObj.value &&
          apiAdminPostChangeClassDown(classObj.value.id, false).then((res) => {
            if (res.data.data.success) {
              ElMessage({
                type: 'success',
                message: '操作成功'
              })
              onChangeClass()
            } else {
              ElMessage({
                type: 'error',
                message: '操作失败'
              })
            }
          })
      })
  }
</script>

<template>
  <el-card v-if="classObj" class="base_card admin_root_main_base_card">
    <template #header>
      <el-text style="font-size: 0.8vw"> 类别详情 </el-text>
    </template>
    <div style="margin: 10px 10px 10px 10px; display: flex; justify-content: center">
      <div>
        <div>
          <el-text class="default_text"> 类别ID：</el-text>
          <el-text class="default_text"> {{ classObj.id }} </el-text>
        </div>
        <div>
          <el-text class="default_text"> 类别名称：</el-text>
          <el-text class="default_text"> {{ classObj.name }} </el-text>
        </div>
        <div>
          <el-text class="default_text"> 是否展示：</el-text>
          <el-text v-if="classObj.show" class="default_text"> 展示 </el-text>
          <el-text v-else class="default_text"> 不展示 </el-text>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button-group>
        <el-button type="warning" plain size="large" @click="changeName"> 修改名字 </el-button>
        <el-button v-if="classObj.show" type="danger" plain size="large" @click="stopShow"> 取消显示 </el-button>
        <el-button v-else type="success" plain size="large" @click="startShow"> 打开显示 </el-button>
        <el-button v-if="!classObj.down" type="success" plain size="large" @click="downClass"> 下架商品 </el-button>
        <el-button v-else type="danger" plain size="large" @click="upClass"> 重新上架 </el-button>
      </el-button-group>
    </template>
  </el-card>
</template>

<style scoped lang="scss">
  .default_text {
    font-size: 0.6vw;
  }
</style>
