import axios from 'axios';
import { getApiBaseUrl } from '../config/environment';

const api = axios.create({
  baseURL: `${getApiBaseUrl()}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── AUTH ────────────────────────────────────────────
export const loginUser = (data) =>
  api.post('/auth/login', data);

/**
 * Registra un nuevo usuario en la plataforma
 *
 * @param {Object} data - Datos de registro
 * @param {string} data.nombre   - Nombre completo del usuario
 * @param {string} data.email    - Email único del usuario
 * @param {string} data.password - Contraseña (mínimo 6 caracteres)
 * @param {string} data.rol      - Rol: "creador", "mentor" o "empresa"
 * @param {Array}  data.skills   - Habilidades del usuario
 * @param {string} data.avatar   - Avatar en base64
 */
export const registerUser = (data) => api.post("/auth/register", data);

export const logoutUser = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

// ─── PROYECTOS ───────────────────────────────────────
export const getProyectos = () =>
  api.get('/proyectos');

export const createProyecto = (data) =>
  api.post('/proyectos', data);

export const updateProyecto = (id, data) =>
  api.put(`/proyectos/${id}`, data);

export const deleteProyecto = (id) =>
  api.delete(`/proyectos/${id}`);

export default api;