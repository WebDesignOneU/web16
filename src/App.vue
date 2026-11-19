<template>
  <div>
    <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
    <AppHeader />
    <main id="main-content" role="main">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script>
