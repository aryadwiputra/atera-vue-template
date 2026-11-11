<script setup lang="ts">
import { Plus } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/shared/PageHeader.vue'
import StatCard from '@/components/shared/StatCard.vue'
import ChartCard from '@/components/charts/ChartCard.vue'
import ChartArea from '@/components/charts/ChartArea.vue'
import ChartBar from '@/components/charts/ChartBar.vue'
import ChartPie from '@/components/charts/ChartPie.vue'
import PieLegend from '@/components/charts/PieLegend.vue'
import { useTranslations } from '@/i18n'

const t = useTranslations()

const revenueData = [
  { name: 'Jan', value: 58 },
  { name: 'Feb', value: 71 },
  { name: 'Mar', value: 64 },
  { name: 'Apr', value: 82 },
  { name: 'May', value: 78 },
  { name: 'Jun', value: 94 },
  { name: 'Jul', value: 89 },
  { name: 'Aug', value: 106 },
  { name: 'Sep', value: 98 },
  { name: 'Oct', value: 114 },
  { name: 'Nov', value: 121 },
  { name: 'Dec', value: 138 },
]

const channelData = [
  { name: 'Store', value: 42 },
  { name: 'Marketplace', value: 31 },
  { name: 'Social', value: 17 },
  { name: 'Wholesale', value: 10 },
]

const weeklyBars = [
  { name: 'Mon', value: 45 },
  { name: 'Tue', value: 61 },
  { name: 'Wed', value: 52 },
  { name: 'Thu', value: 73 },
  { name: 'Fri', value: 68 },
  { name: 'Sat', value: 34 },
  { name: 'Sun', value: 29 },
]
</script>

<template>
  <main class="flex min-h-full flex-col gap-6 p-4 md:p-6">
    <PageHeader :title="t('ecommerce')" :description="t('salesPerformanceDescription')">
      <template #actions>
        <Button size="sm">
          <Plus class="size-4" />
          {{ t('addReport') }}
        </Button>
      </template>
    </PageHeader>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard :title="t('revenue')" value="$84,290" change="+12.5%" />
      <StatCard :title="t('orders')" value="1,284" change="+8.1%" />
      <StatCard :title="t('conversionRate')" value="4.82%" change="+0.4%" />
      <StatCard :title="t('refunds')" value="$2,481" change="-2.3%" :change-positive="false" />
    </div>

    <div class="grid gap-4 xl:grid-cols-[2fr_1fr]">
      <ChartCard :title="t('performanceOverview')">
        <ChartArea :data="revenueData" data-key="value" />
      </ChartCard>
      <ChartCard :title="t('channelMix')">
        <ChartPie :data="channelData" />
        <PieLegend :data="channelData" />
      </ChartCard>
    </div>

    <ChartCard :title="t('weeklyOrders')">
      <ChartBar :data="weeklyBars" data-key="value" />
    </ChartCard>
  </main>
</template>
