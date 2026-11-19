import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Estilos del diseño base (web09)
import './assets/css/styles.css'
import './assets/css/landing.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
