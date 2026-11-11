<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from '@/i18n'

const t = useTranslations()

const sources = [
  { label: 'direct', value: '35%', width: '35%' },
  { label: 'organicSearch', value: '28%', width: '28%' },
  { label: 'referral', value: '22%', width: '22%' },
  { label: 'social', value: '15%', width: '15%' },
] as const
</script>

<template>
  <Card class="gap-5 py-5 shadow-none">
    <CardHeader class="px-5">
      <CardTitle class="text-base">{{ t('trafficSources') }}</CardTitle>
      <CardDescription class="text-xs">{{ t('visitorSources') }}</CardDescription>
    </CardHeader>
    <CardContent class="flex flex-col gap-5 px-5">
      <div class="text-3xl font-semibold tracking-tight">
        284K <span class="text-xs font-normal text-muted-foreground">{{ t('visits') }}</span>
      </div>
      <div class="flex h-2 overflow-hidden rounded-full bg-muted">
        <div
          v-for="(source, index) in sources"
          :key="source.label"
          :class="cn('h-full', index % 2 === 0 ? 'bg-foreground' : 'bg-foreground/45')"
          :style="{ width: source.width }"
        />
      </div>
      <div class="flex flex-col gap-3">
        <div
          v-for="(source, index) in sources"
          :key="source.label"
          class="flex items-center justify-between text-xs"
        >
          <span class="flex items-center gap-2 text-muted-foreground">
            <span :class="cn('size-2 rounded-full', index % 2 === 0 ? 'bg-foreground' : 'bg-foreground/45')" />
            {{ t(source.label) }}
          </span>
          <span class="font-medium text-foreground">{{ source.value }}</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
