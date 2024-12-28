<script setup lang="ts">
import useConfigStore from "@/store/config"
import { ElMessage, ElMessageBox } from 'element-plus'

const configStore = useConfigStore()
const showAD = ref({
  pic: configStore.config?.adpic,
  text: configStore.config?.ad,
  header: configStore.config?.adtitle,
  url: configStore.config?.adurl
})

const adDiv = ref(null as HTMLElement | null)
const height = ref(0)

const resizeObserver = new ResizeObserver((entries) => {
  entries.forEach(entry => {
    height.value = entry.contentRect.height
  })
})

onMounted(() => {
  if (adDiv.value) {
    resizeObserver.observe(adDiv.value)
  }
})

defineExpose({
  height
})

const onClickAD = () => {
  if (showAD.value.url) {
    window.open(showAD.value.url)
  } else {
    ElMessageBox.alert(showAD.value.text, showAD.value.header, {
      confirmButtonText: 'OK',
      callback: () => {
        ElMessage({
          type: 'success',
          message: "感谢您的关注",
        })
      },
    })
  }
}

</script>

<template>
  <div v-if="showAD" id="ad_box" @click="onClickAD">
    <div id="ad_text">
      <el-card>
        <template #header>
          广告：{{ showAD.header }}
        </template>
        <el-text class="ad_text">
          {{ showAD.text }}
        </el-text>
      </el-card>
    </div>
    <div id="ad_pic" ref="adDiv">
      <el-image :src="showAD.pic" fit="contain"> </el-image>
    </div>
  </div>
</template>

<style scoped lang="scss">
.el-card {
  display: block;
}

.el-image {
  display: block;
}

#ad_box {
  display: flex;
  justify-content: center;
  min-width: 100%;
  cursor: pointer;
}

#ad_pic {
  flex-grow: 2;
  margin-left: 10px;
}

#ad_text {
  display: flex;
  max-width: 15vw;
  flex-grow: 1;
  margin-left: 10px;
}

.ad_text {
  font-size: 0.6vw;
  line-height: 140%;
}

</style>