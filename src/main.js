import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.mount('#app')             
