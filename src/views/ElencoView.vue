<template>
  <section>
    <h2>Elenco del Ballet UCB</h2>
    <div style="display:flex;gap:1rem;flex-wrap:wrap;margin:1rem 0;align-items:end;">
      <label>Rol
        <select v-model="filtros.rol">
          <option value="">Todos</option>
          <option value="solista">Solista</option>
          <option value="cuerpo_de_ballet">Cuerpo de ballet</option>
          <option value="director">Director</option>
          <option value="maestro">Maestro</option>
        </select>
      </label>
      <button class="btn-hero-primary" style="border:none;cursor:pointer;padding:.5rem 1rem;" @click="load">Filtrar</button>
    </div>
    <p v-if="loading">Cargando elenco...</p>
    <p v-else-if="error" style="color:#e0b0b0;">{{ error }}</p>
    <div v-else class="grid-layout grid-3-cols">
      <article class="card" v-for="m in elenco" :key="m.id || m.id_integrante">
        <img v-if="m.fotografia_url" :src="m.fotografia_url" :alt="m.nombre_completo" style="width:100%;height:260px;object-fit:cover;border-radius:8px;margin-bottom:.5rem;">
        <h3>{{ m.nombre_completo }}</h3>
        <p><strong>Rol:</strong> {{ formatRol(m.rol) }}</p>
        <p>{{ m.biografia || 'Integrante del elenco del Ballet UCB.' }}</p>
        <p><small>{{ m.activo === false ? 'Inactivo' : 'Activo' }}</small></p>
      </article>
      <p v-if="!elenco.length">No se encontraron integrantes.</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const elenco = ref([])
const loading = ref(true)
const error = ref('')
const filtros = ref({ rol: '' })
function normalize(data){ const v=data?.data??data?.elenco??data?.items??data?.rows??data; return Array.isArray(v)?v:[] }
function formatRol(r){ return (r||'').replace(/_/g,' ') }

async function load() {
  loading.value = true; error.value = ''
  try {
    const params = {}
    if (filtros.value.rol) params.rol = filtros.value.rol
    const { data } = await api.get('/elenco', { params })
    elenco.value = normalize(data)
  } catch (e) {
    error.value = e.response?.data?.message || 'No se pudo cargar el elenco.'
  } finally { loading.value = false }
}
onMounted(load)
</script>
