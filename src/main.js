import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@/assets/css/bootstrap.min.css'
import '@/assets/css/style.css'


const app = createApp(App)

app.use(router)

app.mount('#app')
