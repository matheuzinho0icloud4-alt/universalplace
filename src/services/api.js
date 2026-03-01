import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error('VITE_API_URL environment variable is required');
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // enable cookies for httpOnly auth
})

// response interceptor: we used to redirect the browser on 401, but
// that caused a reload loop when the client was already (or soon would be)
// on the login/register page.  Instead we just log the condition and let
// callers handle it explicitly via try/catch.  The AuthContext already
// checks /auth/me and handles errors by clearing the user state.
api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response && err.response.status === 401) {
        // don't force a full page navigation; the component that issued the
        // request can choose what to do.  Logging here is helpful for
        // debugging in dev.
        console.warn("API 401 response", err.config?.url);
    }
    return Promise.reject(err)
  }
)

export default api