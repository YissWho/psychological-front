<template>
  <div class="result-container">
    <div class="header">
      <h2>评测结果</h2>
      <a-radio-group v-model:value="viewMode" button-style="solid">
        <a-radio-button value="basic">基本信息</a-radio-button>
        <a-radio-button value="detailed">详细信息</a-radio-button>
      </a-radio-group>
    </div>

    <!-- 基本信息表格 -->
    <a-table
      v-if="viewMode === 'basic'"
      :columns="basicColumns"
      :data-source="basicResults"
      :loading="basicLoading"
      row-key="id"
      :pagination="{ pageSize: 10 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'createdAt'">
          {{ formatDate(record.createdAt) }}
        </template>
        <template v-if="column.key === 'action'">
          <a-button type="link" @click="showDetail(record)">
            查看统计
          </a-button>
        </template>
      </template>
    </a-table>

    <!-- 详细信息表格 -->
    <a-table
      v-else
      :columns="detailedColumns"
      :data-source="detailedResults"
      :loading="detailedLoading"
      row-key="id"
      :pagination="{ pageSize: 10 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'createdAt'">
          {{ formatDate(record.createdAt) }}
        </template>
      </template>
    </a-table>
    <AnswerDetailModal v-model:visible="modalVisible" :id="currentId" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useRequest } from "vue-request"
import { getResult, getResultDetail } from "../../../api/user/result"
import dayjs from "dayjs"
import AnswerDetailModal from "./modal.vue"
// 视图模式切换
const viewMode = ref("basic")

// 表格列定义
const basicColumns = [
  { title: "评测名称", dataIndex: "assessmentTitle", key: "assessmentTitle" },
  { title: "评估结果", dataIndex: "resultCategory", key: "resultCategory" },
  { title: "评测时间", dataIndex: "createdAt", key: "createdAt" },
  { title: "操作", key: "action" },
]

const detailedColumns = [
  { title: "评测名称", dataIndex: "assessmentTitle", key: "assessmentTitle" },
  { title: "总分", dataIndex: "totalScore", key: "totalScore" },
  { title: "评估结果", dataIndex: "category", key: "category" },
  { title: "评估描述", dataIndex: "description", key: "description" },
  { title: "建议", dataIndex: "recommendation", key: "recommendation" },
  { title: "评测时间", dataIndex: "createdAt", key: "createdAt" },
]

// 获取基本信息
const { data: basicResults, loading: basicLoading } = useRequest(getResult, {
  onSuccess: (res) => {
    console.log(res)
    basicResults.value = res?.data || []
  },
})

// 获取详细信息
const {
  data: detailedResults,
  loading: detailedLoading,
  refresh: refreshDetailed,
} = useRequest(getResultDetail, {
  manual: true,
  onSuccess: (res) => {
    detailedResults.value = res?.data || []
  },
})

// 监听视图模式切换
watch(viewMode, (newMode) => {
  if (newMode === "detailed") {
    refreshDetailed()
  }
})

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format("YYYY-MM-DD HH:mm")
}

const currentId = ref<any>(null)
const modalVisible = ref<boolean>(false)
const showDetail = (record: any) => {
  currentId.value = record.assessmentId
  modalVisible.value = true
}
</script>

<style scoped lang="less">
.result-container {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h2 {
      margin: 0;
    }
  }
}
</style>
