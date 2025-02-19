<template>
  <div style="padding: 24px">
    <a-card title="心理档案" :loading="loading || submitting">
      <a-form :model="form" :rules="rules" layout="vertical">
        <!-- 头像上传 -->
        <div style="text-align: center; margin-bottom: 32px">
          <a-space direction="vertical" size="middle" align="center">
            <a-avatar 
              :src="form.avatar ? `http://localhost:8080/api${form.avatar}` : ''" 
              :size="120"
            >
              <template #icon><UserOutlined style="font-size: 48px" /></template>
            </a-avatar>
            <a-upload
              name="file"
              :action="uploadUrl"
              :show-upload-list="false"
              :before-upload="beforeUpload"
              @change="handleAvatarChange"
            >
              <a-button type="primary">更换头像</a-button>
            </a-upload>
          </a-space>
        </div>

        <!-- 基本信息 -->
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="姓名" name="name">
              <a-input v-model:value="form.name" placeholder="请输入姓名" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="性别" name="gender">
              <a-select v-model:value="form.gender" placeholder="请选择性别">
                <a-select-option value="MALE">男</a-select-option>
                <a-select-option value="FEMALE">女</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="年龄" name="age">
              <a-input-number v-model:value="form.age" :min="1" :max="120" placeholder="请输入年龄" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider />

        <!-- 详细信息 -->
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="职业" name="occupation">
              <a-input v-model:value="form.occupation" placeholder="请输入职业" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="压力水平" name="stressLevel">
              <a-select v-model:value="form.stressLevel" placeholder="请选择压力水平">
                <a-select-option value="LOW">低</a-select-option>
                <a-select-option value="MEDIUM">中</a-select-option>
                <a-select-option value="HIGH">高</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="睡眠质量" name="sleepQuality">
              <a-select v-model:value="form.sleepQuality" placeholder="请选择睡眠质量">
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
              <a-input v-model:value="form.emotionalState" placeholder="请描述当前的情绪状态" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="备注" name="notes">
              <a-textarea 
                v-model:value="form.notes" 
                :rows="2" 
                placeholder="请输入其他需要备注的信息"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <div style="text-align: center; margin-top: 24px">
          <a-button type="primary" @click="handleSubmit" :loading="submitting">
            保存更新
          </a-button>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRequest } from "vue-request"
import { message } from "ant-design-vue"
import { UserOutlined } from '@ant-design/icons-vue'
import { useUserStore } from "../../../store/module/user"
import {
  getUserPsychologicalFile,
  updateUserPsychologicalFile,
} from "../../../api/user/users"

const uploadUrl = "http://localhost:8080/api/files/avatar"
const userStore = useUserStore()

const form = ref({
  name: "",
  gender: "",
  age: "",
  occupation: "",
  stressLevel: "",
  sleepQuality: "",
  emotionalState: "",
  notes: "",
  avatar: "",
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
      userStore.getUserInfo()
    },
  }
)

// 上传前校验
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件！')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片必须小于2MB！')
    return false
  }
  return true
}

// 处理头像上传
const handleAvatarChange = (info: any) => {
  if (info.file.status === 'done') {
    if (info.file.response.code === 200) {
      form.value.avatar = info.file.response.data
    } else {
      message.error(info.file.response.message || '头像上传失败')
    }
  } else if (info.file.status === 'error') {
    message.error('头像上传失败')
  }
}

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
