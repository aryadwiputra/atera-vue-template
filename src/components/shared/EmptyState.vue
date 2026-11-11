<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon?: Component
  title: string
  description?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
    <div class="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <component :is="icon" v-if="icon" class="size-6" />
    </div>
    <p class="text-sm font-medium">{{ title }}</p>
    <p v-if="description" class="max-w-sm text-xs text-muted-foreground">{{ description }}</p>
    <slot />
  </div>
</template>
