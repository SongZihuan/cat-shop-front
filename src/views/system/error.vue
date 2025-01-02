<script setup lang="ts">
  import { asString } from '@/utils/str'

  const route = useRoute()
  const router = useRouter()

  const goHome = () => {
    router.push({
      path: '/user/shop/home'
    })
  }

  const goKefu = () => {
    router.push({
      path: '/system/kefu'
    })
  }

  const msg = ref<string>(asString(route.query.msg))
  if (!msg.value || msg.value.length > 20) {
    msg.value = '遇到系统未能捕获的错误，请稍后臭重试。'
  }

  let timeoutID: NodeJS.Timeout | number | undefined = undefined
  const backSec = ref(6)
  const backTimer = () => {
    if (backSec.value == 0) {
      goHome()
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
    <el-result style="min-width: 10vw; min-height: 40vh" icon="error" title="错误发生" :sub-title="msg || ''">
      <template #extra>
        <el-button-group>
          <el-button type="info" size="large" @click="goHome">回到主页（{{ backSec > 5 ? 5 : backSec }}s）</el-button>
          <el-button type="primary" size="large" @click="goKefu">寻求客服帮助</el-button>
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
</style>
