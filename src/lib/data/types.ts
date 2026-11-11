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

export interface Customer {
  id: string
  name: string
  email: string
  company: string
  orders: number
  spent: number
  joined: string
}

export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue'

export interface Invoice {
  id: string
  customer: string
  date: string
  dueDate: string
  amount: number
  status: InvoiceStatus
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

export type AssetStatus = 'In Use' | 'Available' | 'Maintenance' | 'Retired'
export type Asset = {
  id: string
  tag: string
  name: string
  category: string
  assignedTo: string
  location: string
  purchaseDate: string
  warrantyEnd: string
  value: number
  status: AssetStatus
}

export type POStatus = 'Draft' | 'Pending' | 'Approved' | 'Received' | 'Cancelled'
export type PurchaseOrder = {
  id: string
  number: string
  supplier: string
  items: { name: string; qty: number; price: number }[]
  date: string
  expectedDelivery: string
  status: POStatus
}

export type InventoryItem = {
  id: string
  sku: string
  name: string
  warehouse: string
  onHand: number
  reserved: number
  reorderPoint: number
}

export type SupplierStatus = 'Active' | 'On Hold'
export type Supplier = {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  country: string
  rating: number
  onTimeRate: number
  status: SupplierStatus
}

export type EmployeeStatus = 'Active' | 'On Leave' | 'Remote' | 'Offboarded'
export type Employee = {
  id: string
  name: string
  position: string
  department: string
  email: string
  startDate: string
  status: EmployeeStatus
}

export type OpenPosition = {
  id: string
  title: string
  department: string
  applicants: number
  postedAt: string
}

export type FileItem = {
  id: string
  name: string
  type: 'folder' | 'document' | 'spreadsheet' | 'image'
  size?: string
  updated: string
  owner: string
}
