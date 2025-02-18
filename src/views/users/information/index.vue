<template>
  <div>
    <a-card title="心理档案" :loading="loading || submitting">
      <a-form :model="form" :rules="rules" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="姓名" name="name">
              <a-input v-model:value="form.name" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="性别" name="gender">
              <a-select v-model:value="form.gender">
                <a-select-option value="MALE">男</a-select-option>
                <a-select-option value="FEMALE">女</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="年龄" name="age">
              <a-input-number v-model:value="form.age" :min="1" :max="120" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="职业" name="occupation">
              <a-input v-model:value="form.occupation" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="压力水平" name="stressLevel">
              <a-select v-model:value="form.stressLevel">
                <a-select-option value="LOW">低</a-select-option>
                <a-select-option value="MEDIUM">中</a-select-option>
                <a-select-option value="HIGH">高</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="睡眠质量" name="sleepQuality">
              <a-select v-model:value="form.sleepQuality">
                <a-select-option value="POOR">差</a-select-option>
                <a-select-option value="NORMAL">一般</a-select-option>
                <a-select-option value="GOOD">良好</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="情绪状态" name="emotionalState">
              <a-input v-model:value="form.emotionalState" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="备注" name="notes">
              <a-textarea v-model:value="form.notes" :rows="2" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item>
          <a-button
            type="primary"
            @click="handleSubmit"
            style="margin-right: 10px"
            >提交</a-button
          >
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRequest } from "vue-request"
import {
  getUserPsychologicalFile,
  updateUserPsychologicalFile,
} from "../../../api/user/users"
import { message } from "ant-design-vue"

const form = ref({
  name: "",
  gender: "",
  age: "",
  occupation: "",
  stressLevel: "",
  sleepQuality: "",
  emotionalState: "",
  notes: "",
})

const { loading, refresh: refreshData } = useRequest(getUserPsychologicalFile, {
  onSuccess: (result: any) => {
    const data = result.data
    delete data?.id
    delete data?.userId
    delete data?.createdAt
    delete data?.updatedAt
    delete data?.isDeleted
    form.value = data
  },
})

const { loading: submitting, run: submitData } = useRequest(
  updateUserPsychologicalFile,
  {
    manual: true, 
    debounceInterval: 500,
    onSuccess: () => {
      message.success("更新成功")
      refreshData()
    },
  }
)

const handleSubmit = async () => {
  submitData(form.value)
}

const rules = ref({
  name: [{ required: true, message: "请输入姓名" }],
  gender: [{ required: true, message: "请选择性别" }],
  age: [{ required: true, message: "请输入年龄" }],
  occupation: [{ required: true, message: "请输入职业" }],
  stressLevel: [{ required: true, message: "请选择压力水平" }],
  sleepQuality: [{ required: true, message: "请选择睡眠质量" }],
  emotionalState: [{ required: true, message: "请输入情绪状态" }],
})
</script>

<style scoped></style>
