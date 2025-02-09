import { Router } from 'vue-router'

const usePathStore = defineStore('pathStore', () => {
  const pathStack = ref(0 as number)

  const pushPath = () => {
    pathStack.value++
    return Promise.resolve()
  }

  const isSafeBack = computed(() => {
    return pathStack.value > 1 // 等于1表示剩下当前的页面是站内的第一个页面
  })

  const backPath = (router: Router) => {
    pathStack.value--
    pathStack.value-- // 需要减2次，因为会触发pushPath
    router.back()
  }

  return {
    pathStack,
    pushPath,
    isSafeBack,
    backPath
  }
})

export default usePathStore
