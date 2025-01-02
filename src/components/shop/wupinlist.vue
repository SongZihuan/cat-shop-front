<script setup lang="ts">
  import WupinItem from '@/components/shop/wupinitem.vue'
  import { Wupin } from '@/store/hotwupin'

  const props = defineProps({
    wp: {
      type: Array<Wupin>,
      required: true
    }
  })

  const wupinLst = computed(() => props.wp as Wupin[])
</script>

<template>
  <div class="classLst">
    <WupinItem v-for="(item, j) in wupinLst" :key="j" :wp="item"> </WupinItem>
  </div>
</template>

<style scoped lang="scss">
  .classLst {
    display: flex;
    flex-flow: wrap;
    justify-content: space-between;
    gap: 10px;
  }
</style>
