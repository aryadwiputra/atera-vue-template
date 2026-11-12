<script setup lang="ts">
import { computed, inject } from 'vue'
import NavMain from '@/components/NavMain.vue'
import NavUser from '@/components/NavUser.vue'
import {
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
  SidebarContextKey,
} from '@/components/sidebar-context'

const sidebar = inject(SidebarContextKey, null)
const isCollapsed = computed(() => sidebar?.state.value === 'collapsed')

const width = computed(() => (isCollapsed.value ? SIDEBAR_WIDTH_ICON : SIDEBAR_WIDTH))
</script>

<template>
  <aside
    class="hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200 ease-linear lg:flex"
    :style="{ width }"
  >
    <div class="flex-1 overflow-y-auto px-3 py-4">
      <NavMain />
    </div>
    <div class="border-t border-sidebar-border px-3 py-3">
      <NavUser />
    </div>
  </aside>
</template>
