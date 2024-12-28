<script setup lang="ts">
import useAdminUserStore from "@/store/admin/user"
import { AdminUser } from "@/store/admin/user"
import {Edit, EditPen} from "@element-plus/icons-vue"
import {ElMessage, genFileId, UploadFile, type UploadInstance, UploadProps, UploadRawFile} from "element-plus"
import pushTo from "@/views/admin/router_push"
import {isAdmin, isRootAdmin} from "@/store/admin"

const router = useRouter()
const route = useRoute()

if (!isAdmin()) {
  router.push({
    path: "/system/error",
    query: {
      msg: "页面错误"
    }
  })
}

const toBack = () => {
  pushTo(router, route, "/admin/user/list")
}

const userAdminStore = useAdminUserStore()

const userId = ref(Number(route.query?.userId).valueOf() || 0)
const user = ref(null as AdminUser | null)

const onChangeUser = () => {
  userId.value = Number(route.query?.userId).valueOf() || 0
  user.value = null

  if (userId.value) {
    userAdminStore.getUser(userId.value).then((res) => {
      user.value = res as AdminUser
    }, () => {
      toBack()
    })
  } else {
    toBack()
  }
}

watch(() => route.query?.userId, onChangeUser)
onChangeUser()

if (userId.value) {
  userAdminStore.getUser(userId.value).then((res) => {
    user.value = res as AdminUser
  }, () => {
    router.push({
      path: "/system/error",
      query: {
        msg: "页面错误"
      }
    })
  })
} else {
  router.push({
    path: "/system/error",
    query: {
      msg: "页面错误"
    }
  })
}

const avatar = ref([])
const avatarUpload = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
  avatarUpload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  avatarUpload.value!.handleStart(file)
}

const updateAvatar = (avatar: UploadFile) => {
  if (!hasPermission) {
    ElMessage({
      type: 'error',
      message: "暂无权限"
    })
    return
  }

  if (!avatar || !avatar.size || !avatar.raw) {
    ElMessage({
      type: 'warning',
      message: "请上传图片"
    })
    return
  }

  if (avatar.size > 500000) {// 500KB
    ElMessage({
      type: 'warning',
      message: "文件过大"
    })
    return
  }

  userAdminStore.editUserAvatar(userId.value, avatar.raw).then(() => {
    ElMessage({
      type: 'success',
      message: "头像更新成功"
    })
  }, () => {
    ElMessage({
      type: 'error',
      message: "头像更新失败"
    })
  })
}

const goEdit = () => {
  pushTo(router, route, "/admin/user/edit/info")
}

const goPassword = () => {
  pushTo(router, route, "/admin/user/edit/password")
}

const hasPermission = computed(() => {
  if (!user.value) {
    return false
  }

  if (user.value.status === 3 || !isRootAdmin()) {
    return false
  }

  return isAdmin()
})

</script>

<template>
  <div v-if="user && isAdmin()" style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <el-card style="display: flex; justify-content: center; margin-top: 10px">
      <div style="padding-right: 15px; display: flex; justify-content: left">
        <div>
          <el-image :src="user.avatar" fit="contain" style="margin-right: 15px; height: auto; width: 10vw; border-radius: 20px" :initial-index="0" :preview-src-list="[user.avatar]"></el-image>
          <div class="user_info_box">
            <el-text class="user_info_text">
              <el-icon><Iphone /></el-icon>
              电话：
              {{ user.phone ? user.phone : "暂无" }}
            </el-text>
          </div>
          <div class="user_info_box">
            <el-text class="user_info_text">
              <el-icon><Location /></el-icon>
              地址：
              {{ user.location ? user.location : "暂无" }}
            </el-text>
          </div>

          <div style="margin-top: 20px" class="user_info_box">
            <div class="user_info_btn">
              <el-button-group>
                <el-button type="success" :disabled="!hasPermission" @click="goEdit">
                  <el-icon><Edit /></el-icon>
                  编辑用户
                </el-button>
                <el-button type="danger" :disabled="!hasPermission" @click="goPassword">
                  <el-icon><EditPen /></el-icon>
                  修改密码
                </el-button>
              </el-button-group>
            </div>
            <div class="user_info_btn">
              <el-upload
                  ref="avatarUpload"
                  v-model:file-list="avatar"
                  action="#"
                  accept=".jpg,.jpeg,.png"
                  :auto-upload="false"
                  :multiple="false"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :show-file-list="false"
                  :on-change="updateAvatar"
              >
                <el-tooltip
                    effect="dark"
                    placement="bottom-end"
                >
                  <el-button type="primary" :disabled="!hasPermission">
                    <el-icon><Edit /></el-icon>
                    更换头像
                  </el-button>
                  <template #content>
                    <el-text style="color: white">
                      仅限jpg/png文件，不超过500KB
                    </el-text>
                  </template>
                </el-tooltip>
              </el-upload>
            </div>
          </div>
        </div>

        <div style="margin-left: 30px">
          <div>
            <div class="user_info_box">
              <el-text class="user_info_text">
                消费商品总件数：{{ user.totalJian >= 0 ? user.totalJian : 0 }} 件
              </el-text>
            </div>

            <div class="user_info_box">
              <el-text class="user_info_text">
                消费总次数：{{ user.totalBuy >= 0 ? user.totalBuy : 0 }} 次
              </el-text>
            </div>

            <div class="user_info_box">
              <el-text class="user_info_text">
                消费总金额：
                ￥{{ user.totalPrice >= 0 ? (user.totalPrice / 100).toFixed(2) : "0.00" }}
              </el-text>
            </div>

            <div class="user_info_box">
              <el-text class="user_info_text">
                收货总次数：{{ user.totalShouHuo >= 0 ? user.totalShouHuo : 0 }} 次
              </el-text>
            </div>

            <div class="user_info_box">
              <el-text class="user_info_text">
                总评价次数：{{ user.totalPingJia >= 0 ? user.totalPingJia : 0 }} 次
              </el-text>
            </div>

            <div class="user_info_box">
              <el-text class="user_info_text">
                消费好评次数：{{ user.totalGood >= 0 ? user.totalGood : 0 }} 次
              </el-text>
            </div>

            <div v-if="user.pingjiaPre" class="user_info_box">
              <el-text class="user_info_text">
                总计评价率：：{{ user.pingjiaPre.toFixed(2)  || 0}} %
              </el-text>
            </div>

            <div v-if="user.goodPre" class="user_info_box">
              <el-text class="user_info_text">
                消费好评率：{{ user.goodPre.toFixed(2) || 0 }} %
              </el-text>
            </div>

            <div v-if="user.pricePre" class="user_info_box">
              <el-text class="user_info_text">
                平均每笔交易金额：￥{{ (user.pricePre / 100).toFixed(2) || "0.00" }}
              </el-text>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
  <div v-else></div>
</template>

<style scoped lang="scss">
.user_info_box {
  margin-bottom: 5px;
  font-size: 0.7vw;
}

.user_name {
  display: inline-block;
  font-size: 1.8vw;
  font-weight: bold;
  margin-right: 5px;
  vertical-align: bottom;
}

.buy_record_box {
  margin-top: 5px;
  margin-bottom: 5px;
}

.user_info_btn {
  margin-bottom: 2px;
}
</style>