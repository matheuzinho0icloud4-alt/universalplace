import { createContext, useState, useEffect, useContext } from "react"
import api from "../services/api"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!currentUser

  // Check if user is still authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get('/auth/me')
        setCurrentUser(data.user)
      } catch (err) {
        // 401 or other error = not authenticated
        setCurrentUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  async function login(email, password) {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      const user = data?.user;
      if (user && typeof user === 'object') {
        setCurrentUser(user)
        return true
      }
      console.warn('login: received unexpected user object', user);
      setCurrentUser(null);
      return false
    } catch (err) {
      setCurrentUser(null)
      return false
    } finally {
      setLoading(false)
    }
  }

  async function register(email, password) {
    setLoading(true)
    try {
      await api.post('/auth/register', { email, password })
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      setCurrentUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}