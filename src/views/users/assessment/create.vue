<template>
  <div class="assessment-create">
    <a-page-header
      :title="assessmentData.title"
      :sub-title="assessmentData.description"
      @back="handleBack"
    />

    <div class="questionnaire-content" v-if="!loading">
      <a-form :model="formState" @finish="handleSubmit">
        <div class="questions-list">
          <div
            v-for="question in questions"
            :key="question.id"
            class="question-item"
          >
            <a-form-item
              :name="['answers', question.id]"
              :rules="[{ required: true, message: '请选择答案' }]"
            >
              <div class="question-title">{{ question.text }}</div>
              <a-radio-group v-model:value="formState.answers[question.id]">
                <a-radio
                  v-for="option in question.options"
                  :key="option.id"
                  :value="option.id"
                  class="option-item"
                >
                  {{ option.text }}
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </div>
        </div>

        <div class="form-actions">
          <a-button @click="handleBack">取消</a-button>
          <a-button type="primary" html-type="submit" :loading="submitting">
            提交评估
          </a-button>
        </div>
      </a-form>
    </div>

    <div v-else class="loading-container">
      <a-spin size="large" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { message } from "ant-design-vue"
import {
  getAssessmentDetail,
  submitAssessment,
} from "../../../api/user/assessments"
import { useRequest } from "vue-request"

const route = useRoute()
const router = useRouter()
const submitting = ref(false)

const assessmentData = ref<any>({
  id: 0,
  title: "",
  description: "",
  questionnaire: "",
})

const questions = ref<any[]>([])
const formState = ref({
  answers: {} as Record<number, number | null>,
})

// 获取问卷详情
const { loading, run: fetchDetail } = useRequest(
  () => getAssessmentDetail(route.query.id as string),
  {
    manual: true,
    onSuccess: (result) => {
      assessmentData.value = result.data
      // 解析问卷数据
      const questionnaireData = JSON.parse(result.data.questionnaire)
      questions.value = questionnaireData.questions
      // 初始化答案对象
      questions.value.forEach((question: any) => {
        formState.value.answers[question.id] = null
      })
    },
    onError: (error) => {
      message.error("获取问卷详情失败：" + error.message)
      router.push("/users/assessment")
    },
  }
)

// 提交问卷
const { run: submitForm } = useRequest(submitAssessment, {
  manual: true,
  onSuccess: () => {
    message.success("提交成功")
    router.push("/users/result")
  },
  onError: (error) => {
    message.error("提交失败：" + error.message)
  },
})

const handleSubmit = async () => {
  // 检查是否所有题目都已回答
  const unanswered = questions.value.some((q) => !formState.value.answers[q.id])
  if (unanswered) {
    message.warning("请回答所有问题")
    return
  }

  submitting.value = true
  try {
    const answers = Object.entries(formState.value.answers).map(
      ([questionId, optionId]) => ({
        questionId: parseInt(questionId),
        optionId,
      })
    )

    await submitForm({
      assessmentId: assessmentData.value.id,
      answers,
    })
  } finally {
    submitting.value = false
  }
}

const handleBack = () => {
  router.push("/users/assessment")
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped lang="less">
.assessment-create {
  .questionnaire-content {
    margin-top: 24px;

    .questions-list {
      .question-item {
        margin-bottom: 32px;
        padding: 24px;
        background: #fafafa;
        border-radius: 8px;

        .question-title {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 16px;
          color: #333;
        }

        .option-item {
          display: block;
          margin: 12px 0;

          &:hover {
            background: #f0f0f0;
          }
        }
      }
    }
  }

  .form-actions {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
  }
}
</style>
