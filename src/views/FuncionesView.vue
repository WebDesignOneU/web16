<template>
  <div>
    <section>
      <h2>Funciones Programadas</h2>
      <p>Consulta las próximas presentaciones del Ballet UCB (datos desde la API).</p>
      <div style="display:flex;gap:1rem;flex-wrap:wrap;margin:1rem 0;align-items:end;">
        <label>Estado
          <select v-model="filtros.estado">
            <option value="">Todos</option>
            <option value="programada">Programada</option>
            <option value="agotada">Agotada</option>
            <option value="cancelada">Cancelada</option>
            <option value="finalizada">Finalizada</option>
          </select>
        </label>
        <button class="btn-hero-primary" style="border:none;cursor:pointer;padding:.5rem 1rem;" @click="load">Filtrar</button>
      </div>
      <p v-if="loading">Cargando funciones...</p>
      <p v-else-if="error" style="color:#e0b0b0;">{{ error }}</p>
      <div v-else class="table-responsive">
        <table>
          <thead><tr><th>ID</th><th>Obra</th><th>Fecha y hora</th><th>Lugar</th><th>Capacidad</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            <tr v-for="f in funciones" :key="f.id || f.id_funcion">
              <td>{{ f.id || f.id_funcion }}</td>
              <td>{{ f.titulo || f.obra?.titulo || f.id_obra }}</td>
              <td>{{ formatFecha(f.fecha_hora) }}</td>
              <td>{{ f.lugar || '-' }}</td>
              <td>{{ f.capacidad_total ?? '-' }}</td>
              <td>{{ f.estado || '-' }}</td>
              <td><router-link to="/reservas" class="btn-hero-secondary" style="font-size:.8rem;padding:.3rem .7rem;">Reservar</router-link></td>
            </tr>
            <tr v-if="!funciones.length"><td colspan="7">No hay funciones para los filtros seleccionados.</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2>Obras del Repertorio</h2>
      <p v-if="loadingObras">Cargando obras...</p>
      <div v-else class="grid-layout grid-3-cols">
        <article class="card" v-for="o in obras" :key="o.id || o.id_obra">
          <h3>{{ o.titulo }}</h3>
          <p>{{ o.descripcion || 'Sin descripción.' }}</p>
          <router-link :to="`/obras/${o.id || o.id_obra}`" style="color:var(--color-gold);">Ver funciones de la obra →</router-link>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const funciones = ref([])
const obras = ref([])
const loading = ref(true)
const loadingObras = ref(true)
const error = ref('')
const filtros = ref({ estado: '' })

function normalize(data){ const v=data?.data??data?.funciones??data?.obras??data?.items??data?.rows??data; return Array.isArray(v)?v:[] }
function formatFecha(f){ if(!f) return '-'; try { return new Date(f).toLocaleString('es-BO') } catch { return f } }

async function load() {
  loading.value = true; error.value = ''
  try {
    const params = {}
    if (filtros.value.estado) params.estado = filtros.value.estado
    const { data } = await api.get('/funciones', { params })
    funciones.value = normalize(data)
  } catch (e) {
    error.value = e.response?.data?.message || 'No se pudieron cargar las funciones.'
  } finally { loading.value = false }
}
async function loadObras() {
  try { const { data } = await api.get('/obras'); obras.value = normalize(data) } catch {}
  finally { loadingObras.value = false }
}
onMounted(() => { load(); loadObras() })
</script>
