import { ref } from 'vue'

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  title: string
  description?: string
  variant: ToastVariant
}

const toasts = ref<ToastItem[]>([])
let nextId = 1

export function useToast() {
  function dismiss(id: number) {
    toasts.value = toasts.value.filter((item) => item.id !== id)
  }

  function toast(input: { title: string; description?: string; variant?: ToastVariant }) {
    const id = nextId++
    toasts.value.push({
      id,
      title: input.title,
      description: input.description,
      variant: input.variant ?? 'info',
    })
    window.setTimeout(() => dismiss(id), 4000)
  }

  return { toasts, toast, dismiss }
}
