import { defineStore } from 'pinia'
import { login } from '../../api/user/login'
import { removeToken, setToken, getToken, getTokenAdmin, setTokenAdmin } from '../../utils/utils'
import { getUserInfo } from '../../api/user/users'
export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken() || null,
    userInfo: {
      id: 0,
      username: '',
      password: '',
      email: '',
      avatar: '',
      role: '',
    },
    isAdmin: getTokenAdmin() === 'true' || false,
  }),
  actions: {
    setToken(token: any) {
      this.token = token
    },
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo
    },
    setIsAdmin(isAdmin: boolean) {
      this.isAdmin = isAdmin
    },
    async login(data: any) {
      const res = await login(data)
      const loginData = JSON.parse(res.data)
      this.setToken(loginData.token)
      setToken(loginData.token)
      this.setIsAdmin(loginData?.role === 'ADMIN')
      setTokenAdmin(loginData?.role === 'ADMIN')
    },
    async getUserInfo() {
      const res = await getUserInfo()
      this.setUserInfo(res.data)
    },
    async logout() {
      this.setToken(null)
      this.setUserInfo({})
      this.setIsAdmin(false)
      removeToken()
    },
  },
  persist: true,
})