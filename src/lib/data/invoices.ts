import type { Invoice } from './types'

let invoices: Invoice[] = [
  {
    id: 'INV-1042',
    customer: 'Northstar Labs',
    date: '2026-11-01',
    dueDate: '2026-11-15',
    amount: 2490,
    status: 'Paid',
  },
  {
    id: 'INV-1041',
    customer: 'Vertex Studio',
    date: '2026-10-28',
    dueDate: '2026-11-11',
    amount: 1290,
    status: 'Pending',
  },
  {
    id: 'INV-1039',
    customer: 'Atlas Group',
    date: '2026-10-18',
    dueDate: '2026-11-01',
    amount: 4390,
    status: 'Overdue',
  },
]

export const listInvoices = () => [...invoices]

export const getInvoice = (id: string) => invoices.find((invoice) => invoice.id === id)

export const createInvoice = (invoice: Omit<Invoice, 'id'>) => {
  const created: Invoice = { ...invoice, id: `INV-${1043 + invoices.length}` }
  invoices = [created, ...invoices]
  return created
}

export const updateInvoice = (id: string, updates: Partial<Invoice>) => {
  const index = invoices.findIndex((invoice) => invoice.id === id)
  if (index === -1) return undefined
  invoices[index] = { ...invoices[index], ...updates }
  return invoices[index]
}

export const removeInvoice = (id: string) => {
  const before = invoices.length
  invoices = invoices.filter((invoice) => invoice.id !== id)
  return invoices.length < before
}
