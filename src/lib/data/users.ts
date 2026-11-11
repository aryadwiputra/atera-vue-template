import type { User } from './types'

let users: User[] = [
  {
    id: 'USR-001',
    name: 'Avery Admin',
    email: 'avery@example.com',
    role: 'Admin',
    status: 'Active',
    department: 'Engineering',
    lastActive: '2 hours ago',
  },
  {
    id: 'USR-002',
    name: 'Blake Editor',
    email: 'blake@example.com',
    role: 'Editor',
    status: 'Active',
    department: 'Marketing',
    lastActive: '5 hours ago',
  },
  {
    id: 'USR-003',
    name: 'Casey Moderator',
    email: 'casey@example.com',
    role: 'Moderator',
    status: 'Inactive',
    department: 'Support',
    lastActive: '2 days ago',
  },
  {
    id: 'USR-004',
    name: 'Drew Viewer',
    email: 'drew@example.com',
    role: 'Viewer',
    status: 'Active',
    department: 'Finance',
    lastActive: '1 hour ago',
  },
  {
    id: 'USR-005',
    name: 'Emery Admin',
    email: 'emery@example.com',
    role: 'Admin',
    status: 'Suspended',
    department: 'Operations',
    lastActive: '3 weeks ago',
  },
  {
    id: 'USR-006',
    name: 'Finley Editor',
    email: 'finley@example.com',
    role: 'Editor',
    status: 'Active',
    department: 'Design',
    lastActive: '20 minutes ago',
  },
  {
    id: 'USR-007',
    name: 'Harper Viewer',
    email: 'harper@example.com',
    role: 'Viewer',
    status: 'Active',
    department: 'Sales',
    lastActive: '4 hours ago',
  },
  {
    id: 'USR-008',
    name: 'Jordan Moderator',
    email: 'jordan@example.com',
    role: 'Moderator',
    status: 'Inactive',
    department: 'Support',
    lastActive: '6 days ago',
  },
  {
    id: 'USR-009',
    name: 'Morgan Editor',
    email: 'morgan@example.com',
    role: 'Editor',
    status: 'Active',
    department: 'Marketing',
    lastActive: '30 minutes ago',
  },
  {
    id: 'USR-010',
    name: 'Nina Patel',
    email: 'nina@example.com',
    role: 'Admin',
    status: 'Active',
    department: 'Engineering',
    lastActive: '15 minutes ago',
  },
]

const pad = (value: number) => String(value).padStart(3, '0')

export const listUsers = () => [...users]

export const createUser = (user: Omit<User, 'id' | 'lastActive'>) => {
  const created: User = { ...user, id: `USR-${pad(users.length + 1)}`, lastActive: 'Never' }
  users = [created, ...users]
  return created
}

export const updateUser = (id: string, updates: Partial<User>) => {
  const index = users.findIndex((user) => user.id === id)
  if (index === -1) return undefined
  users[index] = { ...users[index], ...updates }
  return users[index]
}

export const removeUser = (id: string) => {
  const before = users.length
  users = users.filter((user) => user.id !== id)
  return users.length < before
}
