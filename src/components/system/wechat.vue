<script setup lang="ts">
  import useWechatStore from "@/store/wechat"
  import useConfigStore from "@/store/config"

  const route = useRoute()
  const wechatStore = useWechatStore()
  const configStore = useConfigStore()

  const delayShow = ref(false)
  const show = ref(false)
  const isAdmin = computed(() => route.meta?.admin === true || route.meta?.rootAdmin === true)

  onMounted(() => {
    setTimeout(() => {
      delayShow.value = true

      setTimeout(() => {
        wechatStore.close()
      }, 10000)
    }, 1000)
  })

</script>

<template>
  <div v-if="!isAdmin && wechatStore.show && delayShow && configStore.config?.wechat" class="wechat">
    <div class="wechat_box">
      <el-card>
        <template #header>
          <div class="header">
            <el-text class="header_text">
              欢迎了解我！
            </el-text>
          </div>
        </template>
        <div class="wechat_img">
          <el-image :src="configStore.config?.wechat" fit="contain"> </el-image>
        </div>
        <template #footer>
          <div style="display: flex; justify-content: center;">
            <el-button>
              关闭
            </el-button>
          </div>
        </template>
      </el-card>
    </div>
  </div>
  <div v-else></div>

  <el-dialog
      v-model="show"
      style="height: 75vh; width: 30vw;"
  >
    <div style="height: 60vh; width: 100%; display: flex; justify-content: center">
      <img alt="wechat" style="height: 100%; width: 100%; object-fit: contain;" :src="configStore.config?.wechat"/>
    </div>

    <template #footer>
      <div class="dialog-footer" style="height: 10vh">
        <el-button type="success" @click="show = false">
          关闭
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

.wechat {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.wechat_box {
  padding: 5px;
}

.wechat_img {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10vw;
  height: auto;
}

.header {
  display: flex;
  justify-content: center;
}

.header_text {
  font-size: 0.8vm;
  font-weight: bold;
}

</style>