<script setup lang="ts">
  import useConfigStore from '@/store/config'
  import useUserStore, { isLogin } from '@/store/user'
  import useHotWupinStore from '@/store/hotwupin'
  import { clearPlaceholderLoading, placeholderLoading } from '@/utils/placeholder-loading'

  placeholderLoading()
  onMounted(() => {
    clearPlaceholderLoading()
  })

  const configStore = useConfigStore()
  const userStore = useUserStore()
  const hotWupinStore = useHotWupinStore()

  configStore.updateConfig()
  configStore.updateXieyi()
  isLogin() && userStore.updateInfo()
  hotWupinStore.updateInfo()

  const fn1 = (t: number) => {
    Promise.all([configStore.updateConfig(), configStore.updateXieyi()]).finally(() => {
      setTimeout(() => fn1(t), t)
    })
  }

  const fn2 = (t: number) => {
    if (isLogin()) {
      userStore.updateInfo().finally(() => {
        setTimeout(() => fn2(t), t)
      })
    }
  }

  const fn3 = (t: number) => {
    hotWupinStore.updateInfo().finally(() => {
      setTimeout(() => fn3(t), t)
    })
  }
  setTimeout(() => fn3(900000), 900000) // 10分

  fn1(21000000)
  fn2(900000)
  fn3(900000)

  const setLogo = () => {
    if (!configStore.config.icon) {
      return
    }

    let s = document.querySelector('link[rel="icon"]')
    if (!s) {
      s = document.createElement('link')
      s.setAttribute('rel', 'icon')
    }
    s.setAttribute('href', configStore.config.icon)
  }
  watch(() => configStore.config.icon, setLogo)
  setLogo()
</script>

<template>
  <router-view></router-view>
</template>

<style scoped lang="scss"></style>
