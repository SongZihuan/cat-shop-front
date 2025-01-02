<script setup lang="ts">
  import { ElMessage, ElMessageBox, genFileId, type UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
  import pushTo from '@/views/admin/router_push'
  import { isAdmin } from '@/store/admin'
  import { isEmail, isMobile } from '@/utils/str'
  import { AdminWupin, AdminWupinBase, apiAdminGetWupin, apiAdminPostUpdateWupin } from '#/admin/wupin'
  import { AdminClass, apiAdminGetClassLst } from '#/admin/class'
  import { Edit } from '@element-plus/icons-vue'
  import Editor from '@/components/utils/editor.vue'
  import { UploadFile } from 'element-plus'

  const router = useRouter()
  const route = useRoute()

  if (!isAdmin()) {
    router.push({
      path: '/system/error',
      query: {
        msg: '页面错误'
      }
    })
  }

  const toBack = () => {
    pushTo(router, route, '/admin/wupin/list')
  }

  const wupinId = ref(0)
  const wupin = ref(null as AdminWupin | null)
  const defaultClass = ref({} as AdminClass)

  const onChangeWupin = () => {
    wupinId.value = Number(route.query?.wupinId).valueOf() || 0
    wupin.value = null

    if (wupinId.value) {
      apiAdminGetWupin(wupinId.value).then(
        (res) => {
          wupin.value = res.data.data as AdminWupin
          form.value = {
            name: wupin.value.name,
            pic: wupin.value.pic,
            classId: wupin.value.classId,
            tag: wupin.value.tag,
            hotPrice: wupin.value.hotPrice,
            realPrice: wupin.value.realPrice,
            info: wupin.value.info,
            ren: wupin.value.ren,
            phone: wupin.value.phone,
            email: wupin.value.email,
            wechat: wupin.value.wechat,
            location: wupin.value.location,
            hot: wupin.value.hot,
            down: wupin.value.down
          }

          defaultClass.value = wupin.value.classOf
          onClassLstChange()

          if (wupin.value.hotPrice) {
            hotPrice.value = (Number(wupin.value.hotPrice).valueOf() / 100).toFixed(2)
          } else {
            hotPrice.value = ''
          }

          if (wupin.value.realPrice) {
            realPrice.value = (Number(wupin.value.realPrice).valueOf() / 100).toFixed(2)
          } else {
            realPrice.value = '0.00'
          }
        },
        () => {
          toBack()
        }
      )
    } else {
      toBack()
    }
  }

  watch(() => route.query?.wupinId, onChangeWupin)
  onChangeWupin()

  const classLst = ref([] as AdminClass[])
  const classLstPage = ref(1)
  const classLstMaxPage = ref(0)
  const classLstPagesize = ref(20)

  const onClassLstChange = () => {
    apiAdminGetClassLst(classLstPage.value, classLstPagesize.value).then((res) => {
      classLstMaxPage.value = res.data.data.maxcount
      classLst.value = res.data.data.list

      if (classLst.value.every((item) => item.id !== form.value.classId)) {
        ;(form.value as any).classId = undefined
      }
    })
  }

  const form = ref({
    name: '',
    pic: '',
    classId: 0,
    tag: '',
    hotPrice: 0,
    realPrice: 0,
    info: '',
    ren: '',
    phone: '',
    email: '',
    wechat: '',
    location: '',
    hot: false,
    down: false
  } as AdminWupinBase)

  const hotPrice = ref('')
  const realPrice = ref('')

  const hasChange = computed(() => {
    return (
      form.value.name !== wupin.value?.name ||
      form.value.pic !== wupin.value?.pic ||
      form.value.classId !== wupin.value?.classId ||
      form.value.tag !== wupin.value?.tag ||
      form.value.hotPrice !== wupin.value?.hotPrice ||
      form.value.realPrice !== wupin.value?.realPrice ||
      form.value.info !== wupin.value?.info ||
      form.value.ren !== wupin.value?.ren ||
      form.value.phone !== wupin.value?.phone ||
      form.value.email !== wupin.value?.email ||
      form.value.wechat !== wupin.value?.wechat ||
      form.value.location !== wupin.value?.location ||
      form.value.hot !== wupin.value?.hot ||
      form.value.down !== wupin.value?.down ||
      newPic.value !== null
    )
  })

  const checkName = computed(() => form.value.name && form.value.name.length > 0 && form.value.name.length <= 10)
  const checkClassId = computed(() => form.value.classId && form.value.classId !== 1)
  const checkHotPrice = computed(() => {
    if (!hotPrice.value) {
      return true
    }

    return Number(hotPrice.value).valueOf() >= 0
  })
  const checkRealPrice = computed(() => {
    if (!realPrice.value) {
      return false
    }

    return Number(realPrice.value).valueOf() >= 0
  })

  const checkRen = computed(() => form.value.ren && form.value.ren.length > 0 && form.value.ren.length <= 10)
  const checkPhone = computed(() => isMobile(form.value.phone))
  const checkEmail = computed(() => {
    if (!form.value.email) {
      return true
    }
    return isEmail(form.value.email)
  })
  const checkLocation = computed(
    () => form.value.location && form.value.location.length >= 10 && form.value.location.length <= 150
  )
  const allCheck = computed(
    () =>
      checkName.value &&
      checkLocation.value &&
      checkClassId.value &&
      checkHotPrice.value &&
      checkRealPrice.value &&
      checkRen.value &&
      checkPhone.value &&
      checkEmail.value &&
      hasChange.value
  )

  const update = () => {
    ElMessageBox.confirm('您确定要更新商品信息吗？', '提示', {
      confirmButtonText: '确定更新',
      cancelButtonText: '取消更新',
      type: 'warning'
    }).then(() => {
      if (hotPrice.value) {
        form.value.hotPrice = Math.floor(Number(hotPrice.value).valueOf() * 100)
      } else {
        form.value.hotPrice = -1
      }

      if (realPrice.value) {
        form.value.realPrice = Math.floor(Number(realPrice.value).valueOf() * 100)
      } else {
        form.value.realPrice = 0
      }

      if (!form.value.classId) {
        form.value.classId = defaultClass.value.id
      }

      return apiAdminPostUpdateWupin(form.value, newPic.value && newPic.value.raw ? newPic.value.raw : null).then(
        (res) => {
          if (res.data.data.success) {
            ElMessage({
              type: 'success',
              message: '更新成功'
            })
            toBack()
          } else {
            ElMessage({
              type: 'error',
              message: '更新失败'
            })
          }
        }
      )
    })
  }

  const pictureLst = ref([])
  const pictureUpload = ref<UploadInstance>()
  const newPic = ref(null as UploadFile | null)

  const handleExceed: UploadProps['onExceed'] = (files) => {
    pictureUpload.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    pictureUpload.value!.handleStart(file)
  }

  const updatePicture = (pic: UploadFile) => {
    if (!pic || !pic.size || !pic.raw) {
      ElMessage({
        type: 'warning',
        message: '请上传图片'
      })
      return
    }

    if (pic.size > 500000) {
      // 500KB
      ElMessage({
        type: 'warning',
        message: '文件过大'
      })
      return
    }

    newPic.value = pic

    ElMessage({
      type: 'success',
      message: '图片上传成功'
    })
  }

  const deletePicture = () => {
    pictureLst.value = []
    newPic.value = null
  }

  const showPic = ref(false)
  const picUrl = ref('')

  const openPic = () => {
    if (!newPic.value) {
      return
    }

    picUrl.value = URL.createObjectURL((newPic.value as any).raw)
    showPic.value = true
  }

  const showEdit = ref(false)
  const openEdit = () => {
    if (!wupin.value) {
      return
    }

    showEdit.value = true
  }

  const selectMsg = computed(() => {
    if (defaultClass.value) {
      return `请选择新商品分类，若您不选择将沿用旧类型：${defaultClass.value.name}。`
    }

    return `请选择新商品分类，若您不选择将沿用旧类型。`
  })
</script>

<template>
  <el-card v-if="wupin && isAdmin()" class="base_card admin_root_main_base_card">
    <div style="margin-left: 20px; margin-right: 20px; width: 36vw">
      <el-form :model="form" label-width="auto" style="width: 35vw">
        <el-form-item>
          <template #label>
            <el-text>商品名称</el-text>
          </template>
          <el-input v-model="form.name" maxlength="10" minlength="1" show-word-limit clearable />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>商品名图片</el-text>
          </template>
          <div>
            <div v-if="newPic">
              <el-tooltip
                effect="dark"
                content="删除和预览只针对新上传的图片，若不上传图片，则商品沿用旧图。"
                placement="bottom"
              >
                <el-button-group>
                  <el-button type="danger" @click="deletePicture"> 删除 </el-button>
                  <el-button type="primary" @click="openPic"> 预览 </el-button>
                </el-button-group>
              </el-tooltip>
            </div>
            <div v-else>
              <el-upload
                ref="pictureUpload"
                v-model:file-list="pictureLst"
                action="#"
                accept=".jpg,.jpeg,.png"
                :auto-upload="false"
                :multiple="false"
                :limit="1"
                :on-exceed="handleExceed"
                :show-file-list="false"
                :on-change="updatePicture"
              >
                <el-tooltip effect="dark" placement="bottom">
                  <el-button type="primary">
                    <el-icon><Edit /></el-icon>
                    上传商品图片
                  </el-button>
                  <template #content>
                    <el-text style="color: white"> 仅限jpg/png文件，不超过500KB </el-text>
                  </template>
                </el-tooltip>
              </el-upload>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>商品分类</el-text>
          </template>
          <el-select v-model="form.classId" :placeholder="selectMsg" size="large" clearable>
            <el-option v-for="(item, j) in classLst" :key="j" :label="item.name" :value="item.id"> </el-option>
            <template #footer>
              <div style="display: flex; justify-content: center; margin-top: 10px">
                <el-pagination
                  v-model:current-page="classLstPage"
                  class="pager"
                  background
                  layout="prev, pager, next"
                  :page-size="classLstPagesize"
                  :total="classLstMaxPage || 0"
                  @change="onClassLstChange"
                />
              </div>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>标签</el-text>
          </template>
          <el-input v-model="form.tag" maxlength="5" show-word-limit clearable />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>火热价</el-text>
          </template>
          <el-input v-model="hotPrice" clearable>
            <template #prepend> ￥ </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>真实价</el-text>
          </template>
          <el-input v-model="realPrice" minlength="1" clearable>
            <template #prepend> ￥ </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>联系人</el-text>
          </template>
          <el-input v-model="form.ren" maxlength="10" minlength="1" show-word-limit clearable />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>联系电话</el-text>
          </template>
          <el-input v-model="form.phone" maxlength="20" minlength="1" show-word-limit clearable />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>联系微信</el-text>
          </template>
          <el-input v-model="form.wechat" maxlength="30" show-word-limit clearable />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>联系邮箱</el-text>
          </template>
          <el-input v-model="form.email" maxlength="30" show-word-limit clearable />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>联系地址</el-text>
          </template>
          <el-input v-model="form.location" minlength="10" maxlength="150" show-word-limit />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>是否热门</el-text>
          </template>
          <el-checkbox v-model="form.hot" label="" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>是否销售</el-text>
          </template>
          <el-checkbox v-model="form.down" label="" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-text>介绍</el-text>
          </template>
          <el-button type="primary" plain @click="openEdit"> 打开编辑器 </el-button>
        </el-form-item>
      </el-form>
      <div style="display: flex; width: 100%; justify-content: center">
        <el-button size="large" type="success" :disabled="!allCheck" @click="update"> 更新 </el-button>
      </div>
      <div style="width: 100%; margin-top: 5px">
        <div v-if="!checkName" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="名字需要在1-10位！" :closable="false" type="warning" center show-icon> </el-alert>
        </div>
        <div v-if="!checkLocation" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请填写正确的地址！" :closable="false" type="warning" center show-icon> </el-alert>
        </div>
        <div v-if="!checkClassId" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请选择正确商品分类！" :closable="false" type="warning" center show-icon> </el-alert>
        </div>
        <div v-if="!checkHotPrice" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的火爆价（或者不填写）！" :closable="false" type="warning" center show-icon>
          </el-alert>
        </div>
        <div v-if="!checkHotPrice" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的真实价格！" :closable="false" type="warning" center show-icon> </el-alert>
        </div>
        <div v-if="!checkRen" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的联系人" :closable="false" type="warning" center show-icon> </el-alert>
        </div>
        <div v-if="!checkPhone" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的联系电话" :closable="false" type="warning" center show-icon> </el-alert>
        </div>
        <div v-if="!checkEmail" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请输入正确的邮箱！" :closable="false" type="warning" center show-icon> </el-alert>
        </div>
        <div v-if="!hasChange" class="tip_box" style="display: flex; justify-content: center">
          <el-alert title="请编辑信息！" :closable="false" type="warning" center show-icon> </el-alert>
        </div>
      </div>
    </div>
  </el-card>
  <div v-else></div>

  <el-dialog v-model="showPic" style="height: 50vh; width: 20vw" destroy-on-close>
    <div style="height: 35vh; width: 100%; display: flex; justify-content: center">
      <img alt="wechat" style="height: 100%; width: 100%; object-fit: contain" :src="picUrl" />
    </div>

    <template #footer>
      <div class="dialog-footer" style="height: 10vh">
        <el-button type="success" @click="showPic = false"> 关闭 </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="showEdit" width="40vw">
    <template #header>
      <div style="width: 100%; display: flex; justify-content: center">
        <el-text style="font-size: 1vw; font-weight: bold; margin-bottom: 10px">
          {{ wupin && wupin.name }} 商品介绍编辑器
        </el-text>
      </div>
    </template>
    <div id="dialogBox" style="width: 100%; height: 50vh; display: flex; justify-content: center">
      <Editor v-model="form.info" placeholder="请输入介绍信息..." type="'admin-wupin'"></Editor>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="success" @click="showEdit = false"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
  .tip_box {
    margin-top: 10px;
  }

  #editorBox {
    border-style: solid;
    border-width: 1px;
    border-color: black;
    height: 95%;
    width: 95%;
  }
</style>
