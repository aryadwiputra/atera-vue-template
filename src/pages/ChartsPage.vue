<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PageHeader from '@/components/shared/PageHeader.vue'
import ChartArea from '@/components/charts/ChartArea.vue'
import ChartBar from '@/components/charts/ChartBar.vue'
import ChartLine from '@/components/charts/ChartLine.vue'
import ChartPie from '@/components/charts/ChartPie.vue'
import PieLegend from '@/components/charts/PieLegend.vue'
import ChartRadar from '@/components/charts/ChartRadar.vue'
import ChartRadialBar from '@/components/charts/ChartRadialBar.vue'
import ChartScatter from '@/components/charts/ChartScatter.vue'
import ChartTreemap from '@/components/charts/ChartTreemap.vue'
import ChartComposed from '@/components/charts/ChartComposed.vue'
import { useTranslations } from '@/i18n'

const t = useTranslations()

const areaData = [
  { name: 'Jan', value: 42 },
  { name: 'Feb', value: 56 },
  { name: 'Mar', value: 48 },
  { name: 'Apr', value: 68 },
  { name: 'May', value: 60 },
  { name: 'Jun', value: 78 },
  { name: 'Jul', value: 66 },
  { name: 'Aug', value: 88 },
  { name: 'Sep', value: 75 },
  { name: 'Oct', value: 96 },
  { name: 'Nov', value: 84 },
  { name: 'Dec', value: 100 },
]
const barData = [
  { name: 'Mon', value: 32 },
  { name: 'Tue', value: 48 },
  { name: 'Wed', value: 39 },
  { name: 'Thu', value: 61 },
  { name: 'Fri', value: 54 },
  { name: 'Sat', value: 28 },
  { name: 'Sun', value: 35 },
]
const lineData = [
  { name: 'Jan', revenue: 32, users: 18 },
  { name: 'Feb', revenue: 41, users: 24 },
  { name: 'Mar', revenue: 38, users: 29 },
  { name: 'Apr', revenue: 55, users: 36 },
  { name: 'May', revenue: 62, users: 42 },
  { name: 'Jun', revenue: 74, users: 51 },
]
const pieData = [
  { name: 'Direct', value: 42 },
  { name: 'Search', value: 31 },
  { name: 'Referral', value: 17 },
  { name: 'Social', value: 10 },
]
const radarData = [
  { subject: 'Sales', value: 82 },
  { subject: 'Marketing', value: 68 },
  { subject: 'Development', value: 91 },
  { subject: 'Support', value: 74 },
  { subject: 'Operations', value: 60 },
  { subject: 'Design', value: 87 },
]
const radialBarData = [
  { name: 'Target', value: 82 },
  { name: 'Growth', value: 64 },
  { name: 'Reach', value: 48 },
]
const scatterData = [
  { x: 30, y: 45, z: 120 },
  { x: 42, y: 62, z: 90 },
  { x: 55, y: 51, z: 140 },
  { x: 63, y: 78, z: 110 },
  { x: 71, y: 66, z: 160 },
  { x: 84, y: 89, z: 130 },
  { x: 92, y: 74, z: 100 },
]
const treemapData = [
  { name: 'Search', size: 1200 },
  { name: 'Direct', size: 850 },
  { name: 'Social', size: 640 },
  { name: 'Email', size: 480 },
  { name: 'Referral', size: 320 },
  { name: 'Ads', size: 210 },
]
const composedData = [
  { name: 'Jan', revenue: 32, profit: 18 },
  { name: 'Feb', revenue: 41, profit: 22 },
  { name: 'Mar', revenue: 38, profit: 20 },
  { name: 'Apr', revenue: 55, profit: 31 },
  { name: 'May', revenue: 62, profit: 36 },
  { name: 'Jun', revenue: 74, profit: 42 },
]
</script>

<template>
  <main class="flex min-h-full flex-col gap-6 p-4 md:p-6">
    <PageHeader :title="t('charts')" :description="t('chartsDescription')" />

    <div class="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>{{ t('chartArea') }}</CardTitle></CardHeader>
        <CardContent><ChartArea :data="areaData" data-key="value" /></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>{{ t('chartBar') }}</CardTitle></CardHeader>
        <CardContent><ChartBar :data="barData" data-key="value" /></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>{{ t('chartLine') }}</CardTitle></CardHeader>
        <CardContent><ChartLine :data="lineData" :data-keys="['revenue', 'users']" /></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>{{ t('chartPie') }}</CardTitle></CardHeader>
        <CardContent class="flex flex-col gap-3">
          <ChartPie :data="pieData" />
          <PieLegend :data="pieData" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>{{ t('chartRadar') }}</CardTitle></CardHeader>
        <CardContent><ChartRadar :data="radarData" data-key="value" /></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>{{ t('chartRadialBar') }}</CardTitle></CardHeader>
        <CardContent><ChartRadialBar :data="radialBarData" data-key="value" /></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>{{ t('chartTreemap') }}</CardTitle></CardHeader>
        <CardContent><ChartTreemap :data="treemapData" /></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>{{ t('chartScatter') }}</CardTitle></CardHeader>
        <CardContent><ChartScatter :data="scatterData" /></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>{{ t('chartComposed') }}</CardTitle></CardHeader>
        <CardContent>
          <ChartComposed :data="composedData" :bar-keys="['revenue']" :line-keys="['profit']" />
        </CardContent>
      </Card>
    </div>
  </main>
</template>
