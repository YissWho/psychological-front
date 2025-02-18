<template>
  <a-layout class="layout">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="sider"
    >
      <div class="logo">
        <img src="/logo.png" alt="logo" />
        <span v-show="!collapsed">心理健康评估系统</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        @click="handleMenuClick"
      >
        <a-menu-item v-for="menu in currentMenus" :key="menu.key">
          <template #icon>
            <component :is="menu.icon" />
          </template>
          <span>{{ menu.label }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="header">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined
          v-else
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />

        <div class="header-right">
          <a-dropdown>
            <div class="user-info">
              <a-avatar>
                <template #icon><UserOutlined /></template>
              </a-avatar>
              <span class="username">{{ username }}</span>
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="handleProfile">
                  <user-outlined />
                  <span>个人中心</span>
                </a-menu-item>
                <a-menu-item @click="handleLogout">
                  <logout-outlined />
                  <span>退出登录</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useUserStore } from "../store/module/user"
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons-vue"
import { userMenus, adminMenus } from "../router/menus"
import { message } from "ant-design-vue"

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const collapsed = ref(false)
const selectedKeys = ref<string[]>([route.path])

// 从 store 中获取用户信息
const isAdmin = computed(() => userStore.isAdmin)
console.log(isAdmin.value)
/* 获取用户信息 */
userStore.getUserInfo()
const username = computed(() => userStore.userInfo?.username || "未知用户")

// 根据用户类型显示对应菜单
const currentMenus = computed(() => (isAdmin.value ? adminMenus : userMenus))

// 监听路由变化，更新选中菜单
watch(
  () => route.path,
  (newPath) => {
    selectedKeys.value = [newPath]
  },
  { immediate: true }
)

const handleMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}

const handleProfile = () => {
  router.push(isAdmin.value ? "/admin/profile" : "/users/profile")
}

const handleLogout = async () => {
  try {
    await userStore.logout()
    message.success("退出成功")
    router.push("/login")
  } catch (error: any) {
    message.error(error.message || "退出失败")
  }
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
}

.sider {
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
}

.logo {
  height: 64px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  transition: all 0.2s;
}

.logo img {
  height: 32px;
  width: 32px;
}

.logo span {
  color: white;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  opacity: 1;
}

.header {
  background: #fff;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.trigger {
  padding: 0 24px;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.header-right {
  padding-right: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  font-size: 14px;
}

.content {
  margin: 24px;
  background: #fff;
  border-radius: 4px;
  min-height: 280px;
}
</style>
