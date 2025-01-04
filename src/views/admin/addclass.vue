<script setup lang="ts">
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { isAdmin } from '@/store/admin'
  import { apiAdminPostAddClass, NewClassData } from '#/admin/class'

  const router = useRouter()

  if (!isAdmin()) {
    router.push({
      path: '/system/error',
      query: {
        msg: '页面错误'
      }
    })
  }

  const form = ref({
    name: '',
    show: true,
    down: false
  } as NewClassData)

  const notDownChange = () => {
    if (form.value.down) {
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

  const add = () => {
    ElMessageBox.confirm('是否确定添加新商品分类', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      return apiAdminPostAddClass(form.value).then(
        () => {
          ElMessage({
            type: 'success',
            message: '添加成功'
          })
          form.value = {
            name: '',
            show: true,
            down: false
          }
        },
        () => {
          ElMessage({
            type: 'error',
            message: '添加失败'
          })
        }
      )
    })
  }
</script>

<template>
  <el-card v-if="isAdmin()" class="base_card admin_root_main_base_card">
    <el-form :model="form" label-width="auto" style="width: 15vw">
      <el-form-item>
        <template #label>
          <el-text>名字</el-text>
        </template>
        <el-input v-model="form.name" maxlength="10" minlength="1" show-word-limit clearable />
      </el-form-item>
      <el-form-item v-show="!form.down">
        <template #label>
          <el-text> 是否显示 </el-text>
        </template>
        <el-checkbox v-model="form.show" label="" :disabled="form.down" />
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-text> 是否先下架 </el-text>
        </template>
        <el-checkbox v-model="form.down" label="" @change="notDownChange" />
      </el-form-item>
    </el-form>
    <div style="display: flex; width: 15vw; justify-content: center">
      <el-button size="large" type="success" :disabled="!allCheck" plain @click="add"> 添加 </el-button>
    </div>
    <div style="width: 15vw; margin-top: 5px">
      <div v-if="!checkName" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="名字需要在1-10位！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!checkShow" class="tip_box" style="display: flex; justify-content: center">
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
