import { ref } from 'vue'
import api from '../services/api'

const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const token = ref(localStorage.getItem('token'))

export function useAuth() {
  function setSession(t, u) {
    token.value = t
    user.value = u
    if (t) localStorage.setItem('token', t); else localStorage.removeItem('token')
    if (u) localStorage.setItem('user', JSON.stringify(u)); else localStorage.removeItem('user')
  }
  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    // API puede devolver {token, user} o {data:{token,user}} o {success,data}
    const payload = data.data || data
    const t = payload.token || data.token
    const u = payload.user || payload.usuario || data.user || { email }
    setSession(t, u)
    return payload
  }
  async function register(email, password, rol = 'espectador') {
    const { data } = await api.post('/auth/register', { email, password, rol })
    return data
  }
  async function fetchPerfil() {
    const { data } = await api.get('/auth/perfil')
    const p = data.data || data.usuario || data.user || data
    user.value = { ...user.value, ...p }
    localStorage.setItem('user', JSON.stringify(user.value))
    return p
  }
  function logout() { setSession(null, null) }
  function refresh() {
    token.value = localStorage.getItem('token')
    user.value = JSON.parse(localStorage.getItem('user') || 'null')
  }
  return { user, token, login, register, logout, fetchPerfil, refresh, setSession }
}
