<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import useAdminUserStore, {
  AdminUser,
  AdminUserBase,
  AdminUserStatus, AdminUserType
} from "@/store/admin/user"
import pushTo from "@/views/admin/router_push"
import {isAdmin, isRootAdmin} from "@/store/admin"
import {isEmail} from "@/utils/str"

const router = useRouter()
const route = useRoute()

if (!isAdmin()) {
  router.push({
    path: "error",
    query: {
      msg: "页面错误"
    }
  })
}

const userAdminStore = useAdminUserStore()

const userId = ref(Number(route.query?.userId).valueOf() || 0)
const user = ref(null as AdminUser | null)

const ub = ref({
  name: "",
  location: "",
  status: 1,
  wechat: "",
  email: "",
  type: 1,
} as AdminUserBase)

const toBack = () => {
  pushTo(router, route, "/admin/user/list")
}

const backSec = ref(6)
const backTimer = () => {
  if (backSec.value == 0) {
    toBack()
    return
  }

  backSec.value = backSec.value - 1
  setTimeout(backTimer, 1000)
}

const onChangeUser = () => {
  userId.value = Number(route.query?.userId).valueOf() || 0
  user.value = null

  if (userId.value) {
    userAdminStore.getUser(userId.value).then((res) => {
      user.value = res as AdminUser
      ub.value = {
        name: res.name,
        location: res.location,
        status: res.status,
        wechat: res.wechat,
        email: res.email,
        type: res.type,
      }
      if (user.value.type === 3) {
        if (!isRootAdmin()) {
          backTimer()
        }
        userStatusLst.value = {
          1: "正常",
        }
        userTypeLst.value = {
          3: "根管理员",
        }
        ub.value.status = 1
        if (res.status !== 1) {
          ElMessage({
            type: 'warning',
            message: "根管理员状态错误，已自动修正"
          })
        }
      }
      if (user.value.status === 3) {
        backTimer()
      }
    }, () => {
      toBack()
    })
  } else {
    toBack()
  }
}

watch(() => route.query?.userId, onChangeUser)
onChangeUser()

const hasChange = computed(() => {
  return ub.value.type !== user.value?.type && ub.value.name !== user.value?.name || ub.value.location !== user.value?.location || ub.value.status !== user.value?.status || ub.value.wechat !== user.value?.wechat || ub.value.email !== user.value?.email
})

const userStatusLst = ref(AdminUserStatus as { [key: number]: string })
const userTypeLst = ref(AdminUserType as { [key: number]: string })

const deleteCheck = computed(() => !(user.value && user.value.status === 3 && ub.value.status !== 3))
const rootAdminCheck = computed(() => !(user.value && user.value.type === 3 && ub.value.status !== 1))
const checkName = computed(() => ub.value.name && ub.value.name.length > 0 && ub.value.name.length <= 10)
const checkStatus = computed(() => !Object.keys(userStatusLst).some((v) => Number(v).valueOf() === ub.value.status))
const checkType = computed(() => !Object.keys(userTypeLst).some((v) => Number(v).valueOf() === ub.value.type))
const checkEmail = computed(() => {
  if (!ub.value.email) {
    return true
  }
  return isEmail(ub.value.email)
})
const allCheck = computed(() => checkType.value && checkEmail.value && checkStatus.value && checkName.value && hasChange.value && rootAdminCheck.value && deleteCheck.value)

const update = () => {
  ElMessageBox.confirm('您是否确定更新你的用户信息', '提示', {
    confirmButtonText: '确定更新',
    cancelButtonText: '取消更新',
    type: 'warning',
  }).then(() => {
    return userAdminStore.editData(userId.value, ub.value).then(() => {
      ElMessage({
        type: 'success',
        message: "更新成功",
      })
      toBack()
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
  <div v-if="user && isAdmin()" style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <el-card v-if="user.status === 3" style="margin-top: 10px">
      <el-result
          icon="error"
          title="用户已被删除"
          sub-title="用户已被删除，无法修改其信息。"
      >
        <template #extra>
          <el-button type="primary" @click="toBack">返回（{{ backSec > 5 ? 5 : backSec }}s）</el-button>
        </template>
      </el-result>
    </el-card>
    <el-card v-else-if="user.type === 3 && !isRootAdmin()" style="margin-top: 10px">
      <el-result
          icon="error"
          title="权限不足"
          sub-title="您的权限不足以修改他的用户喜喜。"
      >
        <template #extra>
          <el-button type="primary" @click="toBack">返回（{{ backSec > 5 ? 5 : backSec }}s）</el-button>
        </template>
      </el-result>
    </el-card>
    <el-card v-else style="display: flex; max-width: 75%; justify-content: center; margin-top: 10px">
      <el-form :model="ub" label-width="auto" style="width: 15vw">
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
            <el-text>微信</el-text>
          </template>
          <el-input
              v-model="ub.wechat"
              maxlength="30"
              show-word-limit
              clearable
          />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>邮箱</el-text>
          </template>
          <el-input
              v-model="ub.email"
              maxlength="30"
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
                :disabled="(Number(i).valueOf() === 3 && !isRootAdmin()) || (Number(i).valueOf() !== 3 && (user && user.status === 3))"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>类型</el-text>
          </template>
          <el-select
              v-model="ub.type"
              placeholder="类型"
              size="large"
          >
            <el-option
                v-for="(item, i) in userTypeLst"
                :key="i"
                :label="item"
                :value="Number(i).valueOf()"
                :disabled="Number(i).valueOf() === 3"
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
        <div v-if="!checkType" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的类型！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
        <div v-if="!checkName" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="名字需要在1-10位！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
        <div v-if="!hasChange" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请编辑信息！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
        <div v-if="!rootAdminCheck" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="根管理员状态错误！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
        <div v-if="!checkEmail" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的邮箱！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
        <div v-if="!deleteCheck" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="已删除的用户不能恢复！" :closable="false" type="warning" center show-icon>
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