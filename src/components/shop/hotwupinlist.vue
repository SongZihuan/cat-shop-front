<script setup lang="ts">
  import WupinItem from '@/components/shop/wupinitem.vue'
  import useHotWupinStore from '@/store/hotwupin'

  const hotWupinStore = useHotWupinStore()
  hotWupinStore.getLst()
</script>

<template>
  <div class="classLst">
    <WupinItem v-for="(item, j) in hotWupinStore.wupinLst" :key="j" :wp="item"> </WupinItem>
  </div>
</template>

<style scoped lang="scss">
  .classLst {
    display: flex;
    flex-flow: wrap;
    justify-content: flex-start;
    gap: 10px;
  }
</style>
