<script setup lang="ts">
  import pushTo from '@/views/admin/router_push'
  import { isAdmin } from '@/store/admin'

  const router = useRouter()
  const route = useRoute()

  const homePath = ref('/user/shop/home')
  const adminPath = ref('/admin/user/list')
  const kefuPath = ref('/system/kefu')

  const goHome = () => {
    router.push({
      path: homePath.value
    })
  }

  const goAdmin = () => {
    isAdmin() && pushTo(router, route, adminPath.value)
  }

  const goKefu = () => {
    router.push({
      path: '/system/kefu'
    })
  }

  const url = ref(window.location.href as string)
  const path = ref(window.location.pathname)
  const isFromAdmin = computed(() => isAdmin() && path.value && path.value.startsWith('/admin/'))
  const notWayToGo = computed(() => path.value === homePath.value || path.value === adminPath.value)
  const notKefu = computed(() => path.value === kefuPath.value)

  let timeoutID: NodeJS.Timeout | number | undefined = undefined
  const backSec = ref(6)
  const backTimer = () => {
    if (notWayToGo.value) {
      return
    } else if (backSec.value == 0) {
      if (isFromAdmin.value) {
        goAdmin()
      } else {
        goHome()
      }
      return
    }

    backSec.value -= 1
    timeoutID = setTimeout(backTimer, 1000)
  }
  backTimer()

  onUnmounted(() => {
    timeoutID && clearTimeout(timeoutID)
  })
</script>

<template>
  <el-card class="base_card">
    <el-result style="min-width: 10vw; min-height: 40vh" icon="error">
      <template #title>
        <div class="title_box">
          <el-text class="title"> 404 NotFound 页面资源未找到 </el-text>
        </div>
      </template>

      <template #sub-title>
        <div>
          <div class="info_box">
            <el-text class="info_text"> 您访问的页面资源不存在。 </el-text>
          </div>

          <div class="info_box">
            <el-text class="info_text"> 页面资源链接：{{ url }} </el-text>
          </div>
        </div>
      </template>

      <template #extra>
        <el-button-group>
          <el-button v-if="!notWayToGo && isFromAdmin" type="info" size="large" @click="goAdmin"
            >回到主页（{{ backSec > 5 ? 5 : backSec }}s）</el-button
          >
          <el-button v-else-if="!notWayToGo && !isFromAdmin" type="info" size="large" @click="goHome"
            >回到主页（{{ backSec > 5 ? 5 : backSec }}s）</el-button
          >
          <el-button v-if="!notKefu" type="primary" size="large" @click="goKefu">寻求客服帮助</el-button>
        </el-button-group>
      </template>
    </el-result>
  </el-card>
</template>

<style scoped lang="scss">
  .base_card {
    --base-card-height: #{var(--custom-height)};
    --base-card-width: #{var(--custom-little-width)};
    --base-card-min-width: #{var(--custom-most-min-width)};
    max-width: #{var(--base-card-width)};
    min-width: var(--base-card-min-width);
    margin-top: 10vh;
  }

  .title_box {
    margin-bottom: 3vh;
  }

  .title {
    font-size: 1.5rem;
  }

  .info_box {
    margin-bottom: 10px;
  }

  .info_text {
    font-size: 1rem;
  }
</style>
