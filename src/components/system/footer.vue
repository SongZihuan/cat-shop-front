<script setup lang="ts">
import useConfigStore from "@/store/config"

const route = useRoute()
const configStore = useConfigStore()

const footerDiv = ref(null as HTMLElement | null)
const height = ref(0)

const isAdmin = computed(() => route.meta?.admin === true || route.meta?.rootAdmin === true)
const showFooter = computed(() => !isAdmin.value && configStore.config.footer && configStore.config.footer.length > 0)

const resizeObserver = new ResizeObserver((entries) => {
  entries.forEach(entry => {
    height.value = entry.contentRect.height + 5
  })
})

onMounted(() => {
  if (showFooter && footerDiv.value) {
    resizeObserver.observe(footerDiv.value)
  }
})

defineExpose({
  height
})

</script>

<template>
<div v-if="showFooter" ref="footerDiv">
  <div class="outside">
    <div class="box">
      <el-text class="txt">
        {{ configStore.config.footer }}
      </el-text>
    </div>
  </div>
</div>
<div v-else></div>
</template>

<style scoped lang="scss">
.outside {
  display: flex;
  justify-content: center;
  height: 7vh;
  width: 100%;
  padding-top: 15px;
  background-color: rgba(0, 0, 0, 0);
}

.txt {
  font-size: 0.7vw;
  color: black;
  margin-bottom: 5px;
  margin-top: 5px;
}

.box {
  display: flex;
  justify-content: center;

  min-width: 30vw;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 2px;
  background-color: rgba(255, 255, 255, 0.8);
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  box-shadow: 4px -2px rgba(0, 0, 0, 0.3)
}

</style>