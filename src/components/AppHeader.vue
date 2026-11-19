<template>
  <header role="banner" class="animate-header">
    <div class="header-top">
      <div class="header-titles">
        <h1><router-link to="/" style="text-decoration:none;color:inherit;">Ballet UCB</router-link></h1>
        <p><small>Universidad Católica Boliviana "San Pablo" | La Paz - Bolivia</small></p>
      </div>
      <div style="display:flex;gap:.5rem;align-items:center;flex-wrap:wrap;justify-content:flex-end;">
        <button id="theme-toggle" class="theme-toggle-btn" type="button" @click="toggleTheme" aria-label="Cambiar tema">
          <span>{{ isLight ? '☀️' : '🌙' }}</span> <span>{{ isLight ? 'Modo Claro' : 'Modo Oscuro' }}</span>
        </button>
        <router-link v-if="!user" to="/login" class="theme-toggle-btn" style="text-decoration:none;">Ingresar</router-link>
        <router-link v-else to="/perfil" class="theme-toggle-btn" style="text-decoration:none;">{{ user.email || 'Mi perfil' }}</router-link>
      </div>
    </div>
    <nav aria-label="Navegación principal del sitio" :class="{ 'is-open': navOpen }">
      <button type="button" class="nav-toggle" aria-label="Abrir menú" :aria-expanded="navOpen" @click="navOpen=!navOpen">
        <span class="nav-bars"><span></span><span></span><span></span></span> Menú
      </button>
      <ul>
        <li><router-link to="/" @click="navOpen=false">Inicio</router-link></li>
        <li><router-link to="/noticias" @click="navOpen=false">Noticias</router-link></li>
        <li><router-link to="/funciones" @click="navOpen=false">Funciones</router-link></li>
        <li><router-link to="/elenco" @click="navOpen=false">Elenco</router-link></li>
        <li><router-link to="/convocatorias" @click="navOpen=false">Convocatorias</router-link></li>
        <li><router-link to="/reservas" @click="navOpen=false">Reservas</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'

const navOpen = ref(false)
const isLight = ref(false)
const { user, refresh } = useAuth()

function applyTheme(t) {
  isLight.value = t === 'light'
  if (t === 'light') document.documentElement.setAttribute('data-theme', 'light')
  else document.documentElement.removeAttribute('data-theme')
  localStorage.setItem('ballet_theme', t)
}
function toggleTheme() { applyTheme(isLight.value ? 'dark' : 'light') }

onMounted(() => {
  applyTheme(localStorage.getItem('ballet_theme') || 'dark')
  refresh()
})
</script>
