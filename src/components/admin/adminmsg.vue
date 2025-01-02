<script setup lang="ts">
  import { formatDate } from '@/utils/time'
  import pushTo from '@/views/admin/router_push'

  const props = defineProps({
    msg: {
      type: String,
      required: true
    },
    userId: {
      type: Number,
      required: false,
      default: 0
    },
    user: {
      type: String,
      required: false,
      default: ''
    },
    time: {
      type: Number,
      required: false,
      default: 0
    }
  })

  const router = useRouter()
  const route = useRoute()

  const user_class = computed(() => {
    if (props.userId) {
      return ['msg_user', 'msg_user_click']
    }

    return ['msg_user']
  })

  const toUser = () => {
    props.userId &&
      pushTo(router, route, '/admin/user/info', {
        userId: props.userId
      })
  }
</script>

<template>
  <el-card class="msg_card">
    <div class="msg_text_box">
      <el-text v-if="props.msg" class="msg_text">
        {{ props.msg }}
      </el-text>
      <el-text v-else class="msg_text"> 消息好像消失啦！ </el-text>
    </div>
    <div v-if="props.user" class="msg_user_box">
      <el-text :class="user_class" @click="toUser"> 留言人：{{ props.user }} </el-text>
    </div>
    <div v-if="props.time" class="msg_time_box">
      <el-text class="msg_time"> 留言时间：{{ formatDate(props.time) }} </el-text>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
  .msg_card {
    width: 100%;
  }

  .msg_text_box {
    text-align: left;
  }

  .msg_text {
    font-size: 1.2rem;
  }

  .msg_user_box {
    text-align: right;
  }

  .msg_user {
    font-size: 0.8rem;
    font-weight: bold;
  }

  .msg_user_click {
    cursor: pointer;
  }

  .msg_user_click:hover {
    text-decoration: underline;
  }

  .msg_user_click:active {
    color: #3a3a3c;
    text-decoration: underline;
  }

  .msg_time_box {
    text-align: right;
  }

  .msg_time {
    font-size: 0.8rem;
    font-weight: bold;
  }
</style>
