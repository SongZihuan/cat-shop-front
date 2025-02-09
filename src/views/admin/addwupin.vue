<script setup lang="ts">
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { isAdmin } from '@/store/admin'
  import { isEmail, isMobile } from '@/utils/str'
  import { AdminWupinBase, apiAdminPostAddWupin } from '#/admin/wupin'
  import { AdminClass, AllClass, apiAdminGetClassLst } from '#/admin/class'
  import Editor from '@/components/utils/editor.vue'

  const router = useRouter()

  if (!isAdmin()) {
    router.push({
      path: '/system/error',
      query: {
        msg: '页面错误'
      }
    })
  }

  const classLst = ref([] as AdminClass[])
  const classLstPage = ref(1)
  const classLstMaxPage = ref(0)
  const classLstPagesize = ref(20)

  const onClassLstChange = () => {
    apiAdminGetClassLst(classLstPage.value, classLstPagesize.value).then((res) => {
      classLstMaxPage.value = res.data.data.maxcount
      classLst.value = [AllClass].concat(res.data.data.list)

      if (classLst.value.every((item) => item.id !== form.value.classId)) {
        ;(form.value as any).classId = undefined
      }
    })
  }
  onClassLstChange()

  const form = ref({
    name: '',
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
    down: true
  } as AdminWupinBase)

  const hasHotPrice = ref(true)
  const hotPrice = ref(0)
  const realPrice = ref(0)

  const checkName = computed(() => form.value.name && form.value.name.length > 0 && form.value.name.length <= 10)
  const checkClassId = computed(() => form.value.classId) // 可以为1
  const checkHotPrice = computed(() => {
    if (!hasHotPrice) {
      return true
    }

    return Number(hotPrice.value).valueOf() >= 0
  })
  const checkRealPrice = computed(() => Number(realPrice.value).valueOf() >= 0)

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
  const checkPic = computed(() => wupinPic.value && wupinPic.value.raw)
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
      checkPic.value
  )

  const add = () => {
    ElMessageBox.confirm('您确定要添加商品信息吗？', '提示', {
      confirmButtonText: '确定添加',
      cancelButtonText: '取消添加',
      type: 'warning'
    }).then(() => {
      if (hasHotPrice.value && hotPrice.value >= 0) {
        form.value.hotPrice = Math.floor(hotPrice.value * 100)
      } else {
        form.value.hotPrice = -1
      }

      if (realPrice.value >= 0) {
        form.value.realPrice = Math.floor(realPrice.value * 100)
      } else {
        form.value.realPrice = 0
      }

      if (!form.value.classId) {
        form.value.classId = AllClass.id
      }

      return apiAdminPostAddWupin(form.value, wupinPic.value.raw).then((res) => {
        if (res.data.data.success) {
          ElMessage({
            type: 'success',
            message: '添加成功'
          })

          form.value = {
            name: '',
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
            down: true
          }
          hasHotPrice.value = true
          realPrice.value = 0
          hotPrice.value = 0
        } else {
          ElMessage({
            type: 'error',
            message: '添加失败'
          })
        }
      })
    })
  }

  const pictureUpload = ref()
  const wupinPic = computed(() => pictureUpload.value && pictureUpload.value.pic)

  const showEdit = ref(false)
  const openEdit = () => {
    showEdit.value = true
  }
</script>

<template>
  <el-card v-if="isAdmin()" class="base_card admin_root_main_base_card">
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
          <Imgupload ref="pictureUpload"></Imgupload>
        </div>
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-text>商品分类</el-text>
        </template>
        <el-select v-model="form.classId" placeholder="请选择商品分类" size="large">
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
          <el-text>启用火热价</el-text>
        </template>
        <el-checkbox v-model="hasHotPrice"></el-checkbox>
      </el-form-item>
      <el-form-item v-show="hasHotPrice">
        <template #label>
          <el-text>火热价</el-text>
        </template>
        <el-input-number v-model="hotPrice" :min="0" :precision="2" controls-position="right" style="width: 100%">
          <template #prefix> ￥ </template>
        </el-input-number>
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-text>真实价</el-text>
        </template>
        <el-input-number v-model="realPrice" :min="0" :precision="2" controls-position="right" style="width: 100%">
          <template #prefix> ￥ </template>
        </el-input-number>
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
          <el-text>是否暂不销售</el-text>
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
      <el-button size="large" type="success" :disabled="!allCheck" plain @click="add"> 添加 </el-button>
    </div>
    <div style="width: 100%; margin-top: 5px">
      <div v-if="!checkName" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="名字需要在1-10位！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
      <div v-if="!checkLocation" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="请填写正确的10-150位联系地址！" :closable="false" type="warning" center show-icon> </el-alert>
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
      <div v-if="!checkPic" class="tip_box" style="display: flex; justify-content: center">
        <el-alert title="请上传商品图片！" :closable="false" type="warning" center show-icon> </el-alert>
      </div>
    </div>
  </el-card>
  <div v-else></div>

  <el-dialog v-model="showEdit" width="40vw">
    <template #header>
      <div style="width: 100%; display: flex; justify-content: center">
        <el-text style="font-size: 1vw; font-weight: bold; margin-bottom: 10px"> 商品介绍编辑器 </el-text>
      </div>
    </template>
    <div class="editor_box">
      <Editor v-model="form.info" placeholder="请输入介绍信息..." type="admin-wupin"></Editor>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="success"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
  .base_card {
    width: auto;
    max-width: 98%;
    min-width: 10vw;
  }

  .tip_box {
    margin-top: 10px;
  }

  .editor_box {
    display: flex;
    justify-content: center;
    width: auto;
    height: auto;
  }
</style>
