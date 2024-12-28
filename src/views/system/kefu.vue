<script setup lang="ts">
import useConfigStore from "@/store/config"
import {Service} from "@element-plus/icons-vue"
import {isLogin, hasLoad} from "@/store/user"
import {apiSendKefuMsg} from "#/center/kefu"
import {ElMessage} from "element-plus"

const configStore = useConfigStore()
configStore.updateConfig()

const textarea = ref("")
const sendok = computed(() => textarea.value.length >= 10 && textarea.value.length <= 150)

const onSendMsg = () => {
  if (!sendok.value) {
    return
  }
  apiSendKefuMsg(textarea.value).then((res) => {
    if (res.data.data.success) {
      ElMessage({
        type: 'success',
        message: "留言成功",
      })
    } else {
      ElMessage({
        type: 'error',
        message: "留言失败",
      })
    }
  })
}

</script>

<template>
  <div style="display: flex; justify-content: center; margin-top: 10px; margin-bottom: 10px">
    <el-card style="display: flex; max-width: 75%; justify-content: center; margin-top: 10px">
      <div style="display: flow-root">
        <div style="float: left">
          <div v-if="configStore.config?.hotline">
            <el-text>
              <el-icon><Phone /></el-icon>
              400服务热线：
              <el-text>
                {{ configStore.config?.hotline }}
              </el-text>
            </el-text>
          </div>

          <div v-if="configStore.config?.service">
            <el-text>
              <el-icon><Service /></el-icon>
              {{ configStore.config?.service }}
            </el-text>
          </div>

          <div v-if="configStore.config?.wechat">
            <div style="display: flex; justify-content: center">
              <el-image style="width: 15vw; max-height: 55vh" :src="configStore.config?.wechat" fit="contain" :preview-src-list="[configStore.config?.wechat]" :initial-index="0"></el-image>
            </div>
          </div>
        </div>
        <el-divider direction="vertical" style="min-height: 65vh; border-width: 1px; margin-left: 15px; margin-right: 15px"></el-divider>
        <div style="float: right">
          <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
            <div>
              <el-text class="liuyan_header">我要留言</el-text>
            </div>

            <div>
              <el-input
                  v-model="textarea"
                  style="width: 15vw;"
                  :rows="10"
                  type="textarea"
                  placeholder="请输入你的留言"
                  :disabled="!isLogin() && hasLoad()"
                  :maxlength="150"
                  :minlength="10"
                  show-word-limit
                  clearable
              />
            </div>
            <div style="width: 100%; display: flex; justify-content: right; margin-top: 10px">
              <el-tooltip
                  v-if="!isLogin() && hasLoad()"
                  effect="dark"
                  content="请登陆后再操作"
                  placement="bottom-start"
              >
                <el-button type="primary" disabled>
                  提交
                </el-button>
              </el-tooltip>
              <el-button v-else type="primary" @click="onSendMsg">
                提交
              </el-button>
            </div>
            <div style="text-align: center">
              <div>
                <el-text>
                  我们将会仔细阅读你的留言，非常感谢。
                </el-text>
              </div>
              <div>
                <el-text>
                  留言字数限制：10字以上，150字以下。
                </el-text>
              </div>
              <div>
                <el-text>
                  请登陆后再进行留言。
                </el-text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.liuyan_header {
  margin-bottom: 5px;
  font-size: 0.8vw;
}
</style>