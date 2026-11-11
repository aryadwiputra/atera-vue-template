<script setup lang="ts">
import { cn } from '@/lib/utils'

defineProps<{
  title?: string
  description?: string
  className?: string
}>()
</script>

<template>
  <div :class="cn('flex h-full flex-col gap-3 rounded-[--radius-lg] border bg-card p-5 shadow-none', className)">
    <div v-if="title || $slots.actions" class="flex items-start justify-between gap-2">
      <div class="flex flex-col gap-1.5">
        <h3 class="text-sm font-medium leading-none tracking-tight">{{ title }}</h3>
        <p v-if="description" class="text-xs text-muted-foreground">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
    <slot />
  </div>
</template>
