<script setup lang="ts">
import {ElMessage, ElMessageBox , genFileId, type UploadInstance, UploadProps, UploadRawFile} from 'element-plus'
import {isAdmin} from "@/store/admin"
import {isEmail, isMobile} from "@/utils/str"
import {AdminWupinBase, apiAdminPostAddWupin} from "#/admin/wupin"
import {AdminClass, apiAdminGetClassLst} from "#/admin/class"
import {Edit} from "@element-plus/icons-vue"
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IToolbarConfig } from '@wangeditor/editor'
import { IEditorConfig } from '@wangeditor/editor'
import {apiAdminPostUploadImageUrl, apiAdminPostUploadVideoUrl} from "#/admin/image"
import {getXtoken} from "@/store/user"
import { UploadFile } from "element-plus"

const router = useRouter()

if (!isAdmin()) {
  router.push({
    path: "error",
    query: {
      msg: "页面错误"
    }
  })
}

const editorMode = ref("default")
const editorRef = shallowRef()
const toolbarConfig: Partial<IToolbarConfig> = {}
const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入介绍信息...',
  MENU_CONF: {
    uploadImage: {
      server: apiAdminPostUploadImageUrl(),
      fieldName: "image",
      maxFileSize: 2 * 1024 * 1024,
      headers: {
        "X-Token": getXtoken(),
        "Accept": "application/json",
      },
      meta: {
        type: "admin-wupin",
      }
    },
    uploadVideo: {
      server: apiAdminPostUploadVideoUrl(),
      fieldName: "video",
      maxFileSize: 10 * 1024 * 1024,
      headers: {
        "X-Token": getXtoken(),
        "Accept": "application/json",
      },
      meta: {
        type: "admin-wupin",
      }
    }
  },
  scroll: true,
}

onBeforeUnmount(() => {
  editorRef.value && editorRef.value.destroy()
})

const handleEditCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const classLst = ref([] as AdminClass[])
const classLstPage = ref(1)
const classLstMaxPage = ref(0)
const classLstPagesize = ref(20)

const onClassLstChange = () => {
  apiAdminGetClassLst(classLstPage.value, classLstPagesize.value).then((res) => {
    classLstMaxPage.value = res.data.data.maxpage
    classLst.value = res.data.data.list
  })
}
onClassLstChange()

const form = ref({
  name: "",
  pic: "",
  classid: 0,
  tag: "",
  hotPrice: 0,
  realPrice: 0,
  info: "",
  ren: "",
  phone: "",
  email: "",
  wechat: "",
  location: "",
  isHot: false,
} as AdminWupinBase)

const resetClassId = () => {
  (form.value as any).classid = undefined
}

resetClassId()

const hotPrice = ref("")
const realPrice = ref("0.00")

const checkPiv = computed(() => newPic.value !== null)
const checkName = computed(() => form.value.name && form.value.name.length > 0 && form.value.name.length <= 10)
const checkClassId = computed(() => form.value.classid !== 0)
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
const checkLocation = computed(() => form.value.location && form.value.location.length >= 10 && form.value.location.length <= 150)
const allCheck = computed(() => checkName.value && checkLocation.value && checkClassId.value &&
    checkHotPrice.value && checkRealPrice.value && checkRen.value && checkPhone.value && checkEmail.value && checkPiv.value)

const add = () => {
  ElMessageBox.confirm('您确定要添加商品信息吗？', '提示', {
    confirmButtonText: '确定添加',
    cancelButtonText: '取消添加',
    type: 'warning',
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

    if (!newPic.value || !newPic.value.raw) {
      return
    }

    return apiAdminPostAddWupin(form.value, newPic.value.raw).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: "添加成功",
        })

        form.value = {
          name: "",
          pic: "",
          classid: 0,
          tag: "",
          hotPrice: 0,
          realPrice: 0,
          info: "",
          ren: "",
          phone: "",
          email: "",
          wechat: "",
          location: "",
          isHot: false,
          isShow: true,
        }
        realPrice.value = "0.00"
        hotPrice.value = ""
        resetClassId()
      } else {
        ElMessage({
          type: 'error',
          message: "添加失败",
        })
      }
    })
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
      message: "请上传图片"
    })
    return
  }

  if (pic.size > 500000) {// 500KB
    ElMessage({
      type: 'warning',
      message: "文件过大"
    })
    return
  }

  newPic.value = pic

  ElMessage({
    type: 'success',
    message: "图片上传成功"
  })
}

const deletePicture = () => {
  pictureLst.value = []
  newPic.value = null
}

const showPic = ref(false)
const picUrl = ref("")

const openPic = () => {
  if (!newPic.value) {
    return
  }

  picUrl.value = URL.createObjectURL((newPic.value as any).raw)
  showPic.value = true
}

const showEdit = ref(false)
const openEdit = () => {
  showEdit.value = true
}

</script>

<template>
  <div v-if="isAdmin()" style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <el-card style="display: flex; width: 40vw; justify-content: center; margin-top: 10px">
      <el-scrollbar height="65vh" style="width: 38vw">
        <div style="margin-left: 20px; margin-right: 20px; width: 36vw">
          <el-form :model="form" label-width="auto" style="width: 35vw">
            <el-form-item>
              <template #label>
                <el-text>商品名称</el-text>
              </template>
              <el-input
                  v-model="form.name"
                  maxlength="10"
                  minlength="1"
                  show-word-limit
                  clearable
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>商品名图片</el-text>
              </template>
              <div>
                <div v-if="newPic">
                  <el-button-group>
                    <el-button type="danger" @click="deletePicture"> 删除 </el-button>
                    <el-button type="primary" @click="openPic"> 预览 </el-button>
                  </el-button-group>
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
                      :om-change="updatePicture"
                  >
                    <el-tooltip
                        effect="dark"
                        placement="bottom-end"
                    >
                      <el-button type="primary">
                        <el-icon><Edit /></el-icon>
                        上传商品图片
                      </el-button>
                      <template #content>
                        <el-text style="color: white">
                          仅限jpg/png文件，不超过500KB
                        </el-text>
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
              <el-select
                  v-model="form.classid"
                  placeholder="请选择商品分类"
                  size="large"
              >
                <el-option
                    v-for="(item, j) in classLst"
                    :key="j"
                    :label="item.name"
                    :value="item.id"
                >
                </el-option>
                <template #footer>
                  <div style="display: flex; justify-content: center; margin-top: 10px;">
                    <el-pagination v-model:current-page="classLstPage" class="pager" background layout="prev, pager, next" :page-size="classLstPagesize" :total="classLstMaxPage || 0" @change="onClassLstChange" />
                  </div>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>标签</el-text>
              </template>
              <el-input
                  v-model="form.tag"
                  maxlength="5"
                  show-word-limit
                  clearable
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>火热价</el-text>
              </template>
              <el-input
                  v-model="hotPrice"
                  clearable
              >
                <template #prepend>
                  ￥
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>真实价</el-text>
              </template>
              <el-input
                  v-model="realPrice"
                  minlength="1"
                  clearable
              >
                <template #prepend>
                  ￥
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>联系人</el-text>
              </template>
              <el-input
                  v-model="form.ren"
                  maxlength="10"
                  minlength="1"
                  show-word-limit
                  clearable
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>联系电话</el-text>
              </template>
              <el-input
                  v-model="form.phone"
                  maxlength="20"
                  minlength="1"
                  show-word-limit
                  clearable
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>联系微信</el-text>
              </template>
              <el-input
                  v-model="form.wechat"
                  maxlength="30"
                  show-word-limit
                  clearable
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>联系邮箱</el-text>
              </template>
              <el-input
                  v-model="form.email"
                  maxlength="30"
                  show-word-limit
                  clearable
              />
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>联系地址</el-text>
              </template>
              <el-input v-model="form.location" minlength="10" maxlength="150" show-word-limit/>
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>是否热门</el-text>
              </template>
              <el-checkbox v-model="form.isHot" label=""/>
            </el-form-item>
            <el-form-item>
              <template #label>
                <el-text>介绍</el-text>
              </template>
              <el-button type="primary" plain @click="openEdit"> 打开编辑器 </el-button>
            </el-form-item>
          </el-form>
          <div style="display: flex; width: 100%; justify-content: center">
            <el-button :disabled="!allCheck" @click="add">
              添加
            </el-button>
          </div>
          <div style="width: 100%; margin-top: 5px">
            <div v-if="!checkName" class="tip_box" style="display: flex; justify-content: center">
              <el-alert title="名字需要在1-10位！" :closable="false" type="warning" center show-icon>
              </el-alert>
            </div>
            <div v-if="!checkLocation" class="tip_box" style="display: flex; justify-content: center">
              <el-alert title="请填写正确的地址！" :closable="false" type="warning" center show-icon>
              </el-alert>
            </div>
            <div v-if="!checkClassId" class="tip_box" style="display: flex; justify-content: center">
              <el-alert title="请选择正确的分类！" :closable="false" type="warning" center show-icon>
              </el-alert>
            </div>
            <div v-if="!checkHotPrice" class="tip_box" style="display: flex; justify-content: center">
              <el-alert title="请输入正确的火爆价（或者不填写）！" :closable="false" type="warning" center show-icon>
              </el-alert>
            </div>
            <div v-if="!checkHotPrice" class="tip_box" style="display: flex; justify-content: center">
              <el-alert title="请输入正确的真实价格！" :closable="false" type="warning" center show-icon>
              </el-alert>
            </div>
            <div v-if="!checkRen" class="tip_box" style="display: flex; justify-content: center">
              <el-alert title="请输入正确的联系人" :closable="false" type="warning" center show-icon>
              </el-alert>
            </div>
            <div v-if="!checkPhone" class="tip_box" style="display: flex; justify-content: center">
              <el-alert title="请输入正确的联系电话" :closable="false" type="warning" center show-icon>
              </el-alert>
            </div>
            <div v-if="!checkEmail" class="tip_box" style="display: flex; justify-content: center">
              <el-alert title="请输入正确的邮箱！" :closable="false" type="warning" center show-icon>
              </el-alert>
            </div>
            <div v-if="!checkPiv" class="tip_box" style="display: flex; justify-content: center">
              <el-alert title="请上传商品图片！" :closable="false" type="warning" center show-icon>
              </el-alert>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-card>
  </div>
  <div v-else></div>

  <el-dialog
      v-model="showPic"
      style="height: 50vh; width: 20vw;"
      destroy-on-close
  >
    <div style="height: 35vh; width: 100%; display: flex; justify-content: center">
      <img alt="wechat" style="height: 100%; width: 100%; object-fit: contain;" :src="picUrl"/>
    </div>

    <template #footer>
      <div class="dialog-footer" style="height: 10vh">
        <el-button type="success" @click="showPic = false">
          关闭
        </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
      v-model="showEdit"
      width="40vw"
  >
    <template #header>
      <div style="width: 100%; display: flex; justify-content: center;">
        <el-text style="font-size: 1vw; font-weight: bold; margin-bottom: 10px;">
          商品介绍编辑器
        </el-text>
      </div>
    </template>
    <Clear>
      <div id="dialogBox" style="width: 100%; height: 50vh; display: flex; justify-content: center;">
        <div id="editorBox">
          <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorRef"
              :default-config="toolbarConfig"
              :mode="editorMode"
          />
          <Editor
              v-model="form.info"
              style="height: 80%; overflow-y: hidden;"
              :default-config="editorConfig"
              :mode="editorMode"
              @onCreated="handleEditCreated"
          />
        </div>
      </div>
    </Clear>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="success" @click="showEdit = false">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.tip_box {
  margin-top: 5px;
}

#editorBox {
  border-style: solid;
  border-width: 1px;
  border-color: black;
  height: 95%;
  width: 95%;
}

</style>