<script setup lang="ts">
import { AlertCircle, CheckCircle2, Info, X } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useToast } from '@/composables/use-toast'
import type { ToastVariant } from '@/composables/use-toast'
import { useTranslations } from '@/i18n'

const { toasts, dismiss } = useToast()
const t = useTranslations()

const icons = { success: CheckCircle2, error: AlertCircle, info: Info }

const variants: Record<ToastVariant, string> = {
  success: 'border-status-success/40 text-status-success',
  error: 'border-destructive/40 text-destructive',
  info: 'border-border text-foreground',
}
</script>

<template>
  <div
    class="pointer-events-none fixed right-4 top-4 z-50 flex w-80 flex-col gap-2"
    role="status"
    aria-live="polite"
  >
    <div
      v-for="item in toasts"
      :key="item.id"
      class="pointer-events-auto flex items-start gap-3 rounded-lg border bg-popover p-3 text-popover-foreground shadow-sm"
    >
      <component :is="icons[item.variant]" :class="cn('mt-0.5 size-4 shrink-0', variants[item.variant])" />
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium">{{ item.title }}</p>
        <p v-if="item.description" class="mt-0.5 text-xs text-muted-foreground">
          {{ item.description }}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        class="-mr-1 -mt-1 size-6 shrink-0"
        :aria-label="t('dismissNotification')"
        @click="dismiss(item.id)"
      >
        <X class="size-3.5" />
      </Button>
    </div>
  </div>
</template>
