<script setup lang="ts"></script>

<template>
  <div class="rightwin">
    <div class="box">
      <el-text class="box_text"> 非常感谢您对我们的支持，喵喵喵~ </el-text>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .rightwin {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background-color: #2448aa;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .box {
    padding: 5px;
  }

  .box_text {
    font-size: 2.3vh;
    color: white;
    writing-mode: vertical-lr;
  }
</style>
