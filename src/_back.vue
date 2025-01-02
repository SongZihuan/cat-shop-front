<script setup lang="ts">
  import Header from '@/components/system/header.vue'

  const headerDiv = ref()

  // header 10vh + 3px
  const bodyHeight = computed(() => `calc(100vh - ${headerDiv.value.height}px - 7px)`)
</script>

<template>
  <div id="back_home">
    <div id="back_header">
      <Header ref="headerDiv"></Header>
    </div>
    <div id="back_out_body">
      <div id="back_body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  #back_home {
    --custom-height: max(calc(90vh - 10px), v-bind(bodyHeight));
    --custom-width: 98vw;
    --custom-menu-width: 13vw;
    --custom-body-width: calc(#{var(--custom-width)} - #{var(--custom-menu-width)});
  }
</style>

<style scoped lang="scss">
  #back_home {
    width: 100%;
  }

  #back_out_body {
    display: flex;
    justify-content: center;

    height: #{var(--custom-height)};
    max-height: #{var(--custom-height)};
  }

  #back_body {
    display: flex;
    justify-content: center;

    width: #{var(--custom-width)};
    min-height: 0;
  }
</style>
