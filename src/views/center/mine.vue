<script setup lang="ts">
import useUserStore, {isLogin, hasLoad, UserType} from "@/store/user"
  import {Edit} from "@element-plus/icons-vue"
  import {BuyRecord, apiGetUserBuyRecordLst} from "#/center/buyrecord"
  import Buyrecord from "@/components/center/buyrecord.vue"
import {ElNotification, ElMessage, UploadFile} from "element-plus"
  import { genFileId } from 'element-plus'
  import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

  const route = useRoute()
  const router = useRouter()

  const userStore = useUserStore()
  if (!isLogin()) {
    router.push({
      path: "/shop/login",
      query: {
        redirect: encodeURIComponent(route.fullPath)
      }
    })
  }

  const kehutag = ref("普通客户")
  userStore.updateInfo().then(() => {
    if (userStore.user.type === 1) {
      if (userStore.user.goodPre >= 85) {
        kehutag.value = "尊享III客户"
      } else if (userStore.user.goodPre >= 50) {
        kehutag.value = "星级II客户"
      } else if (userStore.user.goodPre >= 35) {
        kehutag.value = "贵宾I客户"
      } else if (userStore.user.goodPre >= 5) {
        kehutag.value = "高级客户"
      } else {
        kehutag.value = "普通客户"
      }
    } else {
      kehutag.value = UserType[userStore.user.type] || "普通客户"
    }
  })

  const goHome = () => {
    router.push({
      path: "/shop/home"
    })
  }

  let offset = 0
  const limit = 20
  const stop = ref(false)

  const buyRecord = ref([] as BuyRecord[])
  const updater = () => {
    if (stop.value) {
      return
    }

    apiGetUserBuyRecordLst(offset, limit).then((res) => {
      if (res.data.data.total < limit) {
        stop.value = true
      }

      offset += res.data.data.total
      buyRecord.value = buyRecord.value.concat(res.data.data.list)
    }).catch(() => {
      stop.value = true
    })
  }
  updater()

  if (buyRecord.value.some((item) => item.status === 2)) {
    ElNotification({
      title: '支付提示',
      message: '支付失败，请尝试重新支付',
      type: 'warning',
      duration: 0,
      position: 'top-left',
    })
  }

  const goEdit = () => {
    router.push({
      path: "/center/user/edit"
    })
  }

  const goPassword = () => {
    router.push({
      path: "/center/user/password"
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

    userStore.editAvatar(avatar.raw).then(() => {
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
</script>

<template>
  <div v-if="hasLoad()" style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <el-card style="display: flex; max-width: 75%; justify-content: center; margin-top: 10px">
      <div style="display: inline-block; width: 15vw; max-height: 60vh; min-height: 60vh; margin-right: 20px; margin-left: 20px">
        <el-scrollbar height="60vh">
          <div style="padding-right: 15px">
            <el-image :src="userStore.user.avatar" fit="contain" style="margin-right: 15px; height: auto; width: 100%; border-radius: 20px" :initial-index="0" :preview-src-list="[userStore.user.avatar]"></el-image>
            <div style="margin-right: 15px">
              <div class="user_info_box">
                <div class="user_info_btn">
                  <el-button-group>
                    <el-button type="success" @click="goEdit">
                      <el-icon><Edit /></el-icon>
                      更改个人信息
                    </el-button>
                    <el-button type="danger" @click="goPassword">
                      <el-icon><EditPen /></el-icon>
                      修改账号密码
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
                      <el-button type="primary">
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
              <div class="user_info_box">
                <el-text class="user_info_text">
                  <el-icon><Iphone /></el-icon>
                  电话：
                  {{ userStore.user.phone ? userStore.user.phone : "暂无" }}
                </el-text>
              </div>
              <div class="user_info_box">
                <el-text class="user_info_text">
                  <el-icon><Location /></el-icon>
                  地址：
                  {{ userStore.user.location ? userStore.user.location : "暂无" }}
                </el-text>
              </div>

              <el-divider border-style="solid" content-position="left" style="margin-top: 50px;">
                消费统计
              </el-divider>

              <div class="user_info_box">
                <el-text class="user_info_text">
                  消费物品总件数：{{ userStore.user.totalJian >= 0 ? userStore.user.totalJian : 0 }} 件
                </el-text>
              </div>

              <div class="user_info_box">
                <el-text class="user_info_text">
                  消费总次数：{{ userStore.user.totalBuy >= 0 ? userStore.user.totalBuy : 0 }} 次
                </el-text>
              </div>

              <div class="user_info_box">
                <el-text class="user_info_text">
                  消费总金额：
                  ￥{{ userStore.user.totalPrice >= 0 ? (userStore.user.totalPrice / 100).toFixed(2) : "0.00" }}
                </el-text>
              </div>

              <div class="user_info_box">
                <el-text class="user_info_text">
                  收货总次数：{{ userStore.user.totalShouHuo >= 0 ? userStore.user.totalShouHuo : 0 }} 次
                </el-text>
              </div>

              <div class="user_info_box">
                <el-text class="user_info_text">
                  总评价次数：{{ userStore.user.totalPingJia >= 0 ? userStore.user.totalPingJia : 0 }} 次
                </el-text>
              </div>

              <div class="user_info_box">
                <el-text class="user_info_text">
                  消费好评次数：{{ userStore.user.totalGood >= 0 ? userStore.user.totalGood : 0 }} 次
                </el-text>
              </div>

              <div class="user_info_box">
                <el-text class="user_info_text">
                  消费好评率：{{ userStore.user.goodPre.toFixed(2) }} %
                </el-text>
              </div>

              <div class="user_info_box">
                <el-text class="user_info_text">
                  平均每笔交易金额：￥{{ (userStore.user.pricePre / 100).toFixed(2) }}
                </el-text>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div style="display: inline-block; width: 35vw; max-height: 60vh; margin-right: 20px; margin-left: 20px">
        <el-badge :value="kehutag" style="margin-top: 10px; height: 5vh">
          <el-text class="user_name">{{ userStore.user.name }} </el-text>
        </el-badge>
        <div v-if="buyRecord.length === 0" style="margin-top: 10px">
          <el-result icon="info" title="文学提示">
            <template #sub-title>
              <p>你还没有任何购买记录。</p>
              <p>你可以去主页看看，那里或许有你想要的。</p>
            </template>
            <template #extra>
              <el-button type="success" size="large" @click="goHome">去首页看看</el-button>
            </template>
          </el-result>
        </div>
        <div v-else style="margin-top: 10px">
          <div v-infinite-scroll="updater" style="overflow: auto; height: 53vh">
            <div v-for="(item, index) in buyRecord" :key="index" class="buy_record_box">
                <Buyrecord :record="item"></Buyrecord>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
  <div v-else></div>
</template>

<style scoped lang="scss">
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