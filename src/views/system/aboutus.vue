<script setup lang="ts">
import useConfigStore from "@/store/config"

const configStore = useConfigStore()
const router = useRouter()

const goHome = () => {
  router.push({
    path: "/shop/home",
  })
}

const goKefu = () => {
  router.push({
    path: "/system/kefu",
  })
}

</script>

<template>
  <div style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <el-card style="max-width: 75%; min-width: 30%; margin-top: 10px">
      <template #header>
        <el-text class="title">
          关于{{ configStore.config?.name ? configStore.config?.name : "我们" }}
        </el-text>
      </template>

      <el-text v-if="configStore.config?.aboutus" class="content">
        {{ configStore.config?.aboutus }}
      </el-text>
      <el-text v-else class="content">
        什么都没有留下...
      </el-text>

      <template #footer>
        <div style="display: flex; justify-content: right">
          <el-button-group>
            <el-button type="success" @click="goHome">返回首页</el-button>
            <el-button type="primary" @click="goKefu">我的客服</el-button>
          </el-button-group>
        </div>
      </template>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.title {
  margin-bottom: 5px;
  font-size: 0.8vw;
}

.content {
  font-size: 0.6vw;
}
</style>