<script setup lang="ts">
  import Showxieyi from '@/components/utils/showxieyi.vue'
  import useConfigStore from '@/store/config'

  const emits = defineEmits(['confirm'])

  const configStore = useConfigStore()
  const xieyi = computed(() => configStore.xieyi)

  const visibility = ref(false)
  const open = () => {
    visibility.value = true
  }

  const close = () => {
    visibility.value = false
  }

  const userConfirm = (res: boolean) => {
    close()
    emits('confirm', res)
  }

  defineExpose({
    open,
    close
  })
</script>

<template>
  <el-dialog v-model="visibility" width="53vw">
    <div style="display: flex; justify-content: center">
      <Showxieyi title="用户协议" :content="xieyi" @confirm="userConfirm"></Showxieyi>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
