import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Account, AuthSession } from '@/lib/data/types'
import {
  getDemoCredentials,
  getSession,
  signIn as authSignIn,
  signOut as authSignOut,
  signUp as authSignUp,
} from '@/lib/auth'

export const useAuthStore = defineStore('auth', () => {
  const session = ref<AuthSession | null>(getSession())
  const isAuthenticated = computed(() => session.value !== null)

  function signIn(email: string, password: string) {
    const result = authSignIn(email, password)
    if (result.ok) session.value = result.session
    return result
  }

  function signUp(input: Account) {
    const result = authSignUp(input)
    if (result.ok) session.value = result.session
    return result
  }

  function signOut() {
    authSignOut()
    session.value = null
  }

  function demo() {
    return getDemoCredentials()
  }

  return { session, isAuthenticated, signIn, signUp, signOut, demo }
})
