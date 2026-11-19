import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import NoticiasView from '../views/NoticiasView.vue'
import NoticiaDetalleView from '../views/NoticiaDetalleView.vue'
import FuncionesView from '../views/FuncionesView.vue'
import ObraDetalleView from '../views/ObraDetalleView.vue'
import ElencoView from '../views/ElencoView.vue'
import ConvocatoriasView from '../views/ConvocatoriasView.vue'
import ReservasView from '../views/ReservasView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import PerfilView from '../views/PerfilView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/noticias', name: 'noticias', component: NoticiasView },
  { path: '/noticias/:slug', name: 'noticia-detalle', component: NoticiaDetalleView, props: true },
  { path: '/funciones', name: 'funciones', component: FuncionesView },
  { path: '/obras/:id', name: 'obra-detalle', component: ObraDetalleView, props: true },
  { path: '/elenco', name: 'elenco', component: ElencoView },
  { path: '/convocatorias', name: 'convocatorias', component: ConvocatoriasView },
  { path: '/reservas', name: 'reservas', component: ReservasView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/registro', name: 'registro', component: RegisterView },
  { path: '/perfil', name: 'perfil', component: PerfilView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router
