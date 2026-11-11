export interface Account {
  email: string
  password: string
  name: string
}

export interface AuthSession {
  email: string
  name: string
  authenticatedAt: string
}

export type AuthResult =
  | { ok: true; session: AuthSession }
  | { ok: false; message: 'invalidCredentials' | 'invalidEmail' | 'accountExists' }

export type OrderStatus = 'Paid' | 'Pending' | 'Refunded'

export interface Order {
  id: string
  customer: string
  customerEmail: string
  product: string
  status: OrderStatus
  amount: number
  date: string
}

export type ProductStatus = 'Active' | 'Draft'

export interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: ProductStatus
  sales: number
}

export type UserStatus = 'Active' | 'Inactive' | 'Suspended'
export type UserRole = 'Admin' | 'Editor' | 'Moderator' | 'Viewer'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  department: string
  lastActive: string
}
