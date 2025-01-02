<script setup lang="ts">
  import useConfigStore from '@/store/config'
  import { ElMessageBox } from 'element-plus'

  const configStore = useConfigStore()
  const showAD = computed(() => {
    return {
      pic: configStore.config.adpic || '',
      text: configStore.config.ad || '',
      header: configStore.config.adtitle || '',
      url: configStore.config.adurl || ''
    }
  })

  const adDiv = ref(null as HTMLElement | null)
  const height = ref(0)

  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
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
    showAD.value.url &&
      ElMessageBox.confirm('你是否要前往广告官网？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.open(showAD.value.url)
      })
  }
</script>

<template>
  <div v-if="showAD" id="ad_box" @click="onClickAD">
    <div id="ad_text">
      <el-card>
        <template #header>
          <el-text class="title">
            <el-text class="title title_ad">广告：</el-text>
            {{ showAD.header }}
          </el-text>
        </template>
        <el-text class="content">
          <p class="content_p">
            <el-text class="context_text"> {{ showAD.text }} </el-text>
          </p>
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

  .title {
    font-size: 1.5rem;
  }

  .title_ad {
    font-weight: bold;
  }

  .content {
    --content-font-size: 1rem;
    font-size: var(--content-font-size);
    text-indent: 2em;
    margin: 0;
  }

  .content_p {
    margin: 0;
  }

  .context_text {
    font-size: var(--content-font-size);
    line-height: 1.8em;
  }

  #ad_box {
    --ad-pic-max-height: 60vh;

    display: flex;
    justify-content: center;
    min-width: 100%;
    cursor: pointer;
  }

  #ad_pic {
    flex-grow: 2;
    margin-left: 10px;
    max-height: var(--ad-pic-max-height);
  }

  #ad_img {
    max-height: var(--ad-pic-max-height);
  }

  #ad_text {
    display: flex;
    max-width: 15vw;
    flex-grow: 1;
    margin-left: 10px;
  }
</style>
