<script setup lang="ts">
  import { ElMessage, ElMessageBox } from 'element-plus'
  import useAdminUserStore from '@/store/admin/user'
  import { isRootAdmin } from '@/store/admin'

  const router = useRouter()
  const route = useRoute()

  if (!isRootAdmin()) {
    router.push({
      path: '/system/error',
      query: {
        msg: '页面错误'
      }
    })
  }

  const subtitle = computed(() => route.meta.subtitle || ('重启或关闭后端Http服务' as string))

  const userAdminStore = useAdminUserStore()

  const form = ref({
    password: '',
    secret: ''
  } as { password: string; secret: string })

  const passwordCheck = computed(() => form.value.password.length >= 8)
  const secretCheck = computed(() => form.value.secret.length >= 8)
  const allCheck = computed(() => passwordCheck.value && secretCheck.value)

  const restart = () => {
    ElMessageBox.confirm('您确定重启后端服务系统吗？', '提示', {
      confirmButtonText: '确定重启',
      cancelButtonText: '取消重启',
      type: 'warning'
    }).then(() => {
      return userAdminStore.restartServer(form.value.password, form.value.secret).then(
        () => {
          ElMessage({
            type: 'success',
            message: '重启任务提交成功'
          })
        },
        () => {
          ElMessage({
            type: 'error',
            message: '重启任务提交失败'
          })
        }
      )
    })
  }

  const stop = () => {
    ElMessageBox.confirm('您确定关闭后端服务系统吗？', '提示', {
      confirmButtonText: '确定关闭',
      cancelButtonText: '取消关闭',
      type: 'warning'
    }).then(() => {
      return userAdminStore.stopServer(form.value.password, form.value.secret).then(
        () => {
          ElMessage({
            type: 'success',
            message: '关闭任务提交成功'
          })
        },
        () => {
          ElMessage({
            type: 'error',
            message: '关闭任务提交失败'
          })
        }
      )
    })
  }
</script>

<template>
  <el-card v-if="isRootAdmin()" class="base_card admin_root_main_base_card">
    <div style="display: flex; justify-content: center; margin-bottom: 10px">
      <el-text style="font-size: 1vw">{{ subtitle }}</el-text>
    </div>
    <el-form :model="form" label-width="auto" style="width: 15vw">
      <el-form-item>
        <template #label>
          <el-text>账号密码</el-text>
        </template>
        <el-input v-model="form.password" type="password" show-password />
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-text>系统密钥</el-text>
        </template>
        <el-input v-model="form.secret" type="password" show-password />
      </el-form-item>
    </el-form>
    <div style="display: flex; width: 15vw; justify-content: center">
      <el-button-group>
        <el-button :disabled="!allCheck" @click="restart"> 重启后端 </el-button>
        <el-button :disabled="!allCheck" @click="stop"> 关闭后端 </el-button>
      </el-button-group>
    </div>
    <div style="width: 15vw; margin-top: 5px">
      <div v-if="!passwordCheck" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="新密码必须长度大于8！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!secretCheck" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="密钥长度必须大于8！！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
    </div>
  </el-card>
  <div v-else></div>
</template>

<style scoped lang="scss">
  .tip_box {
    margin-top: 10px;
  }
</style>
