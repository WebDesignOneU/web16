<template>
  <section style="max-width:520px;margin:0 auto;">
    <h2>Crear Cuenta</h2>
    <p>Regístrate como espectador o postulante.</p>
    <form @submit.prevent="onSubmit">
      <label>Correo electrónico<input type="email" v-model="email" required></label>
      <label>Contraseña<input type="password" v-model="password" required minlength="6"></label>
      <label>Rol
        <select v-model="rol">
          <option value="espectador">Espectador</option>
          <option value="postulante">Postulante</option>
        </select>
      </label>
      <button type="submit" class="btn-hero-primary" style="border:none;cursor:pointer;">Registrarme</button>
      <p v-if="msg" :style="{color: ok ? 'var(--color-gold-light)' : '#ff8080', marginTop: '.75rem'}">{{ msg }}</p>
    </form>
    <p style="margin-top:1rem;">¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link></p>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const email = ref('')
const password = ref('')
const rol = ref('espectador')
const msg = ref('')
const ok = ref(false)
const { register } = useAuth()

async function onSubmit() {
  msg.value = ''; ok.value = false
  try {
    const data = await register(email.value, password.value, rol.value)
    msg.value = data?.message || 'Cuenta creada correctamente. Ahora puedes iniciar sesión.'
    ok.value = true
  } catch (e) {
    msg.value = e.response?.data?.message || 'No se pudo completar el registro.'
  }
}
</script>
