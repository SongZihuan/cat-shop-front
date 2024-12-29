<script setup lang="ts">
  import ClassItem from "@/components/shop/classitem.vue"
  import {Class, apiGetClassLst} from "#/center/class";

  const props = defineProps({
    "height": {
      type: Number || String,
      required: true
    },
  })

  const classLst = ref([] as Class[])

  const getClass = () => {
    apiGetClassLst(50, 0).then((res) => {
      classLst.value = res.data.data.list as Class[]
    })
  }
  getClass()
</script>

<template>
  <el-scrollbar :height="props.height">
    <div class="classLst">
      <ClassItem v-for="(item, j) in classLst" :key="j" :item="item"> </ClassItem>
    </div>
  </el-scrollbar>
</template>

<style scoped lang="scss">
.classLst {
  display: flex;
  flex-flow: wrap;
  justify-content: flex-start;
  gap: 5px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 5px;
}
</style>