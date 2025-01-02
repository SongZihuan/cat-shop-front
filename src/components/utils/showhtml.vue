<script setup lang="ts">
  import 'normalize.css'

  const props = defineProps({
    content: {
      type: String,
      required: true
    }
  })

  const content = computed(() => props.content)
</script>

<template>
  <div>
    <div v-html="content"></div>
  </div>
</template>

<style scoped lang="scss"></style>
