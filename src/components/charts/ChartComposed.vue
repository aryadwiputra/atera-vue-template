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
    barKeys?: string[]
    lineKeys?: string[]
    height?: number
    xKey?: string
    stacked?: boolean
  }>(),
  { barKeys: () => [], lineKeys: () => [], height: 280, xKey: 'name', stacked: false },
)

const { chartColors } = useChartColors()

const option = computed<EChartsOption>(() => {
  const colors = chartColors.value
  const stack = props.stacked ? 'stack' : undefined

  const barSeries = props.barKeys.map((key, index) => ({
    type: 'bar' as const,
    name: key,
    data: props.data.map((entry) => entry[key]),
    stack,
    itemStyle: {
      color: colors[index % colors.length],
      borderRadius: [4, 4, 0, 0] as [number, number, number, number],
    },
  }))

  const lineSeries = props.lineKeys.map((key, index) => ({
    type: 'line' as const,
    name: key,
    data: props.data.map((entry) => entry[key]),
    smooth: true,
    symbol: 'none',
    lineStyle: { width: 2 },
    itemStyle: { color: colors[(props.barKeys.length + index) % colors.length] },
  }))

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
        lineStyle: { type: [3, 3], color: resolveCssColor(readCssVar('--border')) },
      },
    },
    series: [...barSeries, ...lineSeries],
  }
})
</script>

<template>
  <VChart :option="option" autoresize :style="{ height: height + 'px' }" class="w-full" />
</template>
