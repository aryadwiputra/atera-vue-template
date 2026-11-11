<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { LogOut, Menu, Moon, Sun, X } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { navigationGroups, navigationItems } from '@/lib/navigation'
import type { NavigationGroup } from '@/lib/navigation'
import { useAuthStore } from '@/stores/auth'
import { usePreferencesStore } from '@/stores/preferences'
import { useTranslations } from '@/i18n'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const prefs = usePreferencesStore()
const t = useTranslations()

const mobileOpen = ref(false)

const groupedNav = computed(() =>
  navigationGroups.map((group) => ({
    group,
    label: t(group as NavigationGroup) as string,
    items: navigationItems.filter((item) => item.group === group),
  })),
)

function isActive(href: string) {
  return route.path === href || route.path.startsWith(href + '/')
}

function signOut() {
  auth.signOut()
  router.push('/login')
}
</script>

<template>
  <div class="flex min-h-svh bg-background text-foreground">
    <aside class="hidden w-64 shrink-0 border-r lg:block">
      <div class="flex h-full flex-col">
        <div class="border-b px-4 py-4">
          <RouterLink to="/dashboard" class="text-sm font-semibold">Atera</RouterLink>
          <p class="text-xs text-muted-foreground">Dashboard</p>
        </div>
        <nav class="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          <div v-for="section in groupedNav" :key="section.group">
            <p class="px-2 pb-1 text-2xs font-medium uppercase tracking-wide text-muted-foreground">
              {{ section.label }}
            </p>
            <ul class="flex flex-col gap-0.5">
              <li v-for="item in section.items" :key="item.href">
                <RouterLink
                  :to="item.href"
                  class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
                  :class="
                    isActive(item.href)
                      ? 'bg-accent font-medium text-accent-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  "
                >
                  <component :is="item.icon" class="size-4 shrink-0" />
                  <span class="truncate">{{ t(item.translationKey) }}</span>
                  <span
                    v-if="item.badge"
                    class="ml-auto rounded-full bg-primary px-1.5 text-2xs text-primary-foreground"
                  >
                    {{ item.badge }}
                  </span>
                </RouterLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <header class="flex items-center justify-between gap-3 border-b px-4 py-2.5">
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="icon" class="lg:hidden" @click="mobileOpen = true">
            <Menu class="size-4" />
          </Button>
          <span class="text-sm font-medium">{{ t('dashboard') }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Button variant="ghost" size="icon" :aria-label="t('toggleTheme')" @click="prefs.toggleAppearance">
            <Sun v-if="prefs.resolvedAppearance === 'dark'" class="size-4" />
            <Moon v-else class="size-4" />
          </Button>
          <div class="hidden text-right text-xs sm:block">
            <p class="font-medium">{{ auth.session?.name }}</p>
            <p class="text-muted-foreground">{{ auth.session?.email }}</p>
          </div>
          <Button variant="ghost" size="icon" :aria-label="t('signOut')" @click="signOut">
            <LogOut class="size-4" />
          </Button>
        </div>
      </header>

      <main class="flex-1 p-4 md:p-6">
        <RouterView v-slot="{ Component }">
          <Transition name="page-fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </RouterView>
      </main>
    </div>

    <div
      v-if="mobileOpen"
      class="fixed inset-0 z-50 lg:hidden"
      @click.self="mobileOpen = false"
    >
      <div class="absolute inset-0 bg-black/40" />
      <aside class="absolute inset-y-0 left-0 w-64 overflow-y-auto border-r bg-background p-3">
        <div class="flex items-center justify-between px-2 py-2">
          <span class="text-sm font-semibold">Atera</span>
          <Button variant="ghost" size="icon" @click="mobileOpen = false">
            <X class="size-4" />
          </Button>
        </div>
        <div v-for="section in groupedNav" :key="section.group" class="mt-4">
          <p class="px-2 pb-1 text-2xs font-medium uppercase tracking-wide text-muted-foreground">
            {{ section.label }}
          </p>
          <RouterLink
            v-for="item in section.items"
            :key="item.href"
            :to="item.href"
            class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
            :class="
              isActive(item.href)
                ? 'bg-accent font-medium text-accent-foreground'
                : 'text-muted-foreground hover:bg-muted'
            "
            @click="mobileOpen = false"
          >
            <component :is="item.icon" class="size-4 shrink-0" />
            {{ t(item.translationKey) }}
          </RouterLink>
        </div>
      </aside>
    </div>
  </div>
</template>
