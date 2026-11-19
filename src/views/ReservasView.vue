<template>
  <div>
    <section>
      <h2>Reservar Entradas</h2>
      <p>Selecciona una función y completa tus datos. Se generará un código de reserva (ej. BUCB-XXXX).</p>
      <form @submit.prevent="reservar" style="max-width:620px;">
        <label>Función
          <select v-model.number="form.id_funcion" required>
            <option disabled value="">Selecciona una función</option>
            <option v-for="f in funciones" :key="f.id||f.id_funcion" :value="f.id||f.id_funcion">
              #{{ f.id||f.id_funcion }} - {{ f.titulo || f.obra?.titulo || ('Obra '+f.id_obra) }} | {{ fmt(f.fecha_hora) }} | {{ f.lugar || 'Lugar por confirmar' }} ({{ f.estado }})
            </option>
          </select>
        </label>
        <label>Cantidad de entradas<input type="number" min="1" max="10" v-model.number="form.cantidad_entradas" required></label>
        <label>CI<input type="text" v-model="form.ci" required></label>
        <label>Nombre completo<input type="text" v-model="form.nombre_completo" required></label>
        <label>Correo electrónico<input type="email" v-model="form.correo" required></label>
        <label>Teléfono<input type="text" v-model="form.telefono"></label>
        <label style="display:flex;gap:.5rem;align-items:center;"><input type="checkbox" v-model="form.es_estudiante_ucb" style="width:auto;"> Soy estudiante UCB</label>
        <button type="submit" class="btn-hero-primary" style="border:none;cursor:pointer;">Confirmar reserva</button>
        <p v-if="resMsg" id="registro-msg" :style="{color: resOk ? 'var(--color-gold-light)' : '#ff8080'}">{{ resMsg }}</p>
        <div v-if="resCodigo" class="widget-card" style="margin-top:1rem;">
          <h3>Código de reserva</h3>
          <p style="font-size:1.4rem;font-weight:700;color:var(--color-gold);">{{ resCodigo }}</p>
          <p>Guarda este código para consultar el estado de tu reserva.</p>
        </div>
      </form>
      <p v-if="loadingFunciones"><small>Cargando funciones disponibles...</small></p>
    </section>

    <section>
      <h2>Consultar Reserva por Código</h2>
      <form @submit.prevent="consultar" style="max-width:420px;display:flex;gap:.5rem;flex-wrap:wrap;align-items:end;">
        <label style="flex:1;">Código<input type="text" v-model="codigo" placeholder="BUCB-XXXX" required></label>
        <button type="submit" class="btn-hero-secondary" style="cursor:pointer;">Consultar</button>
      </form>
      <p v-if="consultaMsg" :style="{color:'#e0b0b0'}">{{ consultaMsg }}</p>
      <div v-if="consulta" class="widget-card" style="margin-top:1rem;max-width:720px;">
        <h3>Reserva {{ consulta.codigo_reserva || codigo }}</h3>
        <p><strong>Estado:</strong> {{ consulta.estado }}</p>
        <p><strong>Cantidad:</strong> {{ consulta.cantidad_entradas }}</p>
        <p v-if="consulta.funcion"><strong>Función:</strong> {{ consulta.funcion.titulo || consulta.funcion.id_obra }} - {{ fmt(consulta.funcion.fecha_hora) }} ({{ consulta.funcion.lugar }})</p>
        <p v-else-if="consulta.fecha_hora"><strong>Fecha:</strong> {{ fmt(consulta.fecha_hora) }}</p>
        <p v-if="consulta.espectador"><strong>Espectador:</strong> {{ consulta.espectador.nombre_completo }} ({{ consulta.espectador.correo }})</p>
        <p v-else-if="consulta.nombre_completo"><strong>Nombre:</strong> {{ consulta.nombre_completo }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const funciones = ref([])
const loadingFunciones = ref(true)
const form = ref({ id_funcion:'', cantidad_entradas:1, ci:'', nombre_completo:'', correo:'', telefono:'', es_estudiante_ucb:false })
const resMsg = ref(''); const resOk = ref(false); const resCodigo = ref('')
const codigo = ref(''); const consulta = ref(null); const consultaMsg = ref('')

function normalize(data){ const v=data?.data??data?.funciones??data?.items??data?.rows??data; return Array.isArray(v)?v:[] }
function fmt(f){ if(!f) return '-'; try { return new Date(f).toLocaleString('es-BO') } catch { return f } }

onMounted(async () => {
  try { const { data } = await api.get('/funciones'); funciones.value = normalize(data) } catch {}
  finally { loadingFunciones.value = false }
})

async function reservar() {
  resMsg.value=''; resOk.value=false; resCodigo.value=''
  try {
    const payload = { ...form.value }
    if (!payload.telefono) delete payload.telefono
    const { data } = await api.post('/reservas', payload)
    const d = data.data || data
    resCodigo.value = d.codigo_reserva || d.codigo || ''
    resMsg.value = data.message || 'Reserva confirmada.'
    resOk.value = true
  } catch (e) {
    resMsg.value = e.response?.data?.message || 'No se pudo registrar la reserva.'
  }
}
async function consultar() {
  consulta.value = null; consultaMsg.value = ''
  try {
    const { data } = await api.get(`/reservas/codigo/${encodeURIComponent(codigo.value.trim())}`)
    consulta.value = data.data || data.reserva || data
  } catch (e) {
    consultaMsg.value = e.response?.data?.message || 'No se encontró una reserva con ese código.'
  }
}
</script>
