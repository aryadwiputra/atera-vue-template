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

const mrrData = [
  { name: 'Jan', value: 68 }, { name: 'Feb', value: 74 }, { name: 'Mar', value: 81 }, { name: 'Apr', value: 88 },
  { name: 'May', value: 92 }, { name: 'Jun', value: 101 }, { name: 'Jul', value: 108 }, { name: 'Aug', value: 115 },
  { name: 'Sep', value: 119 }, { name: 'Oct', value: 126 }, { name: 'Nov', value: 133 }, { name: 'Dec', value: 145 },
]

const planData = [
  { name: 'Starter', value: 52 }, { name: 'Pro', value: 34 }, { name: 'Business', value: 14 },
]

const weeklySignups = [
  { name: 'Mon', value: 38 }, { name: 'Tue', value: 54 }, { name: 'Wed', value: 49 }, { name: 'Thu', value: 66 },
  { name: 'Fri', value: 72 }, { name: 'Sat', value: 31 }, { name: 'Sun', value: 27 },
]
</script>

<template>
  <main class="flex min-h-full flex-col gap-6 p-4 md:p-6">
    <PageHeader :title="t('saas')" :description="t('saasDescription')">
      <template #actions>
        <Button size="sm">
          <Plus class="size-4" />
          {{ t('addReport') }}
        </Button>
      </template>
    </PageHeader>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="MRR" value="$128,430" change="+10.4%" />
      <StatCard :title="t('activeUsers')" value="8,942" change="+7.3%" />
      <StatCard :title="t('churn')" value="2.1%" change="-0.4%" :change-positive="false" />
      <StatCard title="ARPU" value="$84.20" change="+3.8%" />
    </div>

    <div class="grid gap-4 xl:grid-cols-[2fr_1fr]">
      <ChartCard :title="t('performanceOverview')">
        <ChartArea :data="mrrData" data-key="value" />
      </ChartCard>
      <ChartCard :title="t('planDistribution')">
        <ChartPie :data="planData" />
        <PieLegend :data="planData" />
      </ChartCard>
    </div>

    <ChartCard :title="t('weeklySignups')">
      <ChartBar :data="weeklySignups" data-key="value" />
    </ChartCard>
  </main>
</template>
