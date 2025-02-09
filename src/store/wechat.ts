const useWechatStore = defineStore('wechatStore', () => {
  const show = ref(true)
  const close = () => {
    show.value = false
  }
  const open = () => {
    show.value = true
  }
  return {
    show,
    close,
    open
  }
})

export default useWechatStore
