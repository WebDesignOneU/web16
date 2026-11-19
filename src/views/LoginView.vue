<template>
  <section style="max-width:520px;margin:0 auto;">
    <h2>Iniciar Sesión</h2>
    <p>Accede con tu cuenta para gestionar tu perfil y reservas vinculadas.</p>
    <form @submit.prevent="onSubmit">
      <label>Correo electrónico<input type="email" v-model="email" required></label>
      <label>Contraseña<input type="password" v-model="password" required></label>
      <button type="submit" class="btn-hero-primary" style="border:none;cursor:pointer;">Ingresar</button>
      <p v-if="msg" style="color:#ff8080;margin-top:.75rem;">{{ msg }}</p>
    </form>
    <p style="margin-top:1rem;">¿No tienes cuenta? <router-link to="/registro">Regístrate</router-link></p>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const email = ref('')
const password = ref('')
const msg = ref('')
const router = useRouter()
const route = useRoute()
const { login } = useAuth()

async function onSubmit() {
  msg.value = ''
  try {
    await login(email.value, password.value)
    router.push(route.query.redirect || '/perfil')
  } catch (e) {
    msg.value = e.response?.data?.message || 'Credenciales inválidas o error del servidor.'
  }
}
</script>
