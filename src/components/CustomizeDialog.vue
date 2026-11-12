<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select } from '@/components/ui/select'
import SelectContent from '@/components/ui/select/SelectContent.vue'
import SelectItem from '@/components/ui/select/SelectItem.vue'
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue'
import SelectValue from '@/components/ui/select/SelectValue.vue'
import {
  colorPresets,
  usePreferencesStore,
} from '@/stores/preferences'
import type {
  Appearance,
  ColorPreset,
  Container,
  Density,
  Layout,
} from '@/stores/preferences'
import type { Locale } from '@/i18n'
import { useTranslations } from '@/i18n'

const open = defineModel<boolean>('open', { default: false })

const prefs = usePreferencesStore()
const t = useTranslations()

function setAppearance(value: unknown) {
  prefs.setAppearance(value as Appearance)
}

function setColor(value: ColorPreset) {
  prefs.color = value
}

function setDensity(value: unknown) {
  prefs.density = value as Density
}

function setLayout(value: unknown) {
  prefs.layout = value as Layout
}

function setContainer(value: unknown) {
  prefs.container = value as Container
}

function setLanguage(value: unknown) {
  prefs.language = value as Locale
}

function resetDefaults() {
  prefs.setAppearance('system')
  prefs.language = 'en'
  prefs.color = 'zinc'
  prefs.density = 'comfortable'
  prefs.container = 'fluid'
  prefs.layout = 'sidebar'
}

const colorLabel: Record<ColorPreset, string> = {
  zinc: 'Zinc',
  blue: 'Blue',
  violet: 'Violet',
  rose: 'Rose',
  orange: 'Orange',
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>{{ t('customize') }}</DialogTitle>
        <DialogDescription>
          {{ t('color') }}, {{ t('density') }}, {{ t('layout') }}, {{ t('container') }}
          {{ t('and') }} {{ t('language') }}
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-5">
        <div class="space-y-2">
          <p class="text-sm font-medium">{{ t('theme') }}</p>
          <div class="grid grid-cols-3 gap-2">
            <Button
              v-for="mode in (['light', 'dark', 'system'] as const)"
              :key="mode"
              :variant="prefs.appearance === mode ? 'default' : 'outline'"
              class="capitalize"
              @click="setAppearance(mode)"
            >
              {{ t(mode) }}
            </Button>
          </div>
        </div>

        <div class="space-y-2">
          <p class="text-sm font-medium">{{ t('color') }}</p>
          <div class="grid grid-cols-3 gap-2">
            <Button
              v-for="color in colorPresets"
              :key="color"
              :variant="prefs.color === color ? 'default' : 'outline'"
              class="justify-start gap-2"
              @click="setColor(color)"
            >
              <span class="size-3 rounded-full bg-swatch" />
              {{ colorLabel[color] }}
            </Button>
          </div>
        </div>

        <div class="space-y-2">
          <p class="text-sm font-medium">{{ t('density') }}</p>
          <Select :model-value="prefs.density" @update:model-value="setDensity">
            <SelectTrigger class="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">{{ t('compact') }}</SelectItem>
              <SelectItem value="comfortable">{{ t('comfortable') }}</SelectItem>
              <SelectItem value="spacious">{{ t('spacious') }}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <p class="text-sm font-medium">{{ t('layout') }}</p>
          <Select :model-value="prefs.layout" @update:model-value="setLayout">
            <SelectTrigger class="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sidebar">{{ t('sidebar') }}</SelectItem>
              <SelectItem value="top-nav">{{ t('topNav') }}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <p class="text-sm font-medium">{{ t('container') }}</p>
          <Select :model-value="prefs.container" @update:model-value="setContainer">
            <SelectTrigger class="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fluid">{{ t('fluid') }}</SelectItem>
              <SelectItem value="boxed">{{ t('boxed') }}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <p class="text-sm font-medium">{{ t('language') }}</p>
          <Select :model-value="prefs.language" @update:model-value="setLanguage">
            <SelectTrigger class="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{{ t('english') }}</SelectItem>
              <SelectItem value="de">{{ t('deutsch') }}</SelectItem>
              <SelectItem value="fr">{{ t('francais') }}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="resetDefaults">{{ t('resetDefaults') }}</Button>
        <Button @click="open = false">{{ t('close') }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
