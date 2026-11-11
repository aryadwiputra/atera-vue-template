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

const pipelineData = [
  { name: 'Jan', value: 38 },
  { name: 'Feb', value: 52 },
  { name: 'Mar', value: 45 },
  { name: 'Apr', value: 61 },
  { name: 'May', value: 58 },
  { name: 'Jun', value: 72 },
  { name: 'Jul', value: 66 },
  { name: 'Aug', value: 78 },
  { name: 'Sep', value: 70 },
  { name: 'Oct', value: 84 },
  { name: 'Nov', value: 91 },
  { name: 'Dec', value: 103 },
]

const dealStageData = [
  { name: 'Qualifying', value: 45 },
  { name: 'Proposal', value: 32 },
  { name: 'Negotiation', value: 22 },
  { name: 'Won', value: 17 },
]

const weeklyLeads = [
  { name: 'Mon', value: 34 },
  { name: 'Tue', value: 47 },
  { name: 'Wed', value: 41 },
  { name: 'Thu', value: 58 },
  { name: 'Fri', value: 63 },
  { name: 'Sat', value: 26 },
  { name: 'Sun', value: 21 },
]
</script>

<template>
  <main class="flex min-h-full flex-col gap-6 p-4 md:p-6">
    <PageHeader :title="t('crm')" :description="t('pipelineDescription')">
      <template #actions>
        <Button size="sm">
          <Plus class="size-4" />
          {{ t('addReport') }}
        </Button>
      </template>
    </PageHeader>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard :title="t('pipeline')" value="$428K" change="+9.7%" />
      <StatCard :title="t('qualifiedLeads')" value="248" change="+14.2%" />
      <StatCard :title="t('winRate')" value="32.4%" change="+1.8%" />
      <StatCard :title="t('activeAccounts')" value="1,842" change="+5.9%" />
    </div>

    <div class="grid gap-4 xl:grid-cols-[2fr_1fr]">
      <ChartCard :title="t('performanceOverview')">
        <ChartArea :data="pipelineData" data-key="value" />
      </ChartCard>
      <ChartCard :title="t('dealStages')">
        <ChartPie :data="dealStageData" />
        <PieLegend :data="dealStageData" />
      </ChartCard>
    </div>

    <ChartCard :title="t('weeklyLeads')">
      <ChartBar :data="weeklyLeads" data-key="value" />
    </ChartCard>
  </main>
</template>
