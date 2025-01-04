<script setup lang="ts">
  import 'normalize.css'
  import { Editor as WangEditor, Toolbar as WangToolbar } from '@wangeditor/editor-for-vue'
  import { IToolbarConfig } from '@wangeditor/editor'
  import { IEditorConfig } from '@wangeditor/editor'
  import '@wangeditor/editor/dist/css/style.css'
  import { apiAdminPostUploadImageUrl, apiAdminPostUploadVideoUrl } from '#/admin/file'
  import { getXtoken } from '@/store/user'

  const props = defineProps({
    modelValue: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: false,
      default: '请输入...'
    },
    type: {
      type: String,
      required: true
    }
  })

  const emits = defineEmits(['update:modelValue'])

  const editorRef = shallowRef()
  const toolbarConfig: Partial<IToolbarConfig> = {}
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: props.placeholder,
    MENU_CONF: {
      uploadImage: {
        server: apiAdminPostUploadImageUrl(),
        fieldName: 'image',
        maxFileSize: 2 * 1024 * 1024,
        headers: {
          'X-Token': getXtoken(),
          Accept: 'application/json'
        },
        meta: {
          type: props.type
        }
      },
      uploadVideo: {
        server: apiAdminPostUploadVideoUrl(),
        fieldName: 'video',
        maxFileSize: 10 * 1024 * 1024,
        headers: {
          'X-Token': getXtoken(),
          Accept: 'application/json'
        },
        meta: {
          type: props.type
        }
      }
    }
  }

  const editorMode = ref('default')

  const handleEditCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
  }

  const content = ref(props.modelValue as string)

  watch(
    () => props.modelValue,
    () => {
      content.value = props.modelValue
    }
  )

  watch(
    () => content.value,
    () => {
      emits('update:modelValue', content.value)
    }
  )

  const editorBoxDiv = ref(null as HTMLElement | null)
  const height = ref(0)

  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      height.value = entry.contentRect.height + 5
    })
  })

  onMounted(() => {
    if (editorBoxDiv.value) {
      resizeObserver.observe(editorBoxDiv.value)
    }
  })

  onBeforeUnmount(() => {
    editorRef.value && editorRef.value.destroy()
  })

  defineExpose({
    height
  })
</script>

<template>
  <div id="editorBox" ref="editorBoxDiv">
    <WangToolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="editorMode"
    />
    <!-- eslint-disable vue/v-on-event-hyphenation -->
    <WangEditor
      v-model="content"
      style="height: 80%; overflow-y: hidden"
      :default-config="editorConfig"
      :mode="editorMode"
      @onCreated="handleEditCreated"
    />
    <!-- eslint-enable vue/v-on-event-hyphenation -->
  </div>
</template>

<style scoped lang="scss">
  #editorBox {
    border-style: solid;
    border-width: 1px;
    border-color: black;
    width: min(98%, 50vw);
    height: calc(#{var(--custom-height)} * 0.6);
  }
</style>
