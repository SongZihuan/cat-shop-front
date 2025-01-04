<script setup lang="ts">
  import useAdminUserStore from '@/store/admin/user'
  import { AdminUser } from '@/store/admin/user'
  import { Edit, EditPen } from '@element-plus/icons-vue'
  import { ElMessage, genFileId, UploadFile, type UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
  import pushTo from '@/views/admin/router_push'
  import { hasPermission, isAdmin } from '@/store/admin'
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
    pushTo(router, route, '/admin/user/list')
  }

  const userAdminStore = useAdminUserStore()

  const userId = ref(Number(route.query?.userId).valueOf() || 0)
  const user = ref(null as AdminUser | null)

  const onChangeUser = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
    userId.value = Number(to.query?.userId).valueOf() || 0
    user.value = null

    if (userId.value) {
      userAdminStore.getUser(userId.value).then(
        (res) => {
          user.value = res as AdminUser
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

  onBeforeRouteUpdate(onChangeUser)
  onChangeUser(route, route, () => {})

  if (userId.value) {
    userAdminStore.getUser(userId.value).then(
      (res) => {
        user.value = res as AdminUser
      },
      () => {
        router.push({
          path: '/system/error',
          query: {
            msg: '页面错误'
          }
        })
      }
    )
  } else {
    router.push({
      path: '/system/error',
      query: {
        msg: '页面错误'
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
    if (!user.value || !hasPermission(user.value)) {
      ElMessage({
        type: 'error',
        message: '暂无权限'
      })
      return
    }

    if (!avatar || !avatar.size || !avatar.raw) {
      ElMessage({
        type: 'warning',
        message: '请上传图片'
      })
      return
    }

    if (avatar.size > 500000) {
      // 500KB
      ElMessage({
        type: 'warning',
        message: '文件过大'
      })
      return
    }

    userAdminStore.editUserAvatar(userId.value, avatar.raw).then(
      () => {
        ElMessage({
          type: 'success',
          message: '头像更新成功'
        })
      },
      () => {
        ElMessage({
          type: 'error',
          message: '头像更新失败'
        })
      }
    )
  }

  const goEdit = () => {
    pushTo(router, route, '/admin/user/edit/info')
  }

  const goPassword = () => {
    pushTo(router, route, '/admin/user/edit/password')
  }

  const goPhone = () => {
    pushTo(router, route, '/admin/user/edit/phone')
  }
</script>

<template>
  <el-card v-if="user && isAdmin()" class="base_card admin_root_main_base_card">
    <template #header>
      <div class="header_box">
        <div class="title">
          <el-text class="title_text"> 用户资料：{{ user.name || '未知用户' }} </el-text>
        </div>
        <div class="title_warning_box">
          <el-tooltip effect="dark" placement="bottom" content="任何触犯法律的行为都将被依法追究。">
            <el-text class="title_warning"> 管理员严禁泄露用户隐私和私自篡改用户数据！ </el-text>
          </el-tooltip>
        </div>
      </div>
    </template>
    <div class="box">
      <div class="avatar">
        <el-image
          :src="user.avatar"
          fit="contain"
          style="margin-right: 15px; height: auto; width: 10vw; border-radius: 20px"
          :initial-index="0"
          :preview-src-list="[user.avatar]"
        ></el-image>
      </div>
      <div class="user_info">
        <div class="user_info_box">
          <el-text class="user_info_text">
            <el-icon><User /></el-icon>
            用户名：
            {{ user.name ? user.name : '暂无' }}
          </el-text>
        </div>

        <div class="user_info_box">
          <el-text class="user_info_text">
            <el-icon><Iphone /></el-icon>
            电话：
            {{ user.phone ? user.phone : '暂无' }}
          </el-text>
        </div>

        <div v-if="user.wechat" class="user_info_box">
          <el-text class="user_info_text">
            <el-icon><Service /></el-icon>
            微信：
            {{ user.wechat }}
          </el-text>
        </div>

        <div v-if="user.email" class="user_info_box">
          <el-text class="user_info_text">
            <el-icon><Notebook /></el-icon>
            邮箱：
            {{ user.email }}
          </el-text>
        </div>

        <div v-if="user.location" class="user_info_box">
          <el-text class="user_info_text">
            <el-icon><Location /></el-icon>
            地址：
            {{ user.location }}
          </el-text>
        </div>

        <el-divider border-style="solid" content-position="left" style="margin-top: 30px"> 消费统计 </el-divider>

        <div class="user_info_box">
          <el-text class="user_info_text"> 消费物品总件数：{{ user.totalJian >= 0 ? user.totalJian : 0 }} 件 </el-text>
        </div>

        <div class="user_info_box">
          <el-text class="user_info_text"> 消费总次数：{{ user.totalBuy >= 0 ? user.totalBuy : 0 }} 次 </el-text>
        </div>

        <div class="user_info_box">
          <el-text class="user_info_text">
            消费总金额： ￥{{ user.totalPrice >= 0 ? (user.totalPrice / 100).toFixed(2) : '0.00' }}
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
          <el-text class="user_info_text"> 消费好评次数：{{ user.totalGood >= 0 ? user.totalGood : 0 }} 次 </el-text>
        </div>

        <div class="user_info_box">
          <el-text class="user_info_text"> 消费好评率：{{ user.goodPre.toFixed(2) }} % </el-text>
        </div>

        <div class="user_info_box">
          <el-text class="user_info_text"> 平均每笔交易金额：￥{{ (user.pricePre / 100).toFixed(2) }} </el-text>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="footer_box">
        <div class="user_info_btn">
          <el-button-group>
            <el-button type="success" :disabled="!hasPermission(user)" @click="goEdit">
              <el-icon><Edit /></el-icon>
              编辑用户
            </el-button>
            <el-button type="warning" :disabled="!hasPermission(user)" @click="goPassword">
              <el-icon><EditPen /></el-icon>
              修改密码
            </el-button>
            <el-button type="danger" :disabled="!hasPermission(user)" @click="goPhone">
              <el-icon><EditPen /></el-icon>
              修改手机号
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
            :disabled="!hasPermission(user)"
          >
            <el-tooltip effect="dark" placement="bottom">
              <el-button type="primary" :disabled="!hasPermission(user)">
                <el-icon><Edit /></el-icon>
                更换头像
              </el-button>
              <template #content>
                <el-text style="color: white"> 仅限jpg/png文件，不超过500KB </el-text>
              </template>
            </el-tooltip>
          </el-upload>
        </div>
      </div>
    </template>
  </el-card>
  <div v-else></div>
</template>

<style scoped lang="scss">
  .base_card {
    width: auto;
    max-width: 98%;
    min-width: 20vw;
  }

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

  .avatar {
    margin-bottom: 10px;
  }

  .user_info_btn {
    margin-bottom: 10px;
  }

  .box {
    display: flex; /* 启用Flexbox布局 */
    flex-direction: column; /* 设置垂直方向的布局 */
    align-items: center; /* 水平居中对齐子元素 */
  }

  .header_box {
    display: flow-root;
  }

  .title {
    float: left;
    margin-right: 1vw;
  }

  .title_warning_box {
    float: right;
    margin-left: 1vw;
  }

  .title_text,
  .title_warning {
    font-size: 1.2rem;
    vertical-align: middle;
  }

  .title_warning {
    color: red;
    font-weight: bold;
  }

  .footer_box {
    display: flex; /* 启用Flexbox布局 */
    flex-direction: column; /* 设置垂直方向的布局 */
    align-items: center; /* 水平居中对齐子元素 */
  }
</style>
