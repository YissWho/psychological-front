import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import Layout from "../layout/index.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/login/index.vue"),
  },
  {
    path: "/users",
    component: Layout,
    children: [
      {
        path: "home",
        name: "UserHome",
        component: () => import("../views/users/home/index.vue"),
        meta: {
          requiresAuth: true,
          title: "首页",
        },
      },
      {
        path: "assessment",
        name: "Assessment",
        component: () => import("../views/users/assessment/index.vue"),
        meta: {
          requiresAuth: true,
          title: "心理评估",
        },
      },
      {
        path: "assessment/create",
        name: "AssessmentCreate",
        component: () => import("../views/users/assessment/create.vue"),
        meta: {
          requiresAuth: true,
          title: "创建评测",
        },
      },
      {
        path: "result",
        name: "Result",
        component: () => import("../views/users/result/index.vue"),
        meta: {
          requiresAuth: true,
          title: "评测结果",
        },
      },
      {
        path: "information",
        name: "UserInformation",
        component: () => import("../views/users/information/index.vue"),
        meta: {
          requiresAuth: true,
          title: "心理档案",
        },
      },
    ],
  },
  {
    path: "/admin",
    component: Layout,
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("../views/admin/dashboard/index.vue"),
        meta: {
          requiresAuth: true,
          title: "控制台",
        },
      },
      {
        path: "users",
        name: "UserManagement",
        component: () => import("../views/admin/users/index.vue"),
        meta: {
          requiresAuth: true,
          title: "用户管理",
        },
      },
      {
        path: "questionnaires",
        name: "QuestionnaireManagement",
        component: () => import("../views/admin/questionnaires/index.vue"),
        meta: {
          requiresAuth: true,
          title: "问卷管理",
        },
      },
      {
        path: "scorelist",
        name: "ScoreList",
        component: () => import("../views/admin/questionnaires/ScoreList.vue"),
        meta: {
          requiresAuth: true,
          title: "评分规则",
        },
      },
      {
        path: "history",
        name: "History",
        component: () => import("../views/admin/history/index.vue"),
        meta: {
          requiresAuth: true,
          title: "用户测评记录",
        },
      },
      {
        path: "records",
        name: "UserRecords",
        component: () => import("../views/admin/records/index.vue"),
        meta: {
          requiresAuth: true,
          title: "用户心理档案",
        },
      },
    ],
  },
  {
    path: "/",
    redirect: "/users/home",
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login",
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token")
  const isAdmin = localStorage.getItem("isAdmin") === "true"

  if (to.meta.requiresAuth && !token) {
    next("/login")
  } else if (to.meta.requiresAuth && isAdmin) {
    next("/admin/dashboard")
  } else {
    next()
  }
})

export default router
