<script setup lang="ts">
  import ClassLst from '@/components/shop/classlist.vue'
  import Search from '@/components/shop/search.vue'
  import Ad from '@/components/shop/ad.vue'
  import Hotwupinlist from '@/components/shop/hotwupinlist.vue'

  const adDiv = ref(null as any)
  const adHeight = computed(() => (adDiv.value ? adDiv.value.height : 0))
</script>

<template>
  <div class="outside">
    <div>
      <div class="search">
        <Search></Search>
      </div>
      <div class="ad_class_box">
        <div class="ad_box">
          <Ad ref="adDiv"></Ad>
        </div>
        <div class="class_box">
          <ClassLst :height="adHeight" style="width: 100%"></ClassLst>
        </div>
      </div>
    </div>
    <div class="hotlst">
      <Hotwupinlist></Hotwupinlist>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .outside {
    display: flex;
    flex-direction: column; /* 竖直排列 */
    align-items: center; /* 水平居中 */
  }

  .search {
    width: #{var(--custom-little-width)};
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .ad_class_box {
    width: #{var(--custom-little-width)};
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .hotlst {
    width: #{var(--custom-width)};
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .ad_box {
    width: calc(65% - 3px);
    margin-left: 3px;
  }

  .class_box {
    width: calc(35% - 3px);
    margin-right: 3px;
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

  .extrainfo {
    font-size: 2vh;
    margin-right: 10px;
    vertical-align: middle;
  }
</style>
