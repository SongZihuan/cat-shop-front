<script setup lang="ts">
  import Showhtml from '@/components/utils/showhtml.vue'

  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    preview: {
      type: Boolean,
      required: false,
      default: false
    },
    footer: {
      type: Boolean,
      required: false,
      default: false
    }
  })

  const title = computed(() => props.title)
  const content = computed(() => props.content)
  const hasFooter = computed(() => props.footer)
  const preview = computed(() => props.footer || props.preview)

  const emits = defineEmits(['confirm'])

  const onOk = () => {
    emits('confirm', true)
  }

  const onNotOk = () => {
    emits('confirm', false)
  }
</script>

<template>
  <el-card class="card_box">
    <template #header>
      <div class="header_box">
        <el-text class="title">
          {{ title }}
        </el-text>
      </div>
    </template>
    <div class="info_box">
      <el-scrollbar>
        <div class="inner_box">
          <div class="inner_html_box">
            <Showhtml :content="content"></Showhtml>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <template v-if="hasFooter" #footer>
      <slot></slot>
    </template>
    <template v-else-if="!preview" #footer>
      <div class="footer_box">
        <el-button-group>
          <el-button size="large" type="success" plain @click="onOk"> 同意 </el-button>
          <el-button size="large" type="warning" plain @click="onNotOk"> 拒绝 </el-button>
        </el-button-group>
      </div>
    </template>
  </el-card>
</template>

<style scoped lang="scss">
  .card_box {
    width: 50vw;
    height: auto;
  }

  .header_box {
    display: flex;
    justify-content: center;
  }

  .info_box {
    width: 100%;
    height: 50vh;
  }

  .inner_box {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .inner_html_box {
    width: 98%;
  }

  .title {
    font-size: 1.5rem;
  }

  .footer_box {
    display: flex;
    justify-content: center;
  }
</style>
