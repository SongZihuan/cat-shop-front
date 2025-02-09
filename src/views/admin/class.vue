<script setup lang="ts">
  import pushTo from '@/views/admin/router_push'
  import { AdminClass, apiAdminGetClass } from '#/admin/class'
  import { RouteLocationNormalized } from 'vue-router'

  const route = useRoute()
  const router = useRouter()

  const toBack = () => {
    pushTo(router, route, '/admin/class/list')
  }

  const classId = ref(Number(route.query?.classId).valueOf() || 0)
  const classObj = ref(null as AdminClass | null)

  const onChangeClass = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
    classId.value = Number(to.query?.classId).valueOf() || 0
    classObj.value = null

    if (classId.value && classId.value > 1) {
      apiAdminGetClass(classId.value).then(
        (res) => {
          classObj.value = res.data.data as AdminClass
        },
        () => {
          toBack()
        }
      )
    } else {
      toBack()
    }
    next()
  }

  onBeforeRouteUpdate(onChangeClass)
  onChangeClass(route, route, () => {})

  const toEdit = () => {
    classObj.value && pushTo(router, route, '/admin/class/edit')
  }
</script>

<template>
  <el-card v-if="classObj" class="base_card admin_root_main_base_card">
    <template #header>
      <div>
        <el-text class="title"> 类别详情 </el-text>
      </div>
    </template>
    <div class="box">
      <div>
        <div class="info_box">
          <el-text class="info_text"> 类别ID：</el-text>
          <el-text class="info_text"> {{ classObj.id }} </el-text>
        </div>
        <div class="info_box">
          <el-text class="info_text"> 类别名称：</el-text>
          <el-text class="info_text"> {{ classObj.name }} </el-text>
        </div>
        <div class="info_box">
          <el-text class="info_text"> 是否公开展示：</el-text>
          <el-text v-if="classObj.show && !classObj.down" class="info_text"> 公开展示 </el-text>
          <el-text v-else class="info_text"> 不公开展示 </el-text>
        </div>
        <div class="info_box">
          <el-text class="info_text"> 是否继续销售：</el-text>
          <el-text v-if="classObj.down" class="info_text"> 不在销售 </el-text>
          <el-text v-else class="info_text"> 销售中 </el-text>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="footer_box">
        <el-button type="success" plain size="large" @click="toEdit"> 前往编辑 </el-button>
      </div>
    </template>
  </el-card>
</template>

<style scoped lang="scss">
  .base_card {
    width: auto;
    max-width: 98%;
    min-width: 15vw;
  }

  .title {
    font-size: 1.3rem;
  }

  .footer_box {
    display: flex;
    justify-content: right;
  }

  .info_text {
    font-size: 1rem;
  }

  .info_box {
    margin-bottom: 10px;
  }

  .box {
    display: flex;
    justify-content: left;
  }
</style>
