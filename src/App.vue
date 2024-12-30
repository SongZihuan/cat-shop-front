<script setup lang="ts">
  import useConfigStore from "@/store/config"
  import Footer from "@/components/system/footer.vue"
  import Wechat from "@/components/system/wechat.vue"
  import Rightwin from "@/components/system/rightwin.vue"
  import Header from "@/components/system/header.vue"
  import useUserStore, {isLogin} from "@/store/user"
  import useHotWupinStore from "@/store/hotwupin"
  import {clearPlaceholderLoading, placeholderLoading} from '@/utils/placeholder-loading'

  placeholderLoading()
  onMounted(() => {
    clearPlaceholderLoading()
  })

  const route = useRoute()
  const configStore = useConfigStore()
  const userStore = useUserStore()
  const hotWupinStore = useHotWupinStore()

  configStore.updateConfig()
  configStore.updateXieyi()
  isLogin() && userStore.updateInfo()
  hotWupinStore.updateInfo()

  const fn1 = (t: number) => {
    Promise.all(
        [
          configStore.updateConfig(),
          configStore.updateXieyi(),
        ]
    ).finally(() => {
      setTimeout(() => fn1(t), t)
    })
  }
  setTimeout(() => fn1(21000000), 21000000)// 35分

  const fn2 = (t: number) => {
    if (isLogin()) {
      userStore.updateInfo().finally(() => {
        setTimeout(() => fn2(t), t)
      })
    }
  }
  setTimeout(() => fn2(900000), 900000)// 10分

  const fn3 = (t: number) => {
      hotWupinStore.updateInfo().finally(() => {
        setTimeout(() => fn3(t), t)
      })
  }
  setTimeout(() => fn3(900000), 900000)// 10分

  const setLogo = () => {
    if (!configStore.config.icon) {
      return
    }

    let s = document.querySelector('link[rel="icon"]')
    if (!s) {
      s = document.createElement('link')
      s.setAttribute('rel', "icon")
    }
    s.setAttribute('href', configStore.config.icon)
  }
  watch(() => configStore.config.icon, setLogo)
  setLogo()

  const headerDiv = ref()
  const footerDiv = ref()

  const isAdmin = computed(() => route.meta?.admin === true || route.meta?.rootAdmin === true)
  const showFooter = computed(() => !isAdmin.value && configStore.config.footer && configStore.config.footer.length > 0)

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
      <div id="body">
        <router-view></router-view>
      </div>
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
    overflow: auto; /* 如果内部内容超过100px，添加滚动条以查看多余内容 */
    position: relative; /* 为绝对定位的子元素提供定位上下文 */
  }

  #body {
    position: absolute;

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
