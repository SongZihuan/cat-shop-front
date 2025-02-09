import { createApp } from 'vue'
import App from './App.vue'
import pinia from '@/store'
import router from '@/router'
import ElementPlus from 'element-plus'
import Vant from 'vant'
import 'normalize.css'
import 'element-plus/dist/index.css'
import '@/assets/styles/background.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(Vant)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
