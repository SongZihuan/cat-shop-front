<script setup lang="ts">
  import { Class } from "#/center/class"

  const props = defineProps({
    "item": {
      type: Object as PropType<Class>,
      required: true,
    }
  })
  const item = computed(() => props.item)
  const router = useRouter()

  const onClickClass = () => {
    router.push({
      path: "/shop/search",
      query: {
        "info": JSON.stringify({
          select: item.value?.id || 0,
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

.classItem {
  margin: 2px 2px 2px 2px;
}

</style>