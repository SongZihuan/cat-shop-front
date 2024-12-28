<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import {isAdmin} from "@/store/admin"
import {apiAdminPostAddClass, NewClassData} from "#/admin/class"

const router = useRouter()

if (!isAdmin()) {
  router.push({
    path: "/system/error",
    query: {
      msg: "页面错误"
    }
  })
}

const form = ref({
  name: "",
  show: true,
  down: false,
} as NewClassData)

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
    type: 'warning',
  }).then(() => {
    return apiAdminPostAddClass(form.value).then(() => {
      ElMessage({
        type: 'success',
        message: "添加成功",
      })
      form.value = {
        name: "",
        show: true,
        down: false,
      }
    }, () => {
      ElMessage({
        type: 'error',
        message: "添加失败",
      })
    })
  })
}

</script>

<template>
  <div v-if="isAdmin()" style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <el-card style="display: flex; max-width: 75%; justify-content: center; margin-top: 10px">
      <el-form :model="form" label-width="auto" style="width: 15vw">
        <el-form-item>
          <template #label>
            <el-text>名字</el-text>
          </template>
          <el-input
              v-model="form.name"
              maxlength="10"
              minlength="1"
              show-word-limit
              clearable
          />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>
              是否显示
            </el-text>
          </template>
          <el-checkbox v-model="form.show" label=""/>
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>
              是否先保持下架
            </el-text>
          </template>
          <el-checkbox v-model="form.down" label="" @change="form.down ? (form.show = false) : 0" />
        </el-form-item>
      </el-form>
      <div style="display: flex; width: 15vw; justify-content: center">
        <el-button :disabled="!allCheck" @click="add">
          添加
        </el-button>
      </div>
      <div style="width: 15vw; margin-top: 5px">
        <div v-if="!checkName" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="名字需要在1-10位！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
        <div v-if="!checkName" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="下架商品需要取消显示！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
      </div>
    </el-card>
  </div>
  <div v-else></div>
</template>

<style scoped lang="scss">
.tip_box {
  margin-top: 5px;
}
</style>