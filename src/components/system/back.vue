<script setup lang="ts">
  import usePathStore from '@/store/path'

  const pathStore = usePathStore()
  const router = useRouter()
  const onClick = () => {
    pathStore.backPath(router)
  }
</script>

<template>
  <div v-if="pathStore.isSafeBack" class="back back_btn" @click="onClick">
    <div class="back_box">
      <el-text class="back_box_text">
        <el-icon><DArrowLeft /></el-icon>
        返回
      </el-text>
    </div>
  </div>
  <div v-else></div>
</template>

<style scoped lang="scss">
  .back {
    position: fixed;
    left: 0;
    top: 20%;
    transform: translateY(-50%);
    background-color: coral;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    cursor: pointer;
  }

  .back_box {
    padding: 5px;
  }

  .back_box_text {
    font-size: 1.5vh;
    color: white;
    writing-mode: vertical-lr;
  }

  .back:active {
    background-color: rgb(67, 150, 202);
    color: white;
  }

  .back:focus {
    background-color: rgb(67, 150, 202);
    color: white;
  }
</style>
