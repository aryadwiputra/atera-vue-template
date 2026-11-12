<script setup lang="ts">
import AppLogoIcon from '@/components/AppLogoIcon.vue'

withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
</script>

<template>
  <div class="flex items-center">
    <div class="flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
      <AppLogoIcon class="size-5 fill-current text-sidebar-primary-foreground" />
    </div>
    <div
      class="ml-3 text-left text-sm leading-none"
      :class="compact ? 'hidden' : ''"
    >
      <span class="truncate font-semibold">Atera</span>
      <span class="mt-1 block truncate text-2xs text-muted-foreground">
        Dashboard
      </span>
    </div>
  </div>
</template>
