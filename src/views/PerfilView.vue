<template>
  <section style="max-width:720px;margin:0 auto;">
    <h2>Mi Perfil</h2>
    <div v-if="!token">
      <p>Debes iniciar sesión para ver tu perfil.</p>
      <router-link to="/login" class="btn-hero-primary">Ir a login</router-link>
    </div>
    <template v-else>
      <p v-if="loading">Cargando perfil...</p>
      <p v-else-if="error" style="color:#e0b0b0;">{{ error }}</p>
      <div v-else class="widget-card">
        <h3>Datos de la cuenta</h3>
        <p><strong>Email:</strong> {{ perfil.email || user?.email || '-' }}</p>
        <p v-if="perfil.rol || user?.rol"><strong>Rol:</strong> {{ perfil.rol || user?.rol }}</p>
        <p v-if="perfil.id || perfil.id_usuario"><strong>ID:</strong> {{ perfil.id || perfil.id_usuario }}</p>
        <pre v-if="raw" style="margin-top:1rem;white-space:pre-wrap;font-size:.85rem;color:var(--text-secondary);">{{ raw }}</pre>
        <div style="margin-top:1rem;display:flex;gap:.5rem;">
          <button class="btn-hero-secondary" style="cursor:pointer;" @click="load">Actualizar</button>
          <button class="btn-hero-primary" style="border:none;cursor:pointer;" @click="doLogout">Cerrar sesión</button>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { user, token, fetchPerfil, logout } = useAuth()
const perfil = ref({})
const loading = ref(false)
const error = ref('')
const raw = computed(() => {
  const extra = { ...perfil.value }
  delete extra.email; delete extra.rol; delete extra.id; delete extra.id_usuario
  return Object.keys(extra).length ? JSON.stringify(extra, null, 2) : ''
})

async function load() {
  if (!token.value) return
  loading.value = true; error.value = ''
  try { perfil.value = await fetchPerfil() || {} }
  catch (e) { error.value = e.response?.data?.message || 'No se pudo cargar el perfil.' }
  finally { loading.value = false }
}
function doLogout() { logout(); router.push('/') }
onMounted(load)
</script>
