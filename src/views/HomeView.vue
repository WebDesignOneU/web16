<template>
  <div>
    <section class="hero-banner" aria-label="Bienvenida">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="hero-badge">Temporada de Gala 2026</span>
        <h2 class="hero-title">Pasión, Elegancia y Disciplina en el Escenario</h2>
        <p class="hero-subtitle">El Ballet UCB combina técnica clásica, expresión contemporánea y patrimonio folclórico boliviano.</p>
        <div class="hero-actions">
          <router-link to="/funciones" class="btn-hero-primary"><span>Ver Funciones</span> →</router-link>
          <router-link to="/convocatorias" class="btn-hero-secondary"><span>Postular a Audiciones</span> ✦</router-link>
        </div>
      </div>
    </section>

    <section class="stats-banner" aria-label="Estadísticas">
      <div class="stat-item"><span class="stat-number">15+</span><span class="stat-label">Años de Trayectoria</span></div>
      <div class="stat-item"><span class="stat-number">50+</span><span class="stat-label">Obras Representadas</span></div>
      <div class="stat-item"><span class="stat-number">30+</span><span class="stat-label">Bailarines</span></div>
      <div class="stat-item"><span class="stat-number">12</span><span class="stat-label">Premios Nacionales</span></div>
    </section>

    <section id="sobre-nosotros" class="grid-section">
      <div class="grid-layout grid-2-cols" style="align-items:center; gap:2rem;">
        <article>
          <h2>Formación Artística de Excelencia</h2>
          <p>Fundado bajo el Departamento de Cultura de la UCB, nuestra compañía reúne a estudiantes y bailarines dedicados al estudio profundo de la danza.</p>
          <blockquote>
            <p>"La danza es el lenguaje oculto del alma."</p>
            <footer>— <cite>Dirección Artística Ballet UCB</cite></footer>
          </blockquote>
        </article>
        <figure><img src="/assets/images/elenco-ucb.jpg" alt="Elenco UCB en ensayo" style="width:100%; border-radius:12px;"></figure>
      </div>
    </section>

    <section id="galeria-carrusel" class="carousel-section">
      <div class="carousel-section-header">
        <h2>Galería de Producciones</h2>
        <p>Momentos destacados de nuestras presentaciones.</p>
      </div>
      <div id="ballet-carousel" class="carousel-container" role="region" aria-label="Carrusel">
        <div class="carousel-track-wrapper">
          <div class="carousel-track">
            <div class="carousel-slide active">
              <div class="carousel-image-box"><img src="/assets/images/carrusel-1.jpg" alt="Lago de los Cisnes">
                <div class="carousel-caption"><span class="carousel-tag">Clásico</span><h3>El Lago de los Cisnes</h3><p>Gala inaugural con la suite completa de Tchaikovsky.</p></div>
              </div>
            </div>
            <div class="carousel-slide">
              <div class="carousel-image-box"><img src="/assets/images/carrusel-2.jpg" alt="Contemporáneo">
                <div class="carousel-caption"><span class="carousel-tag">Contemporáneo</span><h3>Ecos del Silencio</h3><p>Obra neoclásica de movimiento fluido y luz cenital.</p></div>
              </div>
            </div>
            <div class="carousel-slide">
              <div class="carousel-image-box"><img src="/assets/images/carrusel-3.jpg" alt="Punta">
                <div class="carousel-caption"><span class="carousel-tag">Técnica</span><h3>El Rigor de la Punta</h3><p>Horas de barra detrás de cada pirueta.</p></div>
              </div>
            </div>
            <div class="carousel-slide">
              <div class="carousel-image-box"><img src="/assets/images/carrusel-4.jpg" alt="Luz escénica">
                <div class="carousel-caption"><span class="carousel-tag">Escenografía</span><h3>Soles de Primavera</h3><p>Montaje lumínico de alta intensidad.</p></div>
              </div>
            </div>
          </div>
        </div>
        <button class="carousel-btn-prev" type="button" aria-label="Anterior">‹</button>
        <button class="carousel-btn-next" type="button" aria-label="Siguiente">›</button>
        <div class="carousel-controls-bar">
          <div class="carousel-dots"></div>
          <div class="carousel-info-group">
            <span class="carousel-counter">1 / 4</span>
            <button class="carousel-play-pause" type="button"><span class="play-pause-icon">❚❚</span><span class="play-pause-text">Pausar</span></button>
          </div>
        </div>
      </div>
    </section>

    <section id="repertorio-destacado">
      <h2 style="text-align:center;">Repertorio y Obras</h2>
      <p v-if="loadingObras" style="text-align:center;">Cargando obras desde la API...</p>
      <p v-else-if="obrasError" style="text-align:center;color:#e0b0b0;">{{ obrasError }}</p>
      <div v-else class="grid-layout grid-3-cols">
        <article class="card" v-for="obra in obras" :key="obra.id || obra.id_obra">
          <img v-if="obra.imagen_banner" :src="obra.imagen_banner" :alt="obra.titulo" style="width:100%; height:300px; object-fit:cover; border-radius:8px;">
          <img v-else src="/assets/images/danzas.jpg" :alt="obra.titulo" style="width:100%; height:300px; object-fit:cover; border-radius:8px;">
          <h3>{{ obra.titulo }}</h3>
          <p>{{ obra.descripcion || 'Obra del repertorio del Ballet UCB.' }}</p>
          <p v-if="obra.director"><small><strong>Director:</strong> {{ obra.director }}</small></p>
          <router-link :to="`/obras/${obra.id || obra.id_obra}`" class="btn-hero-secondary" style="display:inline-flex;margin-top:.5rem;font-size:.9rem;padding:.5rem 1rem;">Ver detalle</router-link>
        </article>
        <p v-if="!obras.length" style="text-align:center;">No hay obras registradas por ahora.</p>
      </div>
    </section>

    <section id="noticias-home">
      <h2>Últimas Noticias</h2>
      <p v-if="loadingNoticias">Cargando noticias...</p>
      <p v-else-if="noticiasError" style="color:#e0b0b0;">{{ noticiasError }}</p>
      <div v-else class="grid-layout grid-3-cols">
        <article class="card" v-for="n in noticias" :key="n.id || n.slug">
          <h3>{{ n.titulo }}</h3>
          <p>{{ resumen(n.contenido) }}</p>
          <router-link v-if="n.slug" :to="`/noticias/${n.slug}`" class="btn-hero-secondary" style="display:inline-flex;margin-top:.5rem;font-size:.85rem;padding:.4rem .9rem;">Leer más</router-link>
        </article>
        <p v-if="!noticias.length">Aún no hay noticias publicadas.</p>
      </div>
      <p style="margin-top:1rem;"><router-link to="/noticias">Ver todas las noticias →</router-link></p>
    </section>

    <section id="suscripcion">
      <h2>Suscríbete al boletín</h2>
      <p>Recibe novedades del Ballet UCB en tu correo.</p>
      <form @submit.prevent="suscribir" style="max-width:520px;">
        <label>Nombre<input type="text" v-model="sub.nombre"></label>
        <label>Correo electrónico<input type="email" v-model="sub.email" required></label>
        <button type="submit" class="btn-hero-primary" style="border:none;cursor:pointer;">Suscribirme</button>
        <p v-if="subMsg" id="registro-msg">{{ subMsg }}</p>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import api from '../services/api'

const obras = ref([])
const noticias = ref([])
const loadingObras = ref(true)
const loadingNoticias = ref(true)
const obrasError = ref('')
const noticiasError = ref('')
const sub = ref({ nombre: '', email: '' })
const subMsg = ref('')
let carouselInstance = null

function resumen(txt = '') { return txt.length > 140 ? txt.slice(0, 140) + '…' : txt }
function normalizeList(data) {
  const v = data?.data ?? data?.obras ?? data?.noticias ?? data?.items ?? data?.rows ?? data?.results ?? data
  return Array.isArray(v) ? v : []
}

async function loadObras() {
  try {
    const { data } = await api.get('/obras')
    obras.value = normalizeList(data)
  } catch (e) {
    obrasError.value = 'No se pudieron cargar las obras (verifica que la API esté disponible).'
  } finally { loadingObras.value = false }
}
async function loadNoticias() {
  try {
    const { data } = await api.get('/noticias', { params: { limit: 3 } })
    noticias.value = normalizeList(data)
  } catch (e) {
    noticiasError.value = 'No se pudieron cargar las noticias.'
  } finally { loadingNoticias.value = false }
}
async function suscribir() {
  subMsg.value = ''
  try {
    await api.post('/suscriptores', { email: sub.email, nombre: sub.nombre })
    subMsg.value = '¡Suscripción registrada correctamente!'
    sub.value = { nombre: '', email: '' }
  } catch (e) {
    subMsg.value = e.response?.data?.message || 'No se pudo registrar la suscripción.'
  }
}

onMounted(() => {
  loadObras(); loadNoticias();
  const initCarousel = () => {
    if (window.BalletCarousel && document.getElementById('ballet-carousel')) {
      carouselInstance = new window.BalletCarousel('#ballet-carousel', { autoplayInterval: 4500, loop: true })
    } else { setTimeout(initCarousel, 100) }
  }
  initCarousel()
})
onBeforeUnmount(() => { if (carouselInstance && carouselInstance.destroy) carouselInstance.destroy() })
</script>
