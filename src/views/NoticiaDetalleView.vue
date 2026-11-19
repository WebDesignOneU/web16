<template>
  <section>
    <p><router-link to="/noticias">← Volver a noticias</router-link></p>
    <p v-if="loading">Cargando noticia...</p>
    <p v-else-if="error" style="color:#e0b0b0;">{{ error }}</p>
    <article v-else-if="noticia">
      <h2>{{ noticia.titulo }}</h2>
      <p v-if="noticia.destacado"><small style="color:var(--color-gold);">★ Noticia destacada</small></p>
      <img v-if="noticia.imagen_url" :src="noticia.imagen_url" :alt="noticia.titulo" style="width:100%;max-height:420px;object-fit:cover;border-radius:12px;margin:1rem 0;">
      <div style="white-space:pre-line; line-height:1.8;">{{ noticia.contenido }}</div>
    </article>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '../services/api'

const props = defineProps({ slug: String })
const noticia = ref(null)
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true; error.value = ''
  try {
    const { data } = await api.get(`/noticias/${props.slug}`)
    noticia.value = data.data || data.noticia || data
  } catch (e) {
    error.value = e.response?.data?.message || 'No se pudo cargar la noticia.'
  } finally { loading.value = false }
}
onMounted(load)
watch(() => props.slug, load)
</script>
