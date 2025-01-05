<script setup lang="ts">
  import { ElMessage, ElMessageBox } from 'element-plus'
  import useAdminUserStore from '@/store/admin/user'
  import { isRootAdmin } from '@/store/admin'
  import { RouteLocationNormalized } from 'vue-router'

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

  const userAdminStore = useAdminUserStore()
  const loadding = ref(false)

  const form = ref({
    password: '',
    secret: '',
    waitsec: 10
  } as { password: string; secret: string; waitsec: number })

  const reset = () => {
    form.value = {
      password: '',
      secret: '',
      waitsec: form.value.waitsec || 10
    }
  }

  const waitsecCheck = computed(() => form.value.waitsec >= 10 && form.value.waitsec <= 60)
  const passwordCheck = computed(() => form.value.password.length >= 8)
  const secretCheck = computed(() => form.value.secret.length >= 8)
  const allCheck = computed(() => waitsecCheck.value && passwordCheck.value && secretCheck.value)

  const restart = () => {
    ElMessageBox.confirm('您确定重启后端服务系统吗？', '提示', {
      confirmButtonText: '确定重启',
      cancelButtonText: '取消重启',
      type: 'warning'
    })
      .then(() => {
        return userAdminStore.restartServer(form.value.password, form.value.secret, form.value.waitsec).then((res) => {
          console.log('res', res)
          if (res.data.data.success) {
            ElMessage({
              type: 'success',
              message: '重启任务提交成功，正在等待重启...'
            })

            loadding.value = true
            const waitsec = res.data.data.waitsec && res.data.data.waitsec >= 0 ? res.data.data.waitsec : 20

            setTimeout(() => {
              loadding.value = false
              ElMessage({
                message: '后端Http重启倒计时完毕，请确认服务是否正常。',
                type: 'success'
              })
            }, waitsec * 1000)
          } else {
            ElMessage({
              type: 'error',
              message: '重启任务提交失败'
            })
          }
        })
      })
      .finally(() => reset())
  }

  const onChange = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
    reset()
    next()
  }

  onBeforeRouteUpdate(onChange)
  onChange(route, route, () => {})
</script>

<template>
  <el-card v-if="isRootAdmin()" v-loading="loadding" class="base_card admin_root_main_base_card">
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
      <el-form-item>
        <template #label>
          <el-text>重启等待</el-text>
        </template>
        <el-input-number v-model="form.waitsec" :precision="0" :min="10" :max="60">
          <template #suffix>
            <span> 秒 </span>
          </template>
        </el-input-number>
      </el-form-item>
    </el-form>
    <div style="display: flex; width: 15vw; justify-content: center">
      <el-button size="large" type="warning" :disabled="!allCheck" @click="restart"> 重启后端 </el-button>
    </div>
    <div style="width: 15vw; margin-top: 5px">
      <div v-if="!passwordCheck" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="新密码必须长度大于8！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!secretCheck" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="密钥长度必须大于8！！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!waitsecCheck" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="重启等待时间只能在10-60秒以内！" :closable="false" type="warning" center show-icon> </el-alert>
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
