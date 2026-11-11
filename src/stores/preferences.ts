import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { Locale } from '@/i18n'
import { i18n, locales } from '@/i18n'

export type Appearance = 'light' | 'dark' | 'system'
export type ColorPreset = 'zinc' | 'blue' | 'violet' | 'rose' | 'orange'
export type Density = 'compact' | 'comfortable' | 'spacious'
export type Container = 'fluid' | 'boxed'

const appearanceKey = 'atera_appearance'
const preferencesKey = 'atera_preferences'

interface PersistedPreferences {
  language: Locale
  color: ColorPreset
  density: Density
  container: Container
}

function readPreferences(): Partial<PersistedPreferences> {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(preferencesKey)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function readAppearance(): Appearance {
  if (typeof localStorage === 'undefined') return 'system'
  const stored = localStorage.getItem(appearanceKey)
  return stored === 'light' || stored === 'dark' || stored === 'system'
    ? stored
    : 'system'
}

export const colorPresets: ColorPreset[] = ['zinc', 'blue', 'violet', 'rose', 'orange']
export const densities: Density[] = ['compact', 'comfortable', 'spacious']

export const usePreferencesStore = defineStore('preferences', () => {
  const stored = readPreferences()

  const appearance = ref<Appearance>(readAppearance())
  const language = ref<Locale>(
    stored.language && locales.includes(stored.language) ? stored.language : 'en',
  )
  const color = ref<ColorPreset>(
    stored.color && colorPresets.includes(stored.color) ? stored.color : 'zinc',
  )
  const density = ref<Density>(
    stored.density && densities.includes(stored.density) ? stored.density : 'comfortable',
  )
  const container = ref<Container>(stored.container === 'boxed' ? 'boxed' : 'fluid')

  const resolvedAppearance = computed<'light' | 'dark'>(() => {
    if (appearance.value !== 'system') return appearance.value
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  function apply() {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.classList.toggle('dark', resolvedAppearance.value === 'dark')
    root.dataset.color = color.value
    root.dataset.density = density.value
    root.dataset.container = container.value
    root.lang = language.value
    i18n.global.locale.value = language.value
  }

  function setAppearance(next: Appearance) {
    appearance.value = next
    localStorage.setItem(appearanceKey, next)
    apply()
  }

  function toggleAppearance() {
    setAppearance(resolvedAppearance.value === 'dark' ? 'light' : 'dark')
  }

  function persist() {
    localStorage.setItem(
      preferencesKey,
      JSON.stringify({
        language: language.value,
        color: color.value,
        density: density.value,
        container: container.value,
      }),
    )
  }

  watch([language, color, density, container], () => {
    persist()
    apply()
  })

  if (typeof window !== 'undefined') {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => apply())
  }

  return {
    appearance,
    language,
    color,
    density,
    container,
    resolvedAppearance,
    setAppearance,
    toggleAppearance,
    apply,
    persist,
  }
})
