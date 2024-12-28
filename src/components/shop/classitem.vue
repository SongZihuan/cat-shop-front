<script setup lang="ts">
  import useClassStore, { Class } from "@/store/class"

  const props = defineProps({
    "cl": {
      type: Object as PropType<Class>,
      required: true,
    }
  })
  const item = computed(() => props.cl)
  const router = useRouter()
  const classStore = useClassStore()

  const onClickClass = () => {
    router.push({
      path: "/shop/search",
      query: {
        "info": JSON.stringify({
          select: [item.value?.id || classStore.allClass.id],
          search: "",
        })
      }
    })
  }
</script>

<template>
  <div>
    <el-button class="classItem" size="large" text @click="onClickClass">
      <el-text tag="ins">
        {{ item.name }}
      </el-text>
    </el-button>
  </div>
</template>

<style scoped lang="scss">

.el-button {
  margin: 2px 2px 2px 2px;
}

</style>