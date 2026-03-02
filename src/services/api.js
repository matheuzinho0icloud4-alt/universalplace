import axios from 'axios'

// VITE_API_URL MUST be configured during build via environment variable
// For dev: http://localhost:4000
// For prod: https://your-backend.onrender.com
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

if (!API_URL) {
  console.error('❌ VITE_API_URL is not configured. Frontend cannot reach backend.');
  console.error('Please configure VITE_API_URL in your deployment (Vercel environment variables)');
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // enable cookies for httpOnly auth
})

// response interceptor: we used to redirect the browser on 401, but
// that caused a reload loop when the client was already (or soon would be)
// on the login/register page.  Instead we just reject silently and let
// callers handle it explicitly via try/catch.  The AuthContext already
// checks /auth/me and handles errors by clearing the user state.
api.interceptors.response.use(
    (res) => res,
    (err) => {
      // 401 is expected when not authenticated - don't log it
      // Callers should handle 401 explicitly if needed
      if (err.response && err.response.status === 401) {
        // Silent rejection for 401 - it's expected behavior during auth checks
    }
    return Promise.reject(err)
  }
)

export default api