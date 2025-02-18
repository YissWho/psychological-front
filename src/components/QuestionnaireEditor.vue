<template>
  <div class="questionnaire-editor">
    <a-form layout="vertical" :model="formData">
      <!-- 基本信息 -->
      <div class="form-section">
        <div class="section-header">
          <div class="title">基本信息</div>
        </div>
        <div class="form-content">
          <a-form-item 
            label="问卷标题" 
            name="title" 
            :rules="[{ required: true, message: '请输入问卷标题' }]"
          >
            <a-input v-model:value="formData.title" placeholder="请输入问卷标题" />
          </a-form-item>
          
          <a-form-item 
            label="问卷描述" 
            name="description" 
            :rules="[{ required: true, message: '请输入问卷描述' }]"
          >
            <a-textarea 
              v-model:value="formData.description" 
              placeholder="请输入问卷描述"
              :auto-size="{ minRows: 2, maxRows: 6 }"
            />
          </a-form-item>
          
          <a-form-item 
            label="版本号" 
            name="version" 
            :rules="[{ required: true, message: '请输入版本号' }]"
          >
            <a-input v-model:value="formData.version" placeholder="请输入版本号" />
          </a-form-item>
        </div>
      </div>

      <!-- 问题列表 -->
      <div class="form-section">
        <div class="section-header">
          <div class="title">问题列表</div>
          <a-button type="primary" size="small" @click="addQuestion">
            添加问题
          </a-button>
        </div>

        <div class="questions-list">
          <template v-if="questions.length > 0">
            <div v-for="(question, qIndex) in questions" :key="qIndex" class="question-card">
              <div class="card-header">
                <span class="question-number">问题 {{ qIndex + 1 }}</span>
                <a-button type="link" danger @click="removeQuestion(qIndex)">删除问题</a-button>
              </div>
              
              <div class="card-content">
                <a-form-item 
                  :name="['questions', qIndex, 'text']" 
                  required 
                  :rules="[{ required: true, message: '请输入问题内容' }]"
                >
                  <a-textarea 
                    v-model:value="question.text" 
                    placeholder="请输入问题内容"
                    :auto-size="{ minRows: 2, maxRows: 4 }"
                  />
                </a-form-item>

                <div class="options-section">
                  <div class="section-header">
                    <div class="title">选项列表：输入选项内容和分值，从0开始递增</div>
                    <a-button type="link" size="small" @click="addOption(qIndex)">
                      添加选项
                    </a-button>
                  </div>

                  <div class="options-list">
                    <div v-for="(option, oIndex) in question.options" :key="oIndex" class="option-item">
                      <a-form-item-rest>
                        <div class="option-content">
                          <a-input 
                            v-model:value="option.text" 
                            placeholder="请输入选项内容"
                          />
                          <a-input-number
                            v-model:value="option.score"
                            :min="0"
                            :max="10"
                            placeholder="分值"
                            style="width: 80px"
                          />
                          <a-button type="link" danger @click="removeOption(qIndex, oIndex)">删除</a-button>
                        </div>
                      </a-form-item-rest>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="empty-questions">
            <div class="empty-text">暂无问题，请点击"添加问题"按钮添加</div>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="form-footer">
        <a-space>
          <a-button @click="handleCancel">取消</a-button>
          <a-button type="primary" @click="handleSubmit">确定</a-button>
        </a-space>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue', 'cancel', 'submit'])

const formData = ref({
  id: '',
  title: '',
  description: '',
  version: '',
})

const questions = ref<any[]>([])

// 监听外部数据变化
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    formData.value = {
      id: newVal.id || '',
      title: newVal.title || '',
      description: newVal.description || '',
      version: newVal.version || '',
    }
    
    if (newVal.questionnaire) {
      const questionnaireData = typeof newVal.questionnaire === 'string' 
        ? JSON.parse(newVal.questionnaire) 
        : newVal.questionnaire
      questions.value = questionnaireData.questions || []
    } else {
      questions.value = []
    }
  } else {
    // 重置表单
    formData.value = {
      id: '',
      title: '',
      description: '',
      version: '',
    }
    questions.value = []
  }
}, { immediate: true })

// 添加问题
const addQuestion = () => {
  questions.value.push({
    text: '',
    options: [
      { text: '完全没有', score: 0 },
      { text: '几天', score: 1 },
      { text: '超过一周', score: 2 },
      { text: '几乎每天', score: 3 }
    ]
  })
}

// 删除问题
const removeQuestion = (index: number) => {
  questions.value.splice(index, 1)
}

// 添加选项
const addOption = (questionIndex: number) => {
  questions.value[questionIndex].options.push({
    text: '',
    score: 0
  })
}

// 删除选项
const removeOption = (questionIndex: number, optionIndex: number) => {
  questions.value[questionIndex].options.splice(optionIndex, 1)
}

// 取消
const handleCancel = () => {
  emit('cancel')
}

// 提交
const handleSubmit = () => {
  // 验证表单
  if (!formData.value.title || !formData.value.description || !formData.value.version) {
    message.error('请填写完整的基本信息')
    return
  }

  if (questions.value.length === 0) {
    message.error('请至少添加一个问题')
    return
  }

  // 验证问题和选项
  for (let i = 0; i < questions.value.length; i++) {
    const question = questions.value[i]
    if (!question.text) {
      message.error(`第 ${i + 1} 个问题的内容不能为空`)
      return
    }
    if (question.options.length === 0) {
      message.error(`第 ${i + 1} 个问题至少需要一个选项`)
      return
    }
    for (let j = 0; j < question.options.length; j++) {
      const option = question.options[j]
      if (!option.text) {
        message.error(`第 ${i + 1} 个问题的第 ${j + 1} 个选项内容不能为空`)
        return
      }
    }
  }

  // 构造提交数据
  const submitData = {
    id: formData.value.id,
    title: formData.value.title,
    description: formData.value.description,
    version: formData.value.version,
    questionnaire: {
      questions: questions.value.map((q, qIndex) => ({
        id: q.id || qIndex + 1,
        text: q.text,
        options: q.options.map((o: any, oIndex: number) => ({
          id: o.id || oIndex + 1,
          text: o.text,
          score: o.score
        }))
      }))
    }
  }

  emit('submit', submitData)
}
</script>

<style scoped lang="less">
.questionnaire-editor {
  height: calc(700px - 55px);
  overflow-y: auto;
  background: #f5f5f5;

  .form-section {
    background: #fff;
    border-radius: 8px;
    margin: 16px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);

    &:last-child {
      margin-bottom: 16px;
    }

    .section-header {
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 16px;
        font-weight: 500;
        color: #1f1f1f;
      }
    }

    .form-content {
      padding: 16px;
    }
  }

  .questions-list {
    padding: 16px;

    .question-card {
      background: #fafafa;
      border: 1px solid #f0f0f0;
      border-radius: 8px;
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      .card-header {
        padding: 12px 16px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .question-number {
          font-size: 15px;
          font-weight: 500;
          color: #1f1f1f;
        }
      }

      .card-content {
        padding: 16px;
      }
    }

    .empty-questions {
      padding: 32px;
      text-align: center;
      background: #fafafa;
      border-radius: 8px;

      .empty-text {
        color: #999;
        font-size: 14px;
      }
    }
  }

  .options-section {
    margin-top: 16px;
    background: #fff;
    border-radius: 6px;
    border: 1px solid #f0f0f0;

    .section-header {
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 14px;
        font-weight: 500;
        color: #1f1f1f;
      }
    }

    .options-list {
      padding: 16px;

      .option-item {
        margin-bottom: 12px;

        &:last-child {
          margin-bottom: 0;
        }

        .option-content {
          display: flex;
          align-items: center;
          gap: 8px;

          .ant-input {
            flex: 1;
          }
        }
      }
    }
  }

  .form-footer {
    margin: 16px;
    text-align: center;
  }

  :deep(.ant-form-item) {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>

