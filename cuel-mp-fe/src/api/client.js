import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/manpower-plan',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// แนบ token ทุก request
client.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('mp_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// จัดการ 401 กลาง — เตะกลับหน้า Login
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      sessionStorage.removeItem('mp_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

export default client
