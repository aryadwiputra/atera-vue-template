<script setup lang="ts">
import { CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { useTranslations } from '@/i18n'
import ChartArea from '@/components/charts/ChartArea.vue'
import { chartData } from './types'

const t = useTranslations()
const tabs = ['revenue', 'orders', 'profit'] as const
</script>

<template>
  <div class="flex h-full flex-col gap-4 rounded-[--radius-lg] border bg-card p-5 shadow-none">
    <div class="flex items-start justify-between gap-4">
      <div class="flex flex-col gap-1.5">
        <CardTitle class="text-base">{{ t('overview') }}</CardTitle>
        <CardDescription class="mt-1 text-xs">{{ t('monthlyPerformance') }}</CardDescription>
      </div>
      <div class="flex gap-1 rounded-md border p-0.5">
        <button
          v-for="item in tabs"
          :key="item"
          type="button"
          class="rounded px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {{ t(item) }}
        </button>
      </div>
    </div>
    <CardContent class="p-0">
      <ChartArea :data="chartData" data-key="value" :height="260" />
    </CardContent>
  </div>
</template>
