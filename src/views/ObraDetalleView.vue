<template>
  <section>
    <p><router-link to="/funciones">← Volver a funciones</router-link></p>
    <p v-if="loading">Cargando obra...</p>
    <p v-else-if="error" style="color:#e0b0b0;">{{ error }}</p>
    <article v-else-if="obra">
      <h2>{{ obra.titulo }}</h2>
      <img v-if="obra.imagen_banner" :src="obra.imagen_banner" :alt="obra.titulo" style="width:100%;max-height:420px;object-fit:cover;border-radius:12px;margin:1rem 0;">
      <p>{{ obra.descripcion || 'Sin descripción.' }}</p>
      <p v-if="obra.director"><strong>Director:</strong> {{ obra.director }}</p>

      <h3 style="margin-top:2rem;">Funciones programadas</h3>
      <div class="table-responsive" v-if="funciones.length">
        <table>
          <thead><tr><th>Fecha y hora</th><th>Lugar</th><th>Capacidad</th><th>Estado</th></tr></thead>
          <tbody>
            <tr v-for="f in funciones" :key="f.id || f.id_funcion">
              <td>{{ formatFecha(f.fecha_hora) }}</td>
              <td>{{ f.lugar || '-' }}</td>
              <td>{{ f.capacidad_total ?? '-' }}</td>
              <td>{{ f.estado || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else>No hay funciones registradas para esta obra.</p>
    </article>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '../services/api'

const props = defineProps({ id: [String, Number] })
const obra = ref(null)
const funciones = ref([])
const loading = ref(true)
const error = ref('')
function formatFecha(f){ if(!f) return '-'; try { return new Date(f).toLocaleString('es-BO') } catch { return f } }

async function load() {
  loading.value = true; error.value = ''
  try {
    const { data } = await api.get(`/obras/${props.id}`)
    const payload = data.data || data.obra || data
    obra.value = payload
    funciones.value = payload.funciones || data.funciones || []
  } catch (e) {
    error.value = e.response?.data?.message || 'No se pudo cargar la obra.'
  } finally { loading.value = false }
}
onMounted(load)
watch(() => props.id, load)
</script>
