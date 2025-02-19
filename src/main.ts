import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { createPinia } from "pinia"
import Antd from "ant-design-vue"
import "ant-design-vue/dist/reset.css"
import "animate.css"
import { FastCrud } from "@fast-crud/fast-crud"
import "@fast-crud/fast-crud/dist/style.css"
import ui from "@fast-crud/ui-antdv"
import { FsExtendsUploader } from "@fast-crud/fast-extends"

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(Antd)
app.use(ui)
// 然后安装FastCrud
app.use(FastCrud)
app.use(FsExtendsUploader, {
  defaultType: "cos",
})

app.mount("#app")
