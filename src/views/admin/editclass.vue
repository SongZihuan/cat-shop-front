<script setup lang="ts">
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { isAdmin } from '@/store/admin'
  import { AdminClass, AdminClassData, apiAdminGetClass, apiAdminPostUpdateClass } from '#/admin/class'
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

  const toBack = () => {
    pushTo(router, route, '/admin/class/list')
  }

  const classId = ref(Number(route.query?.classId).valueOf() || 0)
  const classObj = ref(null as AdminClass | null)

  const onChangeClass = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
    classId.value = Number(to.query?.classId).valueOf() || 0
    classObj.value = null

    if (classId.value && classId.value > 1) {
      apiAdminGetClass(classId.value).then(
        (res) => {
          classObj.value = res.data.data as AdminClass
          form.value = {
            name: classObj.value.name,
            show: classObj.value.show,
            down: false
          }
        },
        () => {
          toBack()
        }
      )
    } else {
      toBack()
    }
    next()
  }

  onBeforeRouteUpdate(onChangeClass)
  onChangeClass(route, route, () => {})

  const form = ref({
    name: '',
    show: true,
    down: false
  } as AdminClassData)
  const notDown = ref(true)

  const notDownChange = () => {
    if (notDown.value) {
      form.value.down = false
    } else {
      form.value.down = true
      form.value.show = false
    }
  }

  const checkShow = computed(() => {
    if (form.value.down) {
      return form.value.show === false
    }
    return true
  })
  const checkName = computed(() => form.value.name && form.value.name.length > 0 && form.value.name.length <= 10)
  const allCheck = computed(() => checkShow.value && checkName.value)

  const update = () => {
    classObj.value &&
      ElMessageBox.confirm('是否确定更新商品分类', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        classObj.value &&
          apiAdminPostUpdateClass(classObj.value.id, form.value).then(
            () => {
              ElMessage({
                type: 'success',
                message: '更新成功'
              })
              onChangeClass(route, route, () => {})
            },
            () => {
              ElMessage({
                type: 'error',
                message: '更新失败'
              })
            }
          )
      })
  }
</script>

<template>
  <el-card v-if="classObj && isAdmin()" class="base_card admin_root_main_base_card">
    <el-form :model="form" label-width="auto" style="width: 15vw">
      <el-form-item>
        <template #label>
          <el-text>名字</el-text>
        </template>
        <el-input v-model="form.name" maxlength="10" minlength="1" show-word-limit clearable />
      </el-form-item>
      <el-form-item v-show="!form.down">
        <template #label>
          <el-text> 是否公开显示 </el-text>
        </template>
        <el-checkbox v-model="form.show" label="" :disabled="form.down" />
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-text> 是否销售 </el-text>
        </template>
        <el-checkbox v-model="notDown" label="" @change="notDownChange" />
      </el-form-item>
    </el-form>
    <div style="display: flex; width: 15vw; justify-content: center">
      <el-button size="large" type="success" :disabled="!allCheck" plain @click="update"> 更新 </el-button>
    </div>
    <div style="width: 15vw; margin-top: 5px">
      <div v-if="!checkName" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="名字需要在1-10位！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!checkName" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="下架商品需要取消显示！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
    </div>
  </el-card>
  <div v-else></div>
</template>

<style scoped lang="scss">
  .base_card {
    width: auto;
    max-width: 98%;
    min-width: 10vw;
  }

  .tip_box {
    margin-top: 10px;
  }
</style>
