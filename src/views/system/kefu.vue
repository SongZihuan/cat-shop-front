<script setup lang="ts">
  import useConfigStore from '@/store/config'
  import { Service } from '@element-plus/icons-vue'
  import { isLogin, hasLoad } from '@/store/user'
  import { apiSendKefuMsg } from '#/center/kefu'
  import { ElMessage } from 'element-plus'

  const configStore = useConfigStore()
  configStore.updateConfig()

  const textarea = ref('')
  const sendok = computed(() => textarea.value.length >= 10 && textarea.value.length <= 150)

  const onSendMsg = () => {
    if (!sendok.value) {
      return
    }
    apiSendKefuMsg(textarea.value).then((res) => {
      if (res.data.data.success) {
        ElMessage({
          type: 'success',
          message: '留言成功'
        })
      } else {
        ElMessage({
          type: 'error',
          message: '留言失败'
        })
      }
    })
  }
</script>

<template>
  <el-card class="base_card">
    <div style="display: flow-root">
      <div style="float: left">
        <div v-if="configStore.config?.hotline" class="info">
          <el-text class="info_text">
            <el-icon><Phone /></el-icon>
            400服务热线：
            {{ configStore.config?.hotline }}
          </el-text>
        </div>

        <div v-if="configStore.config?.service" class="info">
          <el-text class="info_text">
            <el-icon><Service /></el-icon>
            {{ configStore.config?.service }}
          </el-text>
        </div>

        <div v-if="configStore.config?.wechat" class="info">
          <div style="display: flex; justify-content: center">
            <el-image
              style="width: 15vw; max-height: 55vh"
              :src="configStore.config?.wechat"
              fit="contain"
              :preview-src-list="[configStore.config?.wechat]"
              :initial-index="0"
            ></el-image>
          </div>
        </div>
      </div>

      <el-divider
        direction="vertical"
        style="min-height: 65vh; border-width: 1px; margin-left: 15px; margin-right: 15px"
      ></el-divider>

      <div style="float: right">
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
          <div class="liuyan_header_box">
            <el-text class="liuyan_header">我要留言</el-text>
          </div>

          <div>
            <el-input
              v-model="textarea"
              style="width: 15vw"
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
            <el-tooltip v-if="!isLogin() && hasLoad()" effect="dark" content="请登陆后再操作" placement="bottom-start">
              <el-button type="primary" disabled> 提交 </el-button>
            </el-tooltip>
            <el-button v-else type="primary" @click="onSendMsg"> 提交 </el-button>
          </div>
          <div class="tip_out_box">
            <div class="tip_box">
              <el-text class="tip"> 我们将会仔细阅读你的留言，非常感谢。 </el-text>
            </div>
            <div class="tip_box">
              <el-text> 留言字数限制：10字以上，150字以下。 </el-text>
            </div>
            <div class="tip_box">
              <el-text class="tip"> 请登陆后再进行留言。 </el-text>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
  .base_card {
    --base-card-height: #{var(--custom-height)};
    --base-card-width: #{var(--custom-little-width)};
    --base-card-min-width: #{var(--custom-min-width)};
    max-width: #{var(--base-card-width)};
    min-width: var(--base-card-min-width);
  }

  .liuyan_header_box {
    margin-bottom: 10px;
  }

  .liuyan_header {
    font-size: 1.3rem;
    font-weight: bold;
  }

  .tip_out_box {
    margin-top: 20px;
    text-align: center;
  }

  .tip_box {
    margin-bottom: 10px;
  }

  .tip {
    font-size: 1rem;
  }

  .info {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }

  .info_text {
    font-size: 1.2rem;
    font-weight: bold;
  }
</style>
