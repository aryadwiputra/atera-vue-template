<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import AppSidebarHeader from '@/components/AppSidebarHeader.vue'
import { provideSidebar } from '@/components/sidebar-context'
import { navigationGroups, navigationItems } from '@/lib/navigation'
import type { NavigationGroup } from '@/lib/navigation'
import { usePreferencesStore } from '@/stores/preferences'
import { useTranslations } from '@/i18n'

const route = useRoute()
const prefs = usePreferencesStore()
const t = useTranslations()

provideSidebar()

const horizontalGroups = computed(() =>
  navigationGroups.map((group) => ({
    group,
    label: t(group as NavigationGroup) as string,
    items: navigationItems.filter((item) => item.group === group),
  })),
)

function isActive(href: string) {
  return route.path === href || route.path.startsWith(href + '/')
}
</script>

<template>
  <div
    v-if="prefs.layout === 'top-nav'"
    class="flex min-h-svh w-full flex-col bg-background text-foreground"
  >
    <AppSidebarHeader variant="top-nav" />
    <nav class="overflow-x-auto border-b bg-sidebar text-sidebar-foreground">
      <div class="flex w-max items-center gap-4 px-4 py-2 md:px-6">
        <div
          v-for="section in horizontalGroups"
          :key="section.group"
          class="flex items-center gap-2"
        >
          <span class="shrink-0 text-2xs font-medium tracking-[0.12em] text-sidebar-foreground/45 uppercase">
            {{ section.label }}
          </span>
          <RouterLink
            v-for="item in section.items"
            :key="item.href"
            :to="item.href"
            class="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-xs leading-5 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            :class="
              isActive(item.href)
                ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                : ''
            "
          >
            <component :is="item.icon" class="size-4 shrink-0" />
            {{ t(item.translationKey) }}
          </RouterLink>
        </div>
      </div>
    </nav>
    <main class="flex min-w-0 flex-1 flex-col p-4 md:p-6">
      <RouterView v-slot="{ Component }">
        <Transition name="page-fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
  </div>

  <div v-else class="flex min-h-svh w-full flex-col bg-background text-foreground">
    <AppSidebarHeader variant="sidebar" />
    <div class="flex min-h-0 min-w-0 flex-1">
      <AppSidebar />
      <main class="flex min-w-0 flex-1 flex-col overflow-x-clip p-4 md:p-6">
        <RouterView v-slot="{ Component }">
          <Transition name="page-fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>
