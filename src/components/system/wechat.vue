<script setup lang="ts">
  import useWechatStore from '@/store/wechat'
  import useConfigStore from '@/store/config'

  const route = useRoute()
  const wechatStore = useWechatStore()
  const configStore = useConfigStore()

  const delayShow = ref(false)
  const isAdmin = computed(() => route.meta?.admin === true || route.meta?.rootAdmin === true)

  let closeId: NodeJS.Timeout | number = 0
  onMounted(() => {
    setTimeout(() => {
      delayShow.value = true

      closeId === 0 &&
        (closeId = setTimeout(() => {
          wechatStore.close()
        }, 10000))
    }, 2500)
  })

  const picUrl = ref('')
  const openPic = () => {
    picUrl.value = configStore.config.wechat
    closeId >= 0 && clearTimeout(closeId)
    closeId = -1
  }
  watch(
    () => picUrl.value,
    () => {
      if (picUrl.value === '' && closeId === -1) {
        closeId = setTimeout(() => {
          wechatStore.close()
        }, 10000)
      }
    }
  )

  const onClose = () => {
    closeId >= 0 && clearTimeout(closeId)
    wechatStore.close()
  }
</script>

<template>
  <div v-if="!isAdmin && wechatStore.show && delayShow && configStore.config.wechat" class="wechat">
    <div class="wechat_box">
      <el-card>
        <template #header>
          <div class="header">
            <el-text class="header_text"> 欢迎了解我！ </el-text>
          </div>
        </template>
        <div class="wechat_img" @click="openPic">
          <el-image :src="configStore.config.wechat" fit="contain"> </el-image>
        </div>
        <template #footer>
          <div style="display: flex; justify-content: center">
            <el-button-group>
              <el-button type="success" @click="openPic"> 查看 </el-button>
              <el-button type="warning" @click="onClose"> 关闭 </el-button>
            </el-button-group>
          </div>
        </template>
      </el-card>
    </div>
  </div>
  <div v-else></div>

  <Showimg v-model="picUrl"></Showimg>
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
