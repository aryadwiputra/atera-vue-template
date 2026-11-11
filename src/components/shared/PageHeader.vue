<script setup lang="ts">
export interface BreadcrumbItem {
  title: string
  href: string
}

defineProps<{
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
}>()
</script>

<template>
  <header class="flex flex-col gap-4">
    <nav v-if="breadcrumbs && breadcrumbs.length" class="flex items-center gap-2 text-xs text-muted-foreground">
      <template v-for="(crumb, index) in breadcrumbs" :key="crumb.href">
        <RouterLink
          v-if="index < breadcrumbs.length - 1"
          :to="crumb.href"
          class="transition-colors hover:text-foreground"
        >
          {{ crumb.title }}
        </RouterLink>
        <span v-else class="text-foreground">{{ crumb.title }}</span>
        <span v-if="index < breadcrumbs.length - 1" aria-hidden="true">/</span>
      </template>
    </nav>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">{{ title }}</h1>
        <p v-if="description" class="mt-1 max-w-2xl text-sm text-muted-foreground">
          {{ description }}
        </p>
      </div>
      <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>
