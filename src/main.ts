
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'
import { vuetify } from '@/plugins/vuetify'

import 'element-plus/theme-chalk/dark/css-vars.css'
import "@/assets/main.less"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
