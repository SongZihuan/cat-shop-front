<script setup lang="ts">
  import useConfigStore from '@/store/config'

  const configStore = useConfigStore()

  const footerDiv = ref(null as HTMLElement | null)
  const height = ref(0)

  const showFooter = computed(() => configStore.config.footer && configStore.config.footer.length > 0)

  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      console.log(
        'height',
        entry.contentRect.height,
        footerDiv.value != null,
        footerDiv.value && footerDiv.value.offsetHeight
      )
      height.value = entry.contentRect.height + 30
    })
  })

  onMounted(() => {
    if (showFooter && footerDiv.value) {
      resizeObserver.observe(footerDiv.value)
    }
  })

  defineExpose({
    height
  })
</script>

<template>
  <div v-if="showFooter">
    <div ref="footerDiv" class="outside">
      <div class="inner">
        <div class="box">
          <el-text class="txt">
            {{ configStore.config.footer }}
          </el-text>
        </div>
      </div>
    </div>
  </div>
  <div v-else></div>
</template>

<style scoped lang="scss">
  .outside {
    position: fixed;
    bottom: 0;
    width: 100%;
    margin-top: 30px;
  }

  .inner {
    display: flex;
    justify-content: center;
  }

  .txt {
    font-size: 0.7vw;
    color: black;
    margin-bottom: 5px;
    margin-top: 5px;
  }

  .box {
    display: flex;
    justify-content: center;

    min-width: min(calc(#{var(--custom-width)} + 5vw), 95vw);
    height: min(5vh, 3rem);

    background-color: rgb(240, 240, 240);
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    box-shadow: 4px -5px rgba(0, 0, 0, 0.3);
  }
</style>
