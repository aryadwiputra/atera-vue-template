<script setup lang="ts">
import { RouterLink } from 'vue-router'

export interface BreadcrumbItem {
  title: string
  href: string
}

defineProps<{ items: BreadcrumbItem[] }>()
</script>

<template>
  <nav aria-label="breadcrumbs" class="text-muted-foreground">
    <ol class="flex items-center gap-1.5 text-sm">
      <template v-for="(item, index) in items" :key="index">
        <li v-if="index > 0" class="text-muted-foreground/60">/</li>
        <li v-if="index === items.length - 1" class="truncate font-medium text-foreground">
          {{ item.title }}
        </li>
        <li v-else class="truncate">
          <RouterLink :to="item.href" class="transition-colors hover:text-foreground">
            {{ item.title }}
          </RouterLink>
        </li>
      </template>
    </ol>
  </nav>
</template>
