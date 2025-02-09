<script setup lang="ts">
  const props = defineProps({
    modelValue: {
      type: String,
      required: true
    }
  })

  const emits = defineEmits(['update:modelValue'])

  const showPic = ref(false)
  const picUrl = computed(() => props.modelValue)
  watch(
    () => picUrl.value,
    () => {
      showPic.value = picUrl.value.length !== 0
    }
  )

  watch(
    () => showPic.value,
    () => {
      if (!showPic.value) {
        console.log('STOP')
        emits('update:modelValue', '')
      }
    }
  )

  const close = () => {
    showPic.value = false
  }
</script>

<template>
  <el-dialog v-model="showPic" class="img_dialog" destroy-on-close>
    <div class="img_box">
      <el-image class="img_box_img" fit="contain" :src="picUrl" />
    </div>

    <template #footer>
      <div class="img_box_footer">
        <el-button type="success" @click="close"> 关闭 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
  .img_box {
    display: flex;
    justify-content: center;
    max-height: 50vh;
    max-width: 50vw;
  }

  .img_box_img {
    min-height: 0;
    min-width: 0;
    max-height: 100%;
    max-width: 100%;
  }

  .img_box_footer {
    display: flex;
    justify-content: right;
  }
</style>
