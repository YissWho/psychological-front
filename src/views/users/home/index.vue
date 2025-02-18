<template>
  <div class="dashboard">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-left">
        <h1 class="greeting">{{ greeting }}，{{ username }}！</h1>
        <div class="datetime">
          <clock-circle-outlined />
          <span>{{ currentTime }}</span>
        </div>
        <p class="welcome-text">{{ welcomeText }}</p>
      </div>
      <div class="welcome-right">
        <img src="/welcome.svg" alt="welcome" class="welcome-image" />
      </div>
    </div>
    <!-- 每日格言 -->
    <a-card class="quote-card">
      <template #extra>
        <a-tag color="blue">每日格言</a-tag>
      </template>
      <p class="quote-text">{{ dailyQuote }}</p>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useUserStore } from "../../../store/module/user"
import { ClockCircleOutlined } from "@ant-design/icons-vue"
import dayjs from "dayjs"
import "./index.less"

const userStore = useUserStore()
const username = computed(() => userStore.userInfo?.username || "访客")

// 时间相关
const currentTime = ref(dayjs().format("YYYY年MM月DD日 HH:mm:ss"))
let timer: NodeJS.Timeout

// 问候语
const greeting = computed(() => {
  const hour = dayjs().hour()
  if (hour < 6) return "凌晨好"
  if (hour < 9) return "早上好"
  if (hour < 12) return "上午好"
  if (hour < 14) return "中午好"
  if (hour < 17) return "下午好"
  if (hour < 19) return "傍晚好"
  return "晚上好"
})

// 欢迎语
const welcomeText = computed(() => {
  const texts = [
    "愿今天的阳光温暖你的心灵",
    "每一天都是新的开始",
    "保持积极乐观的心态",
    "让我们一起创造美好的一天",
  ]
  return texts[Math.floor(Math.random() * texts.length)]
})

// 每日格言
const dailyQuote = ref(
  "生命中最重要的不是所处的位置，而是所朝的方向。 —— 奥利弗·霍姆斯"
)

onMounted(() => {
  // 更新时间
  timer = setInterval(() => {
    currentTime.value = dayjs().format("YYYY年MM月DD日 HH:mm:ss")
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>
