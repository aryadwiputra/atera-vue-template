<script setup lang="ts">
import { ArrowDownRightIcon, ArrowUpRightIcon } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from '@/i18n'
import type { Metric } from './types'

defineProps<{
  metric: Metric
}>()

const t = useTranslations()
</script>

<template>
  <Card class="gap-3 py-5 shadow-none">
    <CardHeader class="gap-0 px-5">
      <CardDescription class="text-xs">{{ t(metric.label) }}</CardDescription>
      <CardTitle class="mt-2 text-2xl tracking-tight">{{ metric.value }}</CardTitle>
    </CardHeader>
    <CardContent class="px-5">
      <div :class="cn('flex items-center gap-1 text-xs font-medium', metric.positive ? 'text-foreground' : 'text-muted-foreground')">
        <ArrowUpRightIcon v-if="metric.positive" class="size-3.5" />
        <ArrowDownRightIcon v-else class="size-3.5" />
        <span>{{ metric.change }}</span>
        <span class="font-normal text-muted-foreground">{{ t('vsLastMonth') }}</span>
      </div>
    </CardContent>
  </Card>
</template>
