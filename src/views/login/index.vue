<template>
  <div class="login-container">
    <div class="background-squares">
      <div v-for="n in 7" :key="n" class="square"></div>
    </div>
    <div class="login-box">
      <div class="brand">
        <div class="logo-wrapper">
          <img src="/logo.png" alt="logo" class="logo animate__animated animate__fadeIn" />
        </div>
        <h1 class="animate__animated animate__fadeInDown">心理健康评估系统</h1>
      </div>

      <div class="mode-switch animate__animated animate__fadeIn">
        <div 
          class="switch-option" 
        >
          用户登录
        </div>
      </div>

      <a-form
        :model="form"
        :rules="rules"
        @finish="handleFinish"
        class="login-form animate__animated animate__fadeInUp"
      >
        <a-form-item name="username">
          <a-input
            v-model:value="form.username"
            placeholder="请输入用户名"
            :disabled="loading"
            size="large"
            class="custom-input"
          >
            <template #prefix>
              <user-outlined />
            </template>
          </a-input>
        </a-form-item>
        
        <a-form-item name="password">
          <a-input-password
            v-model:value="form.password"
            placeholder="请输入密码"
            :disabled="loading"
            size="large"
            class="custom-input"
          >
            <template #prefix>
              <lock-outlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-button
          type="primary"
          html-type="submit"
          :loading="loading"
          block
          size="large"
          class="submit-btn"
        >
          {{ loading ? '登录中...' : '登录' }}
        </a-button>

        <div class="register-link">
          还没有账号？
          <a @click="handleRegister" class="register-btn">立即注册</a>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
/* @ts-ignore */
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '../../store/module/user'
import { useRouter } from 'vue-router'
import './index.less'

interface LoginForm {
  username: string
  password: string
}
  
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const form = ref<LoginForm>({
  username: 'admin',
  password: '123456',
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名至少3个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' }
  ],
}

const handleFinish = async () => {
  try {
    loading.value = true
    await userStore.login(form.value)
    message.success('登录成功')
    router.push(userStore.isAdmin ? '/admin/dashboard' : '/users/home')
  } catch (error: any) {
    message.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

const handleRegister = () => {
  router.push('/register')
}
</script>
