<script setup lang="ts">
  import Header from "@/components/system/header.vue"

  const headerDiv = ref()

  // header 10vh + 3px
  const bodyHeight = computed(() => `calc(100vh - ${headerDiv.value.height}px)`)
  const bodyWidth = computed(() => "98vw")
  const bodyMenuWidth = computed(() => "13vw")
</script>

<template>
  <div id="home">
    <div class="header">
      <Header ref="headerDiv"></Header>
    </div>
    <div id="out_body">
      <div id="body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#home {
  --custom-height: v-bind(bodyHeight);
  --custom-width: v-bind(bodyWidth);
  --custom-menu-width: v-bind(bodyMenuWidth);
  --custom-body-width: calc(#{var(--custom-width)} - #{var(--custom-menu-width)});
}
</style>

<style scoped lang="scss">
  #home {
    width: 100%;
  }

  #out_body {
    display: flex;
    justify-content: center;

    height: #{var(--custom-height)};
    max-height: #{var(--custom-height)};
  }

  #body {
    display: flex;
    justify-content: center;

    width: #{var(--custom-width)};
    min-height: 0;
  }

  #logo {
    float: left;
  }

  .avatar_logo {
    height: 8vh;
    width: 8vh;
    margin: 0 0 0 0;
    vertical-align: middle;
  }

  .title {
    font-size: 5vh;
    font-weight: bold;
    margin-left: 10px;
    vertical-align: middle;
  }

  .subtitle {
    font-size: 1.8vh;
    font-weight: normal;
    margin-left: 5px;
    vertical-align: middle;
  }

  .title_box {
    padding-top: 1vh;
  }

  .extrainfo{
    font-size: 2vh;
    margin-right: 10px;
    vertical-align: middle;
  }
</style>
