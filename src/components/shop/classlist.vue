<script setup lang="ts">
  import ClassItem from "@/components/shop/classitem.vue"
  import {Class, apiGetClassLst} from "#/center/class";

  const classLst = ref([] as Class[])

  const getClass = () => {
    apiGetClassLst(50, 0).then((res) => {
      classLst.value = res.data.data.list as Class[]
    })
  }
  getClass()
</script>

<template>
  <div class="classLst">
    <ClassItem v-for="(item, j) in classLst" :key="j" :cl="item"> </ClassItem>
  </div>
</template>

<style scoped lang="scss">
.classLst {
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 5px;
}
</style>