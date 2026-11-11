<script setup lang="ts">
import { MoreHorizontalIcon } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from '@/i18n'

const t = useTranslations()

const goals = [
  ['revenueTarget', '$38,420 / $50,000', '77%'],
  ['newCustomers', '184 / 250', '74%'],
  ['conversionRate', '3.8% / 5.0%', '76%'],
] as const
</script>

<template>
  <Card class="gap-5 py-5 shadow-none">
    <CardHeader class="flex flex-row items-center justify-between px-5">
      <div>
        <CardTitle class="text-base">{{ t('monthlyGoals') }}</CardTitle>
        <CardDescription class="mt-1 text-xs">{{ t('trackProgress') }}</CardDescription>
      </div>
      <Button variant="ghost" size="icon" class="size-7">
        <MoreHorizontalIcon class="size-4" />
      </Button>
    </CardHeader>
    <CardContent class="flex flex-col gap-5 px-5">
      <div v-for="[label, value, progress] in goals" :key="label" class="flex flex-col gap-2">
        <div class="flex justify-between text-xs">
          <span>{{ t(label) }}</span>
          <span class="text-muted-foreground">{{ progress }}</span>
        </div>
        <div class="h-1.5 rounded-full bg-muted">
          <div class="h-full rounded-full bg-foreground" :style="{ width: progress }" />
        </div>
        <p class="text-[11px] text-muted-foreground">{{ value }}</p>
      </div>
    </CardContent>
  </Card>
</template>
