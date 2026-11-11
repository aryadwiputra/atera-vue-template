<script setup lang="ts">
import { Check, RotateCcw } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import { Select } from '@/components/ui/select'
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue'
import SelectValue from '@/components/ui/select/SelectValue.vue'
import SelectContent from '@/components/ui/select/SelectContent.vue'
import SelectItem from '@/components/ui/select/SelectItem.vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import { colorPresets, usePreferencesStore } from '@/stores/preferences'
import type { Appearance, ColorPreset, Container, Density } from '@/stores/preferences'
import type { Locale } from '@/i18n'
import { useTranslations } from '@/i18n'

const t = useTranslations()
const prefs = usePreferencesStore()

function setAppearance(value: unknown) {
  prefs.setAppearance(value as Appearance)
}

function setLanguage(value: unknown) {
  prefs.language = value as Locale
}

function setDensity(value: unknown) {
  prefs.density = value as Density
}

function setContainer(value: unknown) {
  prefs.container = value as Container
}

function setColor(value: ColorPreset) {
  prefs.color = value
}

function reset() {
  prefs.setAppearance('system')
  prefs.language = 'en'
  prefs.color = 'zinc'
  prefs.density = 'comfortable'
  prefs.container = 'fluid'
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader :title="t('appearance')" :description="t('appearanceDescription')">
      <template #actions>
        <Button variant="outline" @click="reset">
          <RotateCcw class="size-4" />
          {{ t('reset') }}
        </Button>
      </template>
    </PageHeader>

    <div class="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{{ t('theme') }}</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <label class="grid gap-2 text-sm font-medium">
            {{ t('appearanceMode') }}
            <Select :model-value="prefs.appearance" @update:model-value="setAppearance">
              <SelectTrigger class="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">{{ t('system') }}</SelectItem>
                <SelectItem value="light">{{ t('light') }}</SelectItem>
                <SelectItem value="dark">{{ t('dark') }}</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label class="grid gap-2 text-sm font-medium">
            {{ t('language') }}
            <Select :model-value="prefs.language" @update:model-value="setLanguage">
              <SelectTrigger class="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{{ t('interface') }}</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <label class="grid gap-2 text-sm font-medium">
            {{ t('density') }}
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
          </label>
          <label class="grid gap-2 text-sm font-medium">
            {{ t('container') }}
            <Select :model-value="prefs.container" @update:model-value="setContainer">
              <SelectTrigger class="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fluid">{{ t('fluid') }}</SelectItem>
                <SelectItem value="boxed">{{ t('boxed') }}</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </CardContent>
      </Card>

      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle>{{ t('colorPreset') }}</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-wrap gap-3">
          <Button
            v-for="color in colorPresets"
            :key="color"
            :variant="prefs.color === color ? 'default' : 'outline'"
            @click="setColor(color)"
          >
            <Check v-if="prefs.color === color" class="size-4" />
            {{ color }}
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
