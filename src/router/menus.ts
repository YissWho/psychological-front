import {
  HomeOutlined,
  FormOutlined,
  BarChartOutlined,
  UserOutlined,
  SettingOutlined,
  FileTextOutlined,
} from '@ant-design/icons-vue'

export const userMenus = [
  {
    key: '/users/home',
    icon: HomeOutlined,
    label: '首页',
  },
  {
    key: '/users/assessment',
    icon: FormOutlined,
    label: '心理评估',
  },
  {
    key: '/users/result',
    icon: BarChartOutlined,
    label: '评测结果',
  },
  {
    key: '/users/information',
    icon: UserOutlined,
    label: '心理档案',
  },
]

export const adminMenus = [
  {
    key: '/admin/dashboard',
    icon: HomeOutlined,
    label: '控制台',
  },
  {
    key: '/admin/users',
    icon: UserOutlined,
    label: '用户管理',
  },
  {
    key: '/admin/questionnaires',
    icon: FileTextOutlined,
    label: '问卷管理',
  },
  {
    key: '/admin/settings',
    icon: SettingOutlined,
    label: '系统设置',
  },
] 