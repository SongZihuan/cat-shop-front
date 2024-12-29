<script setup lang="ts">

import {asString} from "@/utils/str";

const route = useRoute()
const router = useRouter()
const goHome = () => {
  router.push({
    path: "/shop/home"
  })
}

const msg = ref<string>(asString(route.query.msg))
if (!msg.value || msg.value.length > 20) {
  msg.value = "遇到系统未能捕获的错误，请稍后臭重试。"
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
  <div style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <el-card style="display: flex; max-width: 75%; justify-content: center; margin-top: 10px">
      <el-result
          style="min-width: 10vw; min-height: 40vh"
          icon="error"
          title="错误发生"
          :sub-title="msg || ''"
      >
        <template #extra>
          <el-button  type="primary">回到主页（{{ backSec > 5 ? 5 : backSec }}s）</el-button>
        </template>
      </el-result>
    </el-card>
  </div>
</template>

<style scoped lang="scss">

</style>