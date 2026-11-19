<template>
  <div>
    <section>
      <h2>Convocatorias</h2>
      <p v-if="loading">Cargando convocatorias...</p>
      <p v-else-if="error" style="color:#e0b0b0;">{{ error }}</p>
      <div v-else class="grid-layout grid-2-cols">
        <article class="card" v-for="c in convocatorias" :key="c.id || c.id_convocatoria">
          <h3>{{ c.titulo }}</h3>
          <p><strong>Estado:</strong> {{ c.estado || '-' }}</p>
          <p><strong>Inicio:</strong> {{ fmt(c.fecha_inicio) }} &nbsp; <strong>Fin:</strong> {{ fmt(c.fecha_fin) }}</p>
          <p>{{ c.requisitos || 'Consulta los requisitos con la dirección.' }}</p>
          <p v-if="c.total_postulaciones != null"><small>Postulaciones: {{ c.total_postulaciones }}</small></p>
          <button class="btn-hero-primary" style="border:none;cursor:pointer;margin-top:.5rem;padding:.45rem 1rem;" @click="seleccionar(c)">Postularme</button>
        </article>
        <p v-if="!convocatorias.length">No hay convocatorias disponibles.</p>
      </div>
    </section>

    <section id="form-postulacion" v-if="seleccionada">
      <h2>Formulario de Postulación</h2>
      <p>Convocatoria: <strong>{{ seleccionada.titulo }}</strong> (ID {{ seleccionada.id || seleccionada.id_convocatoria }})</p>
      <form @submit.prevent="enviarPostulacion" style="max-width:620px;">
        <label>Nombre completo<input type="text" v-model="form.nombre_completo" required></label>
        <label>CI<input type="text" v-model="form.ci" required></label>
        <label>Correo electrónico<input type="email" v-model="form.email" required></label>
        <label>Teléfono<input type="text" v-model="form.telefono" required></label>
        <label>Carrera UCB<input type="text" v-model="form.carrera_ucb"></label>
        <label>Años de experiencia<input type="number" min="0" v-model.number="form.experiencia_anios"></label>
        <label>Estilo de danza<input type="text" v-model="form.estilo_danza" placeholder="Clásico, contemporáneo, folklórico..."></label>
        <label>Link video demo<input type="url" v-model="form.link_video_demo" placeholder="https://..."></label>
        <button type="submit" class="btn-hero-primary" style="border:none;cursor:pointer;">Enviar postulación</button>
        <p v-if="msg" id="registro-msg" :style="{color: msgOk ? 'var(--color-gold-light)' : '#ff8080'}">{{ msg }}</p>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const convocatorias = ref([])
const loading = ref(true)
const error = ref('')
const seleccionada = ref(null)
const msg = ref('')
const msgOk = ref(false)
const form = ref({ nombre_completo:'', ci:'', email:'', telefono:'', carrera_ucb:'', experiencia_anios:0, estilo_danza:'', link_video_demo:'' })

function normalize(data){ const v=data?.data??data?.convocatorias??data?.items??data?.rows??data; return Array.isArray(v)?v:[] }
function fmt(f){ if(!f) return '-'; try { return new Date(f).toLocaleDateString('es-BO') } catch { return f } }
function seleccionar(c){ seleccionada.value = c; msg.value=''; setTimeout(()=>document.getElementById('form-postulacion')?.scrollIntoView({behavior:'smooth'}), 50) }

async function load() {
  try {
    const { data } = await api.get('/convocatorias')
    convocatorias.value = normalize(data)
  } catch (e) { error.value = e.response?.data?.message || 'No se pudieron cargar las convocatorias.' }
  finally { loading.value = false }
}
async function enviarPostulacion() {
  msg.value = ''; msgOk.value = false
  try {
    const id = seleccionada.value.id || seleccionada.value.id_convocatoria
    const payload = { ...form.value }
    if (!payload.carrera_ucb) delete payload.carrera_ucb
    if (!payload.link_video_demo) delete payload.link_video_demo
    if (!payload.estilo_danza) delete payload.estilo_danza
    const { data } = await api.post(`/convocatorias/${id}/postulaciones`, payload)
    msg.value = data?.message || '¡Postulación enviada correctamente!'
    msgOk.value = true
    form.value = { nombre_completo:'', ci:'', email:'', telefono:'', carrera_ucb:'', experiencia_anios:0, estilo_danza:'', link_video_demo:'' }
  } catch (e) {
    msg.value = e.response?.data?.message || 'No se pudo enviar la postulación.'
  }
}
onMounted(load)
</script>
