<script setup lang="ts">
  import { Wupin } from '@/store/hotwupin'
  import { getFacePrice, getRealPrice } from '@/utils/price'

  const props = defineProps({
    wp: {
      type: Object as PropType<Wupin>,
      required: true
    }
  })
  const item = computed(() => props.wp)
  const router = useRouter()

  const onClick = () => {
    router.push({
      path: '/user/shop/wupin',
      query: {
        wupinId: item.value?.id || 0
      }
    })
  }

  const realPrice = computed(() => {
    return getRealPrice(item.value?.realPrice)
  })
  const facePrice = computed(() => {
    return getFacePrice(item.value?.hotPrice, item.value?.realPrice)
  })
</script>

<template>
  <el-card class="WupinItem">
    <template #header>
      <div style="display: flow-root">
        <div style="float: left">
          <el-text class="WupinTitle">
            {{ item.name }}
          </el-text>
        </div>
        <div v-if="item.classId && item.classOf && item.classId > 1" style="float: right">
          <el-text class="WupinTitle">
            {{ item.classOf.name }}
          </el-text>
        </div>
      </div>
    </template>
    <div class="WupinItemPic">
      <el-image :src="item.pic" />
    </div>
    <template #footer>
      <div style="display: flow-root">
        <el-text v-if="facePrice == 0" class="hotprice"> 免费抢购 </el-text>
        <el-text v-if="facePrice < realPrice" class="hotprice"> 促销：￥{{ (facePrice / 100).toFixed(2) }} </el-text>
        <el-text v-else-if="facePrice > realPrice" class="hotprice">
          冤种：￥{{ (facePrice / 100).toFixed(2) }}
        </el-text>
        <el-text v-else-if="facePrice == realPrice" class="baseprice">
          售价：￥{{ (realPrice / 100).toFixed(2) }}
        </el-text>
        <el-text v-else-if="realPrice == 0" class="hotprice"> 冤种：￥{{ (facePrice / 100).toFixed(2) }} </el-text>
        <el-tag v-if="item.tag" type="primary" class="hottag">
          {{ item.tag }}
        </el-tag>
        <div style="float: right; display: inline">
          <el-button class="btn" @click="onClick">查看详情</el-button>
        </div>
      </div>
    </template>
  </el-card>
</template>

<style scoped lang="scss">
  .WupinItem {
    width: calc(25% - 20px);
    max-height: 50wh;
    min-height: 30wh;
  }

  .WupinItemPic {
    display: flex;
    justify-content: center;
    align-content: center;
  }

  .WupinTitle {
    font-size: 2vh;
    margin: 0 0 0 0;
  }

  .hotprice {
    font-size: 2vh;
    color: red;
    font-weight: bold;
    vertical-align: middle;
    margin-right: 10px;
  }

  .baseprice {
    font-size: 2vh;
    color: black;
    font-weight: bold;
    vertical-align: middle;
    margin-right: 10px;
  }

  .hottag {
    font-size: 1.5vh;
    color: red;
    font-weight: bold;
    vertical-align: middle;
    margin-right: 10px;
  }

  .btn {
    margin-left: 10px;
    vertical-align: middle;
  }
</style>
