<script setup lang="ts">
import { CheckIcon } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from '@/i18n'
import { activities } from './types'

const t = useTranslations()
</script>

<template>
  <Card class="gap-5 py-5 shadow-none">
    <CardHeader class="flex flex-row items-center justify-between px-5">
      <div>
        <CardTitle class="text-base">{{ t('recentActivity') }}</CardTitle>
        <CardDescription class="mt-1 text-xs">{{ t('latestUpdates') }}</CardDescription>
      </div>
      <Button variant="ghost" size="sm" class="h-7 text-xs">{{ t('viewAll') }}</Button>
    </CardHeader>
    <CardContent class="flex flex-col gap-5 px-5">
      <div v-for="activity in activities" :key="activity.title" class="flex gap-3">
        <div class="flex size-7 shrink-0 items-center justify-center rounded-full border bg-muted">
          <CheckIcon class="size-3.5" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-medium">{{ t(activity.title) }}</p>
          <p class="mt-0.5 truncate text-[11px] text-muted-foreground">
            {{ activity.detail ? `${activity.detail} ${t(activity.description)}` : t(activity.description) }}
          </p>
        </div>
        <span class="text-2xs text-muted-foreground">{{ activity.time }}</span>
      </div>
    </CardContent>
  </Card>
</template>
