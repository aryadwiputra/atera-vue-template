<script setup lang="ts">
import { computed } from 'vue'
import { Activity, DollarSign, Server, TrendingUp, Users } from '@lucide/vue'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import ChartCard from '@/components/charts/ChartCard.vue'
import ChartArea from '@/components/charts/ChartArea.vue'
import ChartBar from '@/components/charts/ChartBar.vue'
import ChartPie from '@/components/charts/ChartPie.vue'
import PieLegend from '@/components/charts/PieLegend.vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import StatCard from '@/components/shared/StatCard.vue'
import { useChartColors } from '@/composables/use-chart-colors'
import { useTranslations } from '@/i18n'
import type { TranslationKey } from '@/i18n'

const t = useTranslations()
const { chartColors } = useChartColors()

const sparkData = [
  { value: 12 },
  { value: 18 },
  { value: 15 },
  { value: 24 },
  { value: 21 },
  { value: 32 },
  { value: 29 },
  { value: 38 },
]

const sparkCards = [
  { title: t('weeklyVisitors'), value: '12,847', data: sparkData, colorIndex: 0 },
  { title: t('newSignups'), value: '1,204', data: [...sparkData].reverse(), colorIndex: 1 },
]

const badgeVariants = ['default', 'secondary', 'destructive', 'outline'] as const
const badgeLabels: Record<(typeof badgeVariants)[number], TranslationKey> = {
  default: 'statusActive',
  secondary: 'statusPending',
  destructive: 'statusFailed',
  outline: 'statusDraft',
}

const progressItems: { key: TranslationKey; value: number }[] = [
  { key: 'storageUsed', value: 72 },
  { key: 'monthlyBandwidth', value: 48 },
  { key: 'teamSeats', value: 90 },
]

const avatarPeople = [
  { initials: 'AM', name: 'Avery Morgan' },
  { initials: 'SC', name: 'Sofia Chen' },
  { initials: 'MR', name: 'Marcus Reed' },
  { initials: 'LW', name: 'Lily Wong' },
  { initials: 'JK', name: 'Jonas Klein' },
]

const areaTrend = [
  { month: 'Jan', value: 24 },
  { month: 'Feb', value: 35 },
  { month: 'Mar', value: 30 },
  { month: 'Apr', value: 46 },
  { month: 'May', value: 52 },
  { month: 'Jun', value: 68 },
]

const weeklyBars = [
  { name: 'Mon', value: 32 },
  { name: 'Tue', value: 48 },
  { name: 'Wed', value: 39 },
  { name: 'Thu', value: 61 },
  { name: 'Fri', value: 54 },
  { name: 'Sat', value: 28 },
  { name: 'Sun', value: 35 },
]

const trafficSources = [
  { name: 'Organic', value: 42 },
  { name: 'Direct', value: 28 },
  { name: 'Referral', value: 18 },
  { name: 'Social', value: 12 },
]

function sparkPoints(data: { value: number }[]) {
  const max = Math.max(...data.map((entry) => entry.value))
  const min = Math.min(...data.map((entry) => entry.value))
  const span = max - min || 1
  return data
    .map((entry, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((entry.value - min) / span) * 100
      return `${x},${y}`
    })
    .join(' ')
}

const ringCircumference = 2 * Math.PI * 42
const storageValue = 72
const ringOffset = computed(() => ringCircumference * (1 - storageValue / 100))
</script>

<template>
  <main class="flex min-h-full flex-col gap-6 p-4 md:p-6">
    <PageHeader :title="t('widgets')" :description="t('widgetsDescription')" />

    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{{ t('statCards') }}</h2>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard :title="t('totalRevenue')" value="$48,295" change="+12.5%" :icon="DollarSign" />
        <StatCard :title="t('activeUsers')" value="2,847" change="+8.2%" :icon="Users" />
        <StatCard :title="t('engagementRate')" value="68.4%" change="+4.6%" :icon="Activity" />
        <StatCard
          :title="t('serverUptime')"
          value="99.9%"
          change="-0.1%"
          :change-positive="false"
          :icon="Server"
        />
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{{ t('miniWidgets') }}</h2>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card v-for="card in sparkCards" :key="card.title" class="gap-3 overflow-hidden py-5 shadow-none">
          <CardHeader class="flex flex-row items-center justify-between gap-3">
            <CardDescription class="text-sm font-medium">{{ card.title }}</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-2">
            <p class="text-2xl font-semibold tracking-tight">{{ card.value }}</p>
            <div class="-mx-4 -mb-5">
              <svg viewBox="0 0 100 40" preserveAspectRatio="none" class="h-12 w-full">
                <polygon
                  :points="`${sparkPoints(card.data)} 100,40 0,40`"
                  :style="{ fill: chartColors[card.colorIndex] ?? chartColors[0] }"
                  fill-opacity="0.15"
                />
                <polyline
                  :points="sparkPoints(card.data)"
                  fill="none"
                  :style="{ stroke: chartColors[card.colorIndex] ?? chartColors[0] }"
                  stroke-width="2"
                  vector-effect="non-scaling-stroke"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                />
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card class="gap-3 py-5 shadow-none">
          <CardHeader class="flex flex-row items-center justify-between gap-3">
            <CardDescription class="text-sm font-medium">{{ t('storageUsed') }}</CardDescription>
            <span class="text-xs text-muted-foreground">840 GB / 1 TB</span>
          </CardHeader>
          <CardContent class="flex items-center justify-center">
            <div class="relative size-28">
              <svg viewBox="0 0 100 100" class="size-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--muted)" stroke-width="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  :style="{ stroke: chartColors[2] ?? chartColors[0] }"
                  stroke-width="8"
                  stroke-linecap="round"
                  :stroke-dasharray="ringCircumference"
                  :stroke-dashoffset="ringOffset"
                />
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-xl font-semibold tracking-tight">
                {{ storageValue }}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card class="gap-3 py-5 shadow-none">
          <CardHeader class="flex flex-row items-center justify-between gap-3">
            <CardDescription class="text-sm font-medium">{{ t('conversionRate') }}</CardDescription>
            <span
              class="inline-flex items-center gap-1 rounded-full bg-status-success/10 px-2 py-0.5 text-xs font-medium text-status-success"
            >
              <TrendingUp class="size-3" />
              +12.5%
            </span>
          </CardHeader>
          <CardContent>
            <p class="text-2xl font-semibold tracking-tight">4.6%</p>
          </CardContent>
        </Card>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{{ t('progressBars') }}</h2>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div v-for="item in progressItems" :key="item.key" class="flex flex-col gap-2 rounded-[--radius-lg] border bg-card p-5">
          <div class="flex items-center justify-between text-sm">
            <span class="font-medium">{{ t(item.key) }}</span>
            <span class="text-muted-foreground">{{ item.value }}%</span>
          </div>
          <div class="h-2 rounded bg-muted">
            <div class="h-2 rounded bg-primary" :style="{ width: `${item.value}%` }" />
          </div>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{{ t('badges') }}</h2>
      <div class="flex flex-wrap items-center gap-3 rounded-[--radius-lg] border bg-card p-5">
        <Badge v-for="variant in badgeVariants" :key="variant" :variant="variant">
          {{ t(badgeLabels[variant]) }}
        </Badge>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{{ t('avatars') }}</h2>
      <div class="flex flex-wrap items-center gap-2 rounded-[--radius-lg] border bg-card p-5">
        <Avatar v-for="person in avatarPeople" :key="person.initials" class="border bg-muted" :title="person.name">
          <AvatarFallback>{{ person.initials }}</AvatarFallback>
        </Avatar>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{{ t('miniCharts') }}</h2>
      <div class="grid gap-4 xl:grid-cols-3">
        <ChartCard :title="t('visitorsOverTime')" :description="t('visitorsOverTimeDescription')">
          <ChartArea :data="areaTrend" data-key="value" x-key="month" />
        </ChartCard>
        <ChartCard :title="t('weeklyActivity')" :description="t('eventsThisWeek')">
          <ChartBar :data="weeklyBars" data-key="value" x-key="name" />
        </ChartCard>
        <ChartCard :title="t('acquisitionChannels')" :description="t('whereVisitorsComeFrom')">
          <ChartPie :data="trafficSources" :inner-radius="70" />
          <PieLegend :data="trafficSources" />
        </ChartCard>
      </div>
    </section>
  </main>
</template>
