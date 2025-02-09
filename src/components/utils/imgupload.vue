<script setup lang="ts">
  import Fileupload from '@/components/utils/fileupload.vue'
  import { UploadFile } from 'element-plus'

  const props = defineProps({
    accept: {
      type: String,
      required: false,
      default: '.jpg,.jpeg,.png'
    },
    maxsizekb: {
      type: Number,
      required: false,
      default: 500
    },
    default: {
      type: String,
      required: false,
      default: ''
    }
  })

  const accept = computed(() => props.accept)
  const maxsizekb = computed(() => props.maxsizekb)
  const defaultPic = computed(() => props.default)

  const pictureUpload = ref()
  const newPic = computed(() => pictureUpload.value && pictureUpload.value.pic)

  const hasPic = computed(() => newPic.value || defaultPic.value)

  const deletePicture = () => {
    return pictureUpload.value.pic && pictureUpload.value.deletePicture()
  }

  const updatePicture = (pic: UploadFile) => {
    return pictureUpload.value.pic && pictureUpload.value.updatePicture(pic)
  }

  const picUrl = ref('')
  const openPic = () => {
    if (newPic.value) {
      picUrl.value = URL.createObjectURL((newPic.value as any).raw)
    } else if (defaultPic.value) {
      picUrl.value = defaultPic.value
    }
  }

  const closePic = () => {
    picUrl.value = ''
  }

  defineExpose({
    deletePicture,
    updatePicture,
    pic: newPic,
    openPic,
    closePic
  })
</script>

<template>
  <el-button-group>
    <el-button :disabled="!newPic" type="danger" @click="deletePicture"> 删除 </el-button>
    <el-button :disabled="!hasPic" type="success" @click="openPic"> 预览 </el-button>
    <Fileupload ref="pictureUpload" :accept="accept" :maxsizekb="maxsizekb"></Fileupload>
  </el-button-group>
  <Showimg v-model="picUrl"></Showimg>
</template>

<style scoped lang="scss"></style>
