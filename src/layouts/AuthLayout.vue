<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Moon, Sun } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { usePreferencesStore } from '@/stores/preferences'

const prefs = usePreferencesStore()
</script>

<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <aside class="hidden flex-col justify-between border-r bg-muted/30 p-10 lg:flex">
      <div class="text-sm font-semibold">Atera</div>
      <div class="max-w-sm">
        <h2 class="text-3xl font-medium tracking-tight">Admin screens, already wired</h2>
        <p class="mt-4 text-sm leading-6 text-muted-foreground">
          A Vue and TypeScript dashboard template. Routes, components and typed sample data
          ship together, so a page opens on real rows instead of an empty shell.
        </p>
      </div>
      <p class="text-xs text-muted-foreground">Atera Admin Platform</p>
    </aside>

    <div class="flex flex-col">
      <div class="flex justify-end p-4">
        <Button variant="ghost" size="icon" aria-label="Toggle theme" @click="prefs.toggleAppearance">
          <Sun v-if="prefs.resolvedAppearance === 'dark'" class="size-4" />
          <Moon v-else class="size-4" />
        </Button>
      </div>
      <div class="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div class="w-full max-w-sm">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>
