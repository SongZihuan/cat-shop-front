<script setup lang="ts">
  import useConfigStore from '@/store/config'

  const configStore = useConfigStore()
  const router = useRouter()

  const goHome = () => {
    router.push({
      path: '/user/shop/home'
    })
  }

  const goKefu = () => {
    router.push({
      path: '/system/kefu'
    })
  }
</script>

<template>
  <el-card class="base_card">
    <template #header>
      <el-text class="title"> 关于{{ configStore.config?.name ? configStore.config?.name : '我们' }} </el-text>
    </template>

    <el-text v-if="configStore.config?.aboutus" class="content">
      {{ configStore.config?.aboutus }}
    </el-text>
    <el-text v-else class="content"> 什么都没有留下... </el-text>

    <template #footer>
      <div style="display: flex; justify-content: right">
        <el-button-group>
          <el-button type="success" @click="goHome">返回首页</el-button>
          <el-button type="primary" @click="goKefu">我的客服</el-button>
        </el-button-group>
      </div>
    </template>
  </el-card>
</template>

<style scoped lang="scss">
  .base_card {
    --base-card-height: #{var(--custom-height)};
    --base-card-width: #{var(--custom-little-width)};
    --base-card-min-width: #{var(--custom-min-width)};
    max-width: #{var(--base-card-width)};
    min-width: var(--base-card-min-width);
  }

  .title {
    margin-bottom: 5px;
    font-size: 0.8vw;
  }

  .content {
    font-size: 0.6vw;
  }
</style>
