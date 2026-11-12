<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  Bell,
  Languages,
  Menu,
  Moon,
  PanelLeft,
  Search,
  SlidersHorizontal,
  Sun,
} from '@lucide/vue'
import AppLogo from '@/components/AppLogo.vue'
import AppLogoIcon from '@/components/AppLogoIcon.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import type { BreadcrumbItem } from '@/components/Breadcrumbs.vue'
import CustomizeDialog from '@/components/CustomizeDialog.vue'
import NavMain from '@/components/NavMain.vue'
import NavUser from '@/components/NavUser.vue'
import { SidebarContextKey } from '@/components/sidebar-context'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { navigationItems } from '@/lib/navigation'
import { usePreferencesStore } from '@/stores/preferences'
import type { Locale } from '@/i18n'
import { useTranslations } from '@/i18n'

const props = withDefaults(defineProps<{ variant?: 'sidebar' | 'top-nav' }>(), {
  variant: 'sidebar',
})

const route = useRoute()
const router = useRouter()
const prefs = usePreferencesStore()
const t = useTranslations()

const sidebar = inject(SidebarContextKey, null)
const isCollapsed = computed(() => sidebar?.state.value === 'collapsed')

const mobileOpen = ref(false)
const searchOpen = ref(false)
const searchQuery = ref('')
const customizeOpen = ref(false)

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))

function onKeyDown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    searchOpen.value = true
  }
}

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [{ title: t('dashboard') as string, href: '/dashboard' }]
  let acc = ''
  for (const segment of route.path.split('/').filter(Boolean)) {
    acc += `/${segment}`
    const navItem = navigationItems.find((item) => item.href === acc)
    if (navItem && navItem.href !== '/dashboard') {
      items.push({ title: t(navItem.translationKey) as string, href: navItem.href })
    }
  }
  return items
})

const currentPageTitle = computed(
  () => breadcrumbItems.value[breadcrumbItems.value.length - 1]?.title ?? '',
)

const searchResults = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return navigationItems
    .map((item) => ({ ...item, translatedTitle: t(item.translationKey) as string }))
    .filter((item) => item.translatedTitle.toLowerCase().includes(query))
})

function navigateTo(href: string) {
  searchOpen.value = false
  router.push(href)
}

function onSearchKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && searchResults.value.length > 0) {
    navigateTo(searchResults.value[0].href)
  }
}

function toggleAppearanceMode() {
  prefs.setAppearance(prefs.resolvedAppearance === 'dark' ? 'light' : 'dark')
}

function setLanguage(lang: Locale) {
  prefs.language = lang
}

const languageLabel: Record<Locale, string> = {
  en: 'english',
  de: 'deutsch',
  fr: 'francais',
}
</script>

<template>
  <div class="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
    <header class="flex h-16 shrink-0 items-center">
      <div
        v-if="props.variant === 'sidebar'"
        :class="[
          'flex h-full shrink-0 items-center border-r border-sidebar-border bg-sidebar transition-[width,padding] duration-200 ease-linear',
          isCollapsed ? 'lg:w-12 lg:justify-center lg:px-0' : 'lg:w-64 lg:px-6',
        ]"
      >
        <Button
          variant="ghost"
          size="icon"
          class="ml-2 size-8 lg:hidden"
          aria-label="Open menu"
          @click="mobileOpen = true"
        >
          <Menu class="size-4" />
        </Button>
        <RouterLink
          v-if="!isCollapsed"
          to="/dashboard"
          class="flex shrink-0 items-center"
        >
          <AppLogo />
        </RouterLink>
        <Button
          variant="ghost"
          size="icon"
          class="ml-3 hidden size-8 lg:inline-flex"
          :class="isCollapsed ? 'lg:ml-0' : ''"
          aria-label="Toggle sidebar"
          @click="sidebar?.toggle()"
        >
          <PanelLeft class="size-4" />
        </Button>
        <span class="ml-3 truncate text-sm font-medium lg:hidden">{{ currentPageTitle }}</span>
      </div>

      <div v-else class="flex h-full shrink-0 items-center px-4">
        <RouterLink to="/dashboard" class="flex shrink-0 items-center">
          <AppLogo />
        </RouterLink>
      </div>

      <div class="flex h-full min-w-0 flex-1 items-center justify-between gap-4 px-4 md:px-6">
        <Button
          variant="outline"
          class="hidden h-9 w-full max-w-72 justify-start gap-2 px-3 text-sm font-normal text-muted-foreground md:inline-flex"
          :aria-label="t('search')"
          @click="searchOpen = true"
        >
          <Search class="size-4" />
          <span>{{ t('search') }}</span>
          <kbd class="ml-auto rounded border bg-muted px-1.5 py-0.5 text-2xs">⌘ K</kbd>
        </Button>

        <div class="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            class="size-8 md:hidden"
            :aria-label="t('search')"
            @click="searchOpen = true"
          >
            <Search class="size-4" />
          </Button>

          <Button size="sm" class="hidden h-8 rounded-md px-3 text-xs md:inline-flex">
            {{ t('newOrder') }}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            class="size-8"
            :aria-label="t('toggleTheme')"
            @click="toggleAppearanceMode"
          >
            <Sun v-if="prefs.resolvedAppearance === 'dark'" class="size-4" />
            <Moon v-else class="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            class="hidden size-8 md:inline-flex"
            :aria-label="t('customize')"
            @click="customizeOpen = true"
          >
            <SlidersHorizontal class="size-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon" class="size-8" :aria-label="t('language')">
                <Languages class="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                v-for="lang in (['en', 'de', 'fr'] as Locale[])"
                :key="lang"
                @click="setLanguage(lang)"
              >
                {{ t(languageLabel[lang]) }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                class="relative size-8"
                :aria-label="t('notifications')"
              >
                <Bell class="size-4" />
                <span class="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-72">
              <DropdownMenuLabel>{{ t('notifications') }}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span class="flex flex-col gap-1">
                  <span class="font-medium">{{ t('newOrderReceived') }}</span>
                  <span class="text-xs text-muted-foreground">{{ t('reviewOrder') }}</span>
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span class="flex flex-col gap-1">
                  <span class="font-medium">{{ t('weeklyReport') }}</span>
                  <span class="text-xs text-muted-foreground">{{ t('businessSummary') }}</span>
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>

    <div v-if="breadcrumbItems.length > 1" class="flex w-full border-t">
      <div class="flex h-12 w-full items-center px-4 text-muted-foreground md:px-6">
        <Breadcrumbs :items="breadcrumbItems" />
      </div>
    </div>

    <Sheet v-model:open="mobileOpen">
      <SheetContent side="left" class="w-64 bg-sidebar p-0">
        <SheetHeader class="border-b">
          <SheetTitle class="text-left">
            <AppLogoIcon class="size-6" />
          </SheetTitle>
          <SheetDescription class="sr-only">Navigation</SheetDescription>
        </SheetHeader>
        <div class="flex h-[calc(100%-4rem)] flex-col">
          <div class="flex-1 overflow-y-auto px-3 py-4">
            <NavMain :expanded="true" />
          </div>
          <div class="border-t border-sidebar-border px-3 py-3">
            <NavUser :expanded="true" />
          </div>
        </div>
      </SheetContent>
    </Sheet>

    <Dialog
      :open="searchOpen"
      @update:open="
        (value) => {
          searchOpen = value
          if (!value) searchQuery = ''
        }
      "
    >
      <DialogContent class="sm:max-w-md">
        <DialogHeader class="sr-only">
          <DialogTitle>{{ t('search') }}</DialogTitle>
          <DialogDescription>{{ t('searchPages') }}</DialogDescription>
        </DialogHeader>
        <Input
          v-model="searchQuery"
          type="text"
          :placeholder="t('searchPages')"
          autofocus
          @keydown="onSearchKeydown"
        />
        <div class="max-h-72 overflow-y-auto">
          <p
            v-if="searchResults.length === 0"
            class="px-2 py-6 text-center text-sm text-muted-foreground"
          >
            {{ t('noResults') }}
          </p>
          <button
            v-for="item in searchResults"
            :key="item.href"
            type="button"
            class="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
            @click="navigateTo(item.href)"
          >
            <component :is="item.icon" class="size-4 shrink-0" />
            {{ item.translatedTitle }}
          </button>
        </div>
      </DialogContent>
    </Dialog>

    <CustomizeDialog v-model:open="customizeOpen" />
  </div>
</template>
