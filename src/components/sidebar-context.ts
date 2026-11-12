import type { InjectionKey, Ref } from 'vue'
import { provide, readonly, ref, watch } from 'vue'

export type SidebarState = 'expanded' | 'collapsed'

export interface SidebarContext {
  state: Ref<SidebarState>
  toggle: () => void
}

export const SidebarContextKey: InjectionKey<SidebarContext> = Symbol('sidebar')

export const SIDEBAR_WIDTH = '16rem'
export const SIDEBAR_WIDTH_ICON = '3rem'
export const SIDEBAR_COLLAPSED_KEY = 'atera_sidebar_collapsed'

function readCollapsed(): boolean {
  if (typeof localStorage === 'undefined') return false
  return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
}

export function provideSidebar(): SidebarContext {
  const state = ref<SidebarState>(readCollapsed() ? 'collapsed' : 'expanded')

  function toggle() {
    state.value = state.value === 'expanded' ? 'collapsed' : 'expanded'
  }

  watch(state, (value) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(value === 'collapsed'))
    }
  })

  const context: SidebarContext = { state, toggle }
  provide(SidebarContextKey, context)
  return { state: readonly(state) as Ref<SidebarState>, toggle }
}

