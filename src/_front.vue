<script setup lang="ts">
  import useConfigStore from "@/store/config"
  import Footer from "@/components/system/footer.vue"
  import Wechat from "@/components/system/wechat.vue"
  import Rightwin from "@/components/system/rightwin.vue"
  import Header from "@/components/system/header.vue"

  const configStore = useConfigStore()

  const headerDiv = ref()
  const footerDiv = ref()

  const showFooter = computed(() => configStore.config.footer && configStore.config.footer.length > 0)

  // header 10vh + 3px
  // footer 7vh + 3px
  const bodyHeight = computed(() => showFooter.value ? `calc(100vh - ${footerDiv.value.height}px - ${headerDiv.value.height}px)` : `calc(100vh - ${headerDiv.value.height}px)`)
  const bodyWidth = computed(() => "85vw")
  const bodyLittleWidth = computed(() => "60vw")
  const bodyMinWidth = computed(() => "35vw")
  const bodyMostMinWidth = computed(() => "20vw")
</script>

<template>
  <div id="home">
    <div class="header">
      <Header ref="headerDiv"></Header>
    </div>
    <div id="out_body">
      <el-scrollbar>
        <div id="body">
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
#home {
  --custom-height: v-bind(bodyHeight);
  --custom-width: v-bind(bodyWidth);
  --custom-little-width: v-bind(bodyLittleWidth);
  --custom-min-width: v-bind(bodyMinWidth);
  --custom-most-min-width: v-bind(bodyMostMinWidth);
}
</style>

<style scoped lang="scss">
  #home {
    width: 100%;
  }

  #out_body {
    display: flex;
    justify-content: center;

    min-height: #{var(--custom-height)};
    height: #{var(--custom-height)};
  }

  #body {
    display: flex;
    justify-content: center;

    width: #{var(--custom-width)};
    min-height: 0;
  }

  #logo {
    float: left;
  }

  .avatar_logo {
    height: 8vh;
    width: 8vh;
    margin: 0 0 0 0;
    vertical-align: middle;
  }

  .title {
    font-size: 5vh;
    font-weight: bold;
    margin-left: 10px;
    vertical-align: middle;
  }

  .subtitle {
    font-size: 1.8vh;
    font-weight: normal;
    margin-left: 5px;
    vertical-align: middle;
  }

  .title_box {
    padding-top: 1vh;
  }

  .extrainfo{
    font-size: 2vh;
    margin-right: 10px;
    vertical-align: middle;
  }
</style>
