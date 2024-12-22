<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import useAdminUserStore, {
  GetAdminUserStatus
} from "@/store/admin/user";
import {isAdmin} from "@/store/admin"
import {isMobile} from "@/utils/str"
import {NewUserData} from "#/admin/user"

const router = useRouter()

if (!isAdmin()) {
  router.push({
    path: "error",
    query: {
      msg: "页面错误"
    }
  })
}

const userAdminStore = useAdminUserStore()

const ub = ref({
  name: "",
  phone: "",
  password: "",
  location: "",
  status: 1,
  wechat: "",
  email: "",
} as NewUserData)

const userStatusLst = ref(GetAdminUserStatus() as { [key: number]: string })

const checkName = computed(() => ub.value.name && ub.value.name.length > 0 && ub.value.name.length <= 10)
const phoneCheck = computed(() => isMobile(ub.value.phone))
const passwordCheck = computed(() => ub.value.password.length >= 8)
const checkStatus = computed(() => !Object.keys(userStatusLst).some((v) => Number(v).valueOf() === ub.value.status))
const allCheck = computed(() => checkStatus.value && checkName.value && phoneCheck.value && passwordCheck.value)

const update = () => {
  ElMessageBox.confirm('是否确定添加新用户', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    return userAdminStore.newUser(ub.value).then(() => {
      ElMessage({
        type: 'success',
        message: "更新成功",
      })
      ub.value = {
        name: "",
        phone: "",
        password: "",
        location: "",
        status: 1,
        wechat: "",
        email: "",
      }
    }, () => {
      ElMessage({
        type: 'error',
        message: "更新失败",
      })
    })
  })
}

</script>

<template>
  <div v-if="isAdmin()" style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <el-card style="display: flex; max-width: 75%; justify-content: center; margin-top: 10px">
      <el-form :model="ub" label-width="auto" style="width: 15vw">
        <el-form-item>
          <template #label>
            <el-text>手机号</el-text>
          </template>
          <el-input
              v-model="ub.phone"
              maxlength="20"
              minlength="1"
              show-word-limit
              clearable
          />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>密码</el-text>
          </template>
          <el-input v-model="ub.password" type="password" show-password />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>昵称</el-text>
          </template>
          <el-input
              v-model="ub.name"
              maxlength="10"
              minlength="1"
              show-word-limit
              clearable
          />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>地址</el-text>
          </template>
          <el-input v-model="ub.location" minlength="0" maxlength="150" show-word-limit/>
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>状态</el-text>
          </template>
          <el-select
              v-model="ub.status"
              placeholder="状态"
              size="large"
          >
            <el-option
                v-for="(item, i) in userStatusLst"
                :key="i"
                :label="item"
                :value="Number(i).valueOf()"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="display: flex; width: 15vw; justify-content: center">
        <el-button :disabled="!allCheck" @click="update">
          更新
        </el-button>
      </div>
      <div style="width: 15vw; margin-top: 5px">
        <div v-if="!checkStatus" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的状态！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
        <div v-if="!checkName" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="名字需要在1-10位！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
        <div v-if="!phoneCheck" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的手机号！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
        <div v-if="!passwordCheck" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="密码必须长度大于8！" :closable="false" type="warning" center show-icon>
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