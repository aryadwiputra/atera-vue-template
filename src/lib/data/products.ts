import type { Product } from './types'

let products: Product[] = [
  {
    id: 'PRD-001',
    name: 'Pro subscription',
    category: 'Subscriptions',
    price: 249,
    stock: 999,
    status: 'Active',
    sales: 842,
  },
  {
    id: 'PRD-002',
    name: 'Team plan',
    category: 'Subscriptions',
    price: 129,
    stock: 999,
    status: 'Active',
    sales: 621,
  },
  {
    id: 'PRD-003',
    name: 'Starter plan',
    category: 'Subscriptions',
    price: 49,
    stock: 999,
    status: 'Active',
    sales: 418,
  },
  {
    id: 'PRD-004',
    name: 'Onboarding package',
    category: 'Services',
    price: 799,
    stock: 24,
    status: 'Draft',
    sales: 65,
  },
]

const pad = (value: number) => String(value).padStart(3, '0')

export const listProducts = () => [...products]

export const getProduct = (id: string) => products.find((product) => product.id === id)

export const createProduct = (product: Omit<Product, 'id' | 'sales'>) => {
  const created: Product = { ...product, id: `PRD-${pad(products.length + 1)}`, sales: 0 }
  products = [created, ...products]
  return created
}

export const updateProduct = (id: string, updates: Partial<Product>) => {
  const index = products.findIndex((product) => product.id === id)
  if (index === -1) return undefined
  products[index] = { ...products[index], ...updates }
  return products[index]
}

export const removeProduct = (id: string) => {
  const before = products.length
  products = products.filter((product) => product.id !== id)
  return products.length < before
}
