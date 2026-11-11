import type { Account, AuthResult, AuthSession } from '@/lib/data/types'

const sessionKey = 'atera_session'
const accountsKey = 'atera_accounts'

const demoAccount: Account = {
  email: 'demo@example.com',
  password: 'AteraDemo2026!',
  name: 'Demo User',
}

function readAccounts(): Account[] {
  if (typeof localStorage === 'undefined') return [demoAccount]
  try {
    const raw = localStorage.getItem(accountsKey)
    const stored: Account[] = raw ? JSON.parse(raw) : []
    return [demoAccount, ...stored]
  } catch {
    return [demoAccount]
  }
}

export function getSession(): AuthSession | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(sessionKey)
    return raw ? (JSON.parse(raw) as AuthSession) : null
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null
}

export function signIn(email: string, password: string): AuthResult {
  const account = readAccounts().find(
    (candidate) =>
      candidate.email.toLowerCase() === email.trim().toLowerCase() &&
      candidate.password === password,
  )

  if (!account) {
    return { ok: false, message: 'invalidCredentials' }
  }

  const session: AuthSession = {
    email: account.email,
    name: account.name,
    authenticatedAt: new Date().toISOString(),
  }
  localStorage.setItem(sessionKey, JSON.stringify(session))
  return { ok: true, session }
}

export function signUp(input: Account): AuthResult {
  if (!input.email.includes('@')) {
    return { ok: false, message: 'invalidEmail' }
  }

  const exists = readAccounts().some(
    (candidate) => candidate.email.toLowerCase() === input.email.trim().toLowerCase(),
  )
  if (exists) {
    return { ok: false, message: 'accountExists' }
  }

  const stored = readAccounts().filter(
    (candidate) => candidate.email !== demoAccount.email,
  )
  localStorage.setItem(accountsKey, JSON.stringify([...stored, input]))
  return signIn(input.email, input.password)
}

export function signOut(): void {
  localStorage.removeItem(sessionKey)
}

export function getDemoCredentials(): { email: string; password: string } {
  return { email: demoAccount.email, password: demoAccount.password }
}
