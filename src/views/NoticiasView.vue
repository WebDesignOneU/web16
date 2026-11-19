<template>
  <section>
    <h2>Noticias del Ballet UCB</h2>
    <p v-if="loading">Cargando noticias...</p>
    <p v-else-if="error" style="color:#e0b0b0;">{{ error }}</p>
    <div v-else class="grid-layout grid-2-cols">
      <article class="card" v-for="n in noticias" :key="n.id || n.slug">
        <img v-if="n.imagen_url" :src="n.imagen_url" :alt="n.titulo" style="width:100%;max-height:220px;object-fit:cover;border-radius:8px;margin-bottom:.75rem;">
        <h3>{{ n.titulo }}</h3>
        <p><small v-if="n.destacado" style="color:var(--color-gold);">★ Destacado</small></p>
        <p>{{ resumen(n.contenido) }}</p>
        <router-link v-if="n.slug" :to="`/noticias/${n.slug}`" class="btn-hero-primary" style="display:inline-flex;margin-top:.5rem;border:none;font-size:.9rem;padding:.45rem 1rem;">Leer noticia</router-link>
      </article>
      <p v-if="!noticias.length">No hay noticias disponibles.</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const noticias = ref([])
const loading = ref(true)
const error = ref('')
function resumen(t=''){ return t.length>220 ? t.slice(0,220)+'…' : t }
function normalize(data){ const v=data?.data??data?.noticias??data?.items??data?.rows??data; return Array.isArray(v)?v:[] }

onMounted(async () => {
  try {
    const { data } = await api.get('/noticias')
    noticias.value = normalize(data)
  } catch (e) {
    error.value = e.response?.data?.message || 'No se pudieron cargar las noticias.'
  } finally { loading.value = false }
})
</script>
