<script setup lang="ts">
  import useConfigStore from '@/store/config'
  import Footer from '@/components/system/footer.vue'
  import Wechat from '@/components/system/wechat.vue'
  import Rightwin from '@/components/system/rightwin.vue'
  import Header from '@/components/system/header.vue'

  const configStore = useConfigStore()

  const headerDiv = ref()
  const footerDiv = ref()

  const showFooter = computed(() => configStore.config.footer && configStore.config.footer.length > 0)

  // header 10vh + 3px
  // footer 7vh + 3px
  const bodyHeight = computed(() =>
    showFooter.value
      ? `calc(100vh - ${footerDiv.value.height}px - ${headerDiv.value.height}px - 3px)`
      : `calc(100vh - ${headerDiv.value.height}px - 3px)`
  )
</script>

<template>
  <div id="front_home">
    <div id="front_header">
      <Header ref="headerDiv"></Header>
    </div>
    <div id="front_out_body">
      <el-scrollbar class="front_scroll" :tabindex="1">
        <div id="front_body">
          <slot></slot>
        </div>
      </el-scrollbar>
    </div>
    <div v-if="showFooter">
      <Footer ref="footerDiv"></Footer>
    </div>
  </div>
  <Rightwin></Rightwin>
  <Wechat></Wechat>
</template>

<style lang="scss">
  #front_home {
    --custom-height: v-bind(bodyHeight);
    --custom-width: 85vw;
    --custom-little-width: 60vw;
    --custom-min-width: 35vw;
    --custom-most-min-width: 20vw;
  }
</style>

<style scoped lang="scss">
  #front_home {
    width: 100%;
  }

  #front_out_body {
    display: flex;
    justify-content: center;

    max-height: #{var(--custom-height)};
    height: #{var(--custom-height)};
  }

  .front_scroll {
    display: flex;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  #front_body {
    display: flex;
    justify-content: center;

    width: #{var(--custom-width)};
    min-height: 0;
  }
</style>
