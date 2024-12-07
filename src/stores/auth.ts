import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const isAuthenticated = ref(false)
  const user = ref<User | null>(null)
  const isInitialized = ref(false)

  // Initialize the auth state
  const initAuth = async () => {
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        isAuthenticated.value = true
        user.value = session.user
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
    } finally {
      isInitialized.value = true
    }
  }

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error

    if (data.session) {
      isAuthenticated.value = true
      user.value = data.session.user
      await router.push('/dashboard')
    }
  }

  const signup = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    
    if (error) throw error
    
    return data
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    isAuthenticated.value = false
    user.value = null
    await router.push('/login')
  }

  // Listen to auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      isAuthenticated.value = true
      user.value = session.user
    } else {
      isAuthenticated.value = false
      user.value = null
    }
  })

  return {
    isAuthenticated,
    isInitialized,
    user,
    login,
    signup,
    logout,
    initAuth
  }
})