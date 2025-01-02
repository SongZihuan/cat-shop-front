<script setup lang="ts">
  import HeaderAdmin from '@/components/system/headeradmin.vue'
  import HeaderCenter from '@/components/system/headercenter.vue'
  const route = useRoute()

  const isAdmin = computed(() => {
    return route.meta?.admin === true || route.meta?.rootAdmin === true
  })

  const headerDiv = ref(null as HTMLElement | null)
  const height = ref(0)

  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      height.value = entry.contentRect.height + 5
    })
  })

  onMounted(() => {
    if (headerDiv.value) {
      resizeObserver.observe(headerDiv.value)
    }
  })

  defineExpose({
    height
  })
</script>

<template>
  <div ref="headerDiv" class="outside">
    <div class="header_box">
      <HeaderAdmin v-if="isAdmin"></HeaderAdmin>
      <HeaderCenter v-else></HeaderCenter>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .header_box {
    height: 10vh;
    max-height: 10vh;
    min-height: 10vh;
    padding-bottom: 5px;
    background-color: rgba(0, 0, 0, 0);
  }
</style>
