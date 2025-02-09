<script setup lang="ts">
  import AdminWupinItem from '@/components/admin/adminwupinitem.vue'
  import { AdminWupin } from '#/admin/wupin'

  const props = defineProps({
    wp: {
      type: Array<AdminWupin>,
      required: true
    }
  })

  const wupinLst = computed(() => props.wp as AdminWupin[])
</script>

<template>
  <div class="classLst">
    <AdminWupinItem v-for="(item, j) in wupinLst" :key="j" :wp="item"> </AdminWupinItem>
  </div>
</template>

<style scoped lang="scss">
  .classLst {
    display: flex;
    flex-flow: wrap;
    justify-content: space-between;
  }
</style>
