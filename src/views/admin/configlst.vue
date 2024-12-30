<script setup lang="ts">
import {isRootAdmin} from "@/store/admin"
import {
  AdminConfig,
  apiAdminConfigAsDefault,
  apiAdminGetConfig,
  apiAdminPostDeleteConfig,
  apiAdminPostUpdateConfigSPic,
  apiAdminPostUpdateConfigString
} from "#/admin/config";
import {Edit} from "@element-plus/icons-vue"
import {ElMessage, genFileId, UploadFile, UploadInstance, UploadProps, UploadRawFile} from "element-plus"

const router = useRouter()

if (!isRootAdmin()) {
  router.push({
    path: "/system/error",
    query: {
      msg: "页面错误"
    }
  })
}

const configtype = ref({})
const configtypename = ref({})
const configinfo = ref({})

const config = ref(null as AdminConfig | null)
const configKeys = computed(() => Object.keys(configtype.value))

const onChange = () => {
  apiAdminGetConfig().then((res) => {
    config.value = apiAdminConfigAsDefault(res.data.data.config)
    configinfo.value = res.data.data.info
    configtype.value = res.data.data.type
    configtypename.value = res.data.data.typename
  })
}
onChange()

const showPic = ref(false)
const picUrl = ref("")

const openPic = (url: string) => {
  if (url.length === 0) {
    ElMessage({
      type: "error",
      message: "图片不存在",
    })
    return
  }

  picUrl.value = url
  showPic.value = true
}

const pictureLst = ref([])
const pictureUpload = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
  pictureUpload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  pictureUpload.value!.handleStart(file)
}

const updatePicture = (key: string) => (pic: UploadFile) => {
  if (!pic || !pic.size || !pic.raw) {
    ElMessage({
      type: 'warning',
      message: "请上传图片"
    })
    return
  }

  if ((pic.size || 0) > 500000) {// 500KB
    ElMessage({
      type: 'warning',
      message: "文件过大"
    })
    return
  }

  apiAdminPostUpdateConfigSPic(key, pic.raw).then((res) => {
    if (res.data.data.success) {
      ElMessage({
        type: 'success',
        message: "图片上传成功"
      })
      onChange()
    } else {
      ElMessage({
        type: 'success',
        message: "图片上传失败"
      })
    }
  })
}

const showUpdateText = ref(false)
const newText = ref("")
const newTextKey = ref("")

const openUpdateText = (key: string) => {
  newTextKey.value = key
  newText.value = (config.value && config.value[key]) || ""
  showUpdateText.value = true
}

const updateText = () => {
  if (configtype.value[newTextKey.value] === "text|must") {
    if (!newText.value || newText.value.length === 0) {
      ElMessage({
        type: "error",
        message: "内容不能为空",
      })
      return
    }
  } else if (!newText.value || newText.value.length === 0) {
    newText.value = ""
  }

  apiAdminPostUpdateConfigString(newText.value, newText.value).then((res) => {
    if (res.data.data.success) {
      ElMessage({
        type: 'success',
        message: "修改成功",
      })
      onChange()
    } else {
      ElMessage({
        type: 'error',
        message: "修改失败",
      })
    }
  })
}

const showUpdateString = ref(false)
const newString = ref("")
const newStringKey = ref("")

const openUpdateString = (key: string) => {
  newStringKey.value = key
  newString.value = (config.value && config.value[key]) || ""
  showUpdateString.value = true
}

const updateString = () => {
  if (configtype.value[newStringKey.value] === "string|must") {
    if (!newString.value || newString.value.length === 0) {
      ElMessage({
        type: "error",
        message: "内容不能为空",
      })
      return
    }
  } else if (!newString.value || newString.value.length === 0) {
    newString.value = ""
  }

  apiAdminPostUpdateConfigString(newString.value, newString.value).then((res) => {
    if (res.data.data.success) {
      ElMessage({
        type: 'success',
        message: "修改成功",
      })
      onChange()
    } else {
      ElMessage({
        type: 'error',
        message: "修改失败",
      })
    }
  })
}

const deleteConfig = (key: string) => {
  if (((configtype.value[key] || "") as string).endsWith("|must")) {
    return
  }

  apiAdminPostDeleteConfig(key).then((res) => {
    if (res.data.data.success) {
      ElMessage({
        type: 'success',
        message: "删除成功",
      })
      onChange()
    } else {
      ElMessage({
        type: 'error',
        message: "删除失败",
      })
    }
  })
}

</script>

<template>
  <el-card v-if="config && isRootAdmin()" class="base_card">
    <el-table :data="configKeys" style="width: 77vw" height="70vh">
      <el-table-column label="配置项" >
        <template #default="{ row }">
          <el-text>
            {{ row }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column label="配置项类型" >
        <template #default="{ row }">
          <el-text>
            {{ configtypename[configtype[row]] || "未知" }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column label="配置项含义" >
        <template #default="{ row }">
          <el-text>
            {{ configinfo[row] || "未知" }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column label="配置值" >
        <template #default="{ row }">
          <el-button v-if="configtype[row] === 'pic|must' || configtype[row] === 'pic'" :disabled="!config[row]" @click="openPic(config && config[row])">
            查看图片
          </el-button>
          <el-text v-else>
            {{ config[row] }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column label="更新" >
        <template #default="{ row }">
          <div v-if="configtype[row] === 'pic|must' || configtype[row] === 'pic'">
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
                :0n-change="updatePicture(row)"
            >
              <el-tooltip
                  effect="dark"
                  placement="bottom"
              >
                <el-button type="primary" plain>
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
          <div v-else-if="configtype[row] === 'string|must' || configtype[row] === 'string'">
            <el-button type="primary" plain @click="openUpdateString(row)">
              <el-icon><Edit /></el-icon>
              更新文本
            </el-button>
          </div>
          <div v-else>
            <el-button type="primary" plain @click="openUpdateText(row)">
              <el-icon><Edit /></el-icon>
              更新文本域
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="删除" >
        <template #default="{ row }">
          <el-button
              v-if="configtype[row] === 'text' || configtype[row] === 'string' || configtype[row] === 'pic'"
              type="danger"
              plain
              @click="deleteConfig(row)"
          >
            删除
          </el-button>
          <el-text v-else>
            不可删除
          </el-text>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
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

  <el-dialog v-model="showUpdateText" width="800">
    <template #title>
      <div class="update_box">
        <el-text class="update_title">
          更新配置项：{{ newStringKey }}
        </el-text>
      </div>
    </template>

    <div>
      <el-input v-model="newText" placeholder="请输入新的配置项" type="textarea" :rows="10"></el-input>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button-group>
          <el-button type="success" @click="updateText">
            确定
          </el-button>
          <el-button type="info" @click="showUpdateText = false">
            关闭
          </el-button>
        </el-button-group>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="showUpdateString" width="400">
    <template #title>
      <div class="update_box">
        <el-text class="update_title">
          更新配置项：{{ newStringKey }}
        </el-text>
      </div>
    </template>
    <div>
      <el-input v-model="newString" placeholder="请输入新的配置项" type="text"></el-input>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button-group>
          <el-button type="success" @click="updateString">
            确定
          </el-button>
          <el-button type="info" @click="showUpdateString = false">
            关闭
          </el-button>
        </el-button-group>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.update_title {
  font-size: 0.8vw;
}

.update_box {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 6px;
}
</style>