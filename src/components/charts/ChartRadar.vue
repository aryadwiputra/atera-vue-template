<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'
import '@/lib/echarts'
import { readCssVar, resolveCssColor } from '@/lib/color'
import { useChartColors } from '@/composables/use-chart-colors'

const props = withDefaults(
  defineProps<{
    data: Array<Record<string, number | string>>
    dataKey: string
    height?: number
    angleKey?: string
  }>(),
  { height: 280, angleKey: 'subject' },
)

const { chartColors } = useChartColors()

const option = computed<EChartsOption>(() => {
  const values = props.data.map((entry) => Number(entry[props.dataKey]))
  const max = Math.ceil(Math.max(...values, 0))
  const color = chartColors.value[0] ?? resolveCssColor(readCssVar('--chart-1'))

  return {
    color: [color],
    tooltip: {
      trigger: 'item',
      backgroundColor: resolveCssColor(readCssVar('--card')),
      borderColor: resolveCssColor(readCssVar('--border')),
      textStyle: { color: resolveCssColor(readCssVar('--card-foreground')) },
    },
    radar: {
      indicator: props.data.map((entry) => ({
        name: String(entry[props.angleKey]),
        max,
      })),
      axisName: { color: resolveCssColor(readCssVar('--muted-foreground')) },
      splitLine: { lineStyle: { color: resolveCssColor(readCssVar('--border')) } },
      splitArea: { show: false },
      axisLine: { lineStyle: { color: resolveCssColor(readCssVar('--border')) } },
    },
    series: [
      {
        type: 'radar',
        data: [{ value: values, name: props.dataKey }],
        areaStyle: { opacity: 0.25 },
        lineStyle: { width: 2 },
        symbol: 'none',
      },
    ],
  }
})
</script>

<template>
  <VChart :option="option" autoresize :style="{ height: height + 'px' }" class="w-full" />
</template>
