<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ChevronDown } from '@lucide/vue'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { SidebarContextKey } from '@/components/sidebar-context'
import { navigationGroups, navigationItems } from '@/lib/navigation'
import type { NavigationGroup } from '@/lib/navigation'
import { useTranslations } from '@/i18n'

const route = useRoute()
const t = useTranslations()
const props = defineProps<{ expanded?: boolean }>()
const sidebar = inject(SidebarContextKey, null)
const isCollapsed = computed(() => (props.expanded ? false : sidebar?.state.value === 'collapsed'))

const groups = computed(() =>
  navigationGroups.map((group) => ({
    label: t(group as NavigationGroup) as string,
    items: navigationItems
      .filter((item) => item.group === group)
      .map((item) => ({
        title: t(item.translationKey) as string,
        href: item.href,
        icon: item.icon,
        badge: item.badge,
      })),
  })),
)

const openGroups = ref<Record<string, boolean>>({})

const isActive = (href: string) => route.path === href || route.path.startsWith(href + '/')
const isOpen = (label: string) => openGroups.value[label] ?? true

watch(
  [() => route.path, groups],
  () => {
    let changed = false
    const next = { ...openGroups.value }
    for (const group of groups.value) {
      if (!isOpen(group.label) && group.items.some((item) => isActive(item.href))) {
        next[group.label] = true
        changed = true
      }
    }
    if (changed) openGroups.value = next
  },
  { immediate: true },
)

function toggleGroup(label: string) {
  openGroups.value = { ...openGroups.value, [label]: !isOpen(label) }
}

const groupId = (label: string) => `sidebar-group-${label.toLowerCase().replace(/\s+/g, '-')}`
</script>

<template>
  <TooltipProvider>
    <nav aria-label="Main navigation" class="space-y-3">
      <div v-for="group in groups" :key="group.label" class="p-0">
        <button
          type="button"
          :aria-controls="groupId(group.label)"
          :aria-expanded="isOpen(group.label)"
          :aria-label="group.label"
          :class="[
            'group/section flex h-7 w-full items-center justify-between px-2 text-2xs leading-5 font-medium tracking-[0.12em] text-sidebar-foreground/45 hover:bg-transparent hover:text-sidebar-foreground/70',
            isCollapsed ? 'hidden' : '',
          ]"
          @click="toggleGroup(group.label)"
        >
          <span class="truncate">{{ group.label }}</span>
          <ChevronDown
            class="size-3.5 transition-transform duration-200"
            :class="isOpen(group.label) ? '' : '-rotate-90'"
          />
        </button>
        <div
          :id="groupId(group.label)"
          class="grid transition-[grid-template-rows,opacity] duration-200"
          :class="
            isCollapsed || isOpen(group.label)
              ? 'grid-rows-[1fr] opacity-100'
              : 'grid-rows-[0fr] opacity-0'
          "
        >
          <div class="min-h-0 overflow-hidden">
            <ul class="mt-1 flex w-full min-w-0 flex-col gap-1">
              <li v-for="item in group.items" :key="item.href" class="group/menu-item relative">
                <Tooltip :disabled="!isCollapsed">
                  <TooltipTrigger as-child>
                    <RouterLink
                      :to="item.href"
                      :data-active="isActive(item.href)"
                      class="peer/menu-button flex h-9 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-xs leading-5 font-normal text-sidebar-foreground/70 outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0"
                      :class="isCollapsed ? 'justify-center' : ''"
                    >
                      <component :is="item.icon" />
                      <span :class="['truncate', isCollapsed ? 'hidden' : '']">
                        {{ item.title }}
                      </span>
                    </RouterLink>
                  </TooltipTrigger>
                  <TooltipContent side="right">{{ item.title }}</TooltipContent>
                </Tooltip>
                <span
                  v-if="item.badge && !isCollapsed"
                  class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-sidebar-primary px-1.5 text-2xs text-sidebar-primary-foreground"
                >
                  {{ item.badge }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </TooltipProvider>
</template>
