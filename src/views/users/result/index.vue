<template>
  <div style="padding: 24px">
    <a-card :bordered="false">
      <template #title>
        <a-space>
          <span style="font-size: 16px; font-weight: 500">评测结果</span>
          <a-radio-group v-model:value="viewMode" button-style="solid">
            <a-radio-button value="basic">基本信息</a-radio-button>
            <a-radio-button value="detailed">详细信息</a-radio-button>
          </a-radio-group>
        </a-space>
      </template>

      <!-- 基本信息表格 -->
      <a-table
        v-if="viewMode === 'basic'"
        :columns="basicColumns"
        :data-source="basicResults"
        :loading="basicLoading"
        row-key="id"
        :pagination="{
          pageSize: 10,
          showTotal: (total: number) => `共 ${total} 条`,
          showSizeChanger: true,
          showQuickJumper: true
        }"
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
      <template v-else>
        <a-table
          :columns="detailedColumns"
          :data-source="detailedResults"
          :loading="detailedLoading"
          row-key="id"
          :pagination="{
            pageSize: 10,
            showTotal: (total: number) => `共 ${total} 条`,
            showSizeChanger: true,
            showQuickJumper: true
          }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'createdAt'">
              {{ formatDate(record.createdAt) }}
            </template>
            <template v-if="column.key === 'category'">
              <a-tag :color="getCategoryColor(record.category)">
                {{ record.category }}
              </a-tag>
            </template>
          </template>
        </a-table>
      </template>
    </a-card>

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
  { 
    title: "评测名称", 
    dataIndex: "assessmentTitle", 
    key: "assessmentTitle",
    width: 200,
    ellipsis: true 
  },
  { 
    title: "评估结果", 
    dataIndex: "resultCategory", 
    key: "resultCategory",
    width: 120,
    align: 'center'
  },
  { 
    title: "评测时间", 
    dataIndex: "createdAt", 
    key: "createdAt",
    width: 180,
    align: 'center'
  },
  { 
    title: "操作", 
    key: "action",
    width: 120,
    align: 'center'
  },
]

const detailedColumns = [
  { 
    title: "评测名称", 
    dataIndex: "assessmentTitle", 
    key: "assessmentTitle",
    width: 200,
    ellipsis: true
  },
  { 
    title: "总分", 
    dataIndex: "totalScore", 
    key: "totalScore",
    width: 100,
    align: 'center'
  },
  { 
    title: "评估结果", 
    dataIndex: "category", 
    key: "category",
    width: 120,
    align: 'center'
  },
  { 
    title: "评估描述", 
    dataIndex: "description", 
    key: "description",
    ellipsis: true
  },
  { 
    title: "建议", 
    dataIndex: "recommendation", 
    key: "recommendation",
    ellipsis: true
  },
  { 
    title: "评测时间", 
    dataIndex: "createdAt", 
    key: "createdAt",
    width: 180,
    align: 'center'
  },
]

// 获取基本信息
const { data: basicResults, loading: basicLoading } = useRequest(getResult, {
  onSuccess: (res) => {
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

// 获取评估结果标签颜色
const getCategoryColor = (category: string) => {
  const colorMap: Record<string, string> = {
    '正常': 'success',
    '轻度': 'warning',
    '中度': 'orange',
    '重度': 'error',
  }
  return colorMap[category] || 'default'
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
