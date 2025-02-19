<template>
  <div class="score-list-container">
    <div class="header">
      <a-page-header
        :title="questionnaire.title"
        sub-title="评分规则管理"
        @back="handleBack"
      />
    </div>

    <div class="content">
      <div class="action-bar">
        <a-button type="primary" @click="handleAdd">添加规则</a-button>
        <!-- 刷新 -->
        <a-button type="default" @click="fetchData" style="margin-left: 10px"
          >刷新</a-button
        >
      </div>

      <a-table
        :columns="columns"
        :data-source="scoreRules"
        :loading="loading"
        row-key="category"
        bordered
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="primary" size="small" @click="handleEdit(record)"
                >编辑</a-button
              >
              <a-popconfirm
                title="确定要删除这条评分规则吗？"
                @confirm="handleDelete(record)"
              >
                <a-button type="primary" size="small" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 编辑/新增弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalTitle"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical">
        <a-form-item label="最小分值" name="minScore">
          <a-input-number
            v-model:value="formData.minScore"
            :min="0"
            style="width: 100%"
            placeholder="请输入该评分区间的最小分值"
          />
        </a-form-item>

        <a-form-item label="最大分值" name="maxScore">
          <a-input-number
            v-model:value="formData.maxScore"
            :min="0"
            style="width: 100%"
            placeholder="请输入该评分区间的最大分值"
          />
        </a-form-item>

        <a-form-item label="评估类别" name="category">
          <a-select
            v-model:value="formData.category"
            placeholder="请选择"
          >
            <a-select-option value="正常">正常</a-select-option>
            <a-select-option value="轻度">轻度</a-select-option>
            <a-select-option value="中度">中度</a-select-option>
            <a-select-option value="重度">重度</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="评估描述" name="description">
          <a-textarea
            v-model:value="formData.description"
            :rows="2"
            placeholder="请输入对该评分区间的专业评估描述，如：表现出轻微的焦虑症状，但对日常生活影响较小"
          />
        </a-form-item>

        <a-form-item label="建议" name="recommendation">
          <a-textarea
            v-model:value="formData.recommendation"
            :rows="2"
            placeholder="请输入针对该评分区间的专业建议，如：建议保持规律作息，适当运动，必要时寻求心理咨询"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { message } from "ant-design-vue"
import type { FormInstance } from "ant-design-vue"
import {
  getQuestionnaireScoreRules,
  createQuestionnaireScoreRules,
  updateQuestionnaireScoreRules,
  deleteQuestionnaireScoreRules,
} from "../../../api/admin/questions"

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()

// 问卷信息
const questionnaire = ref<any>({
  id: route.query.assessmentId,
  title: "问卷评分规则",
})

// 表格列定义
const columns = [
  {
    title: "最小分值",
    dataIndex: "minScore",
    key: "minScore",
    width: 100,
  },
  {
    title: "最大分值",
    dataIndex: "maxScore",
    key: "maxScore",
    width: 100,
  },
  {
    title: "评估类别",
    dataIndex: "category",
    key: "category",
    width: 120,
  },
  {
    title: "评估描述",
    dataIndex: "description",
    key: "description",
    width: 200,
  },
  {
    title: "建议",
    dataIndex: "recommendation",
    key: "recommendation",
    width: 200,
  },
  {
    title: "操作",
    key: "action",
    width: 150,
    fixed: "right",
  },
]

// 表格数据
const scoreRules = ref<any[]>([])
const loading = ref(false)

// 弹窗控制
const modalVisible = ref(false)
const modalTitle = ref("")
const formData = ref<any>({
  assessmentId: route.query.assessmentId,
  minScore: 0,
  maxScore: 0,
  category: "",
  description: "",
  recommendation: "",
})

// 表单校验规则
const rules = {
  minScore: [{ required: true, message: "请输入最小分值" }],
  maxScore: [{ required: true, message: "请输入最大分值" }],
  category: [{ required: true, message: "请输入评估类别" }],
  description: [{ required: true, message: "请输入评估描述" }],
  recommendation: [{ required: true, message: "请输入建议" }],
}

// 获取评分规则列表
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getQuestionnaireScoreRules(
      questionnaire.value.id as string
    )
    scoreRules.value = res.data
  } catch (error: any) {
    message.error(error.message || "获取数据失败")
  } finally {
    loading.value = false
  }
}

// 返回上一页
const handleBack = () => {
  router.back()
}

// 新增评分规则
const handleAdd = () => {
  modalTitle.value = "新增评分规则"
  formData.value = {
    assessmentId: questionnaire.value.id,
    minScore: 0,
    maxScore: 0,
    category: "",
    description: "",
    recommendation: "",
  }
  modalVisible.value = true
}

// 编辑评分规则
const handleEdit = (record: any) => {
  modalTitle.value = "编辑评分规则"
  formData.value = {
    ...record,
    assessmentId: questionnaire.value.id,
    originalCategory: record.category,
  }
  modalVisible.value = true
}

// 删除评分规则
const handleDelete = async (record: any) => {
  try {
    await deleteQuestionnaireScoreRules(
      questionnaire.value.id as string,
      record.category
    )
    message.success("删除成功")
    fetchData()
  } catch (error: any) {
    message.error(error.message || "删除失败")
  }
}

// 弹窗取消
const handleCancel = () => {
  modalVisible.value = false
  formRef.value?.resetFields()
  formData.value = {
    assessmentId: questionnaire.value.id,
    minScore: 0,
    maxScore: 0,
    category: "",
    description: "",
    recommendation: "",
  }
}

// 弹窗提交
const handleSubmit = () => {
  formRef.value?.validate().then(async () => {
    try {
      /* 判断是否有 originalCategory 属性，如果有则更新，否则创建 */
      if (formData.value.originalCategory) {
        await updateQuestionnaireScoreRules(formData.value)
        message.success("更新成功")
      } else {
        await createQuestionnaireScoreRules(formData.value)
        message.success("创建成功")
      }
      modalVisible.value = false
      fetchData()
    } catch (error: any) {
      message.error(error.message || "操作失败")
    }
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="less">
.score-list-container {
  padding: 24px;
  background: #fff;
  min-height: calc(100vh - 120px);

  .header {
    margin-bottom: 24px;
  }

  .action-bar {
    margin-bottom: 16px;
  }
}
</style>
