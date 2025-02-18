import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // 如果你需要自定义主题，可以在这里添加
        // modifyVars: {
        //   'primary-color': '#1DA57A',
        // },
      },
    },
  },
})
