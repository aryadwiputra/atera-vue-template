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
    dataKey?: string
    height?: number
    xKey?: string
    stacked?: boolean
    series?: Array<{ key: string; colorIndex?: number }>
  }>(),
  { height: 280, xKey: 'name', stacked: false },
)

const { chartColors } = useChartColors()

const option = computed<EChartsOption>(() => {
  const colors = chartColors.value
  const stack = props.stacked ? 'stack' : undefined
  const barSeries = props.series
    ? props.series.map((entry, index) => ({
        type: 'bar' as const,
        name: entry.key,
        data: props.data.map((item) => item[entry.key]),
        stack,
        itemStyle: {
          color: colors[entry.colorIndex ?? index],
          borderRadius: [4, 4, 0, 0] as [number, number, number, number],
        },
      }))
    : props.dataKey
      ? [
          {
            type: 'bar' as const,
            name: props.dataKey,
            data: props.data.map((item) => item[props.dataKey as string]),
            stack,
            itemStyle: {
              color: colors[0],
              borderRadius: [4, 4, 0, 0] as [number, number, number, number],
            },
          },
        ]
      : []

  return {
    grid: { top: 8, right: 8, bottom: 0, left: 0, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: resolveCssColor(readCssVar('--card')),
      borderColor: resolveCssColor(readCssVar('--border')),
      textStyle: { color: resolveCssColor(readCssVar('--card-foreground')) },
    },
    xAxis: {
      type: 'category',
      data: props.data.map((entry) => entry[props.xKey]),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: resolveCssColor(readCssVar('--muted-foreground')) },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: resolveCssColor(readCssVar('--muted-foreground')) },
      splitLine: {
        lineStyle: {
          type: [3, 3],
          color: resolveCssColor(readCssVar('--border')),
        },
      },
    },
    series: barSeries,
  }
})
</script>

<template>
  <VChart :option="option" autoresize :style="{ height: height + 'px' }" class="w-full" />
</template>
