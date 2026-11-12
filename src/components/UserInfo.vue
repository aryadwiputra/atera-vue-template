<script setup lang="ts">
import { computed } from 'vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const props = withDefaults(
  defineProps<{
    name: string
    email: string
    avatar?: string
    showEmail?: boolean
    compact?: boolean
  }>(),
  { showEmail: false, compact: false },
)

const initials = computed(() => {
  const names = props.name.trim().split(/\s+/u).filter(Boolean)
  if (names.length === 0) return ''
  if (names.length === 1) return (Array.from(names[0])[0] ?? '').toUpperCase()
  const first = Array.from(names[0])[0] ?? ''
  const last = Array.from(names[names.length - 1])[0] ?? ''
  return `${first}${last}`.toUpperCase()
})
</script>

<template>
  <Avatar class="h-8 w-8 overflow-hidden rounded-full">
    <AvatarImage v-if="avatar" :src="avatar" :alt="name" />
    <AvatarFallback class="rounded-lg bg-muted text-muted-foreground">
      {{ initials }}
    </AvatarFallback>
  </Avatar>
  <div v-if="!compact" class="grid flex-1 text-left text-xs leading-5">
    <span class="truncate font-medium">{{ name }}</span>
    <span v-if="showEmail" class="truncate text-xs text-muted-foreground">{{ email }}</span>
  </div>
</template>
