<script setup lang="ts">
  import ClassItem from '@/components/shop/classitem.vue'
  import { Class, apiGetClassLst } from '#/center/class'

  const props = defineProps({
    height: {
      type: Number || String,
      required: true
    }
  })

  const classLst = ref([] as Class[])

  const getClass = () => {
    apiGetClassLst().then((res) => {
      classLst.value = res.data.data.list as Class[]
    })
  }
  getClass()

  const maxWidth = ref('0')
  const maxBtn = ref(0)
  const boxWidth = ref(0)
  const count = ref(0)
  const getMaxWidth = () => {
    const classChild = document.querySelectorAll('.components-shop-classitem-item')
    classChild.forEach((i: Element) => {
      const element: HTMLElement = i as unknown as HTMLElement
      console.log('element.offsetWidth', element.offsetWidth)
      if (element.offsetWidth + 20 > maxBtn.value) {
        maxBtn.value = element.offsetWidth + 20
      }
    })

    if (classBox.value) {
      boxWidth.value = classBox.value.offsetWidth
      count.value = Math.floor(boxWidth.value / maxBtn.value)
      maxWidth.value = boxWidth.value / count.value + 'px'
    }
  }

  onMounted(() => {
    getMaxWidth()
  })

  onUpdated(() => {
    getMaxWidth()
  })

  const classBox = ref<HTMLElement>()
</script>

<template>
  <el-scrollbar :height="props.height">
    <div ref="classBox" class="classLst">
      <div v-for="(item, j) in classLst" :key="j" class="classItem">
        <ClassItem :item="item"> </ClassItem>
      </div>
    </div>
  </el-scrollbar>
</template>

<style scoped lang="scss">
  .classLst {
    display: flex;
    flex-flow: wrap;
    justify-content: flex-start;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 5px;
  }

  .classItem {
    width: calc(v-bind(maxWidth) - 5px);
  }
</style>
