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
    xKey?: string
    fill?: boolean
  }>(),
  { height: 280, xKey: 'name', fill: true },
)

const { chartColors } = useChartColors()

const option = computed<EChartsOption>(() => {
  const color = chartColors.value[0] ?? resolveCssColor(readCssVar('--chart-1'))
  return {
    color: [color],
    grid: { top: 8, right: 8, bottom: 0, left: 0, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: resolveCssColor(readCssVar('--card')),
      borderColor: resolveCssColor(readCssVar('--border')),
      textStyle: { color: resolveCssColor(readCssVar('--card-foreground')) },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
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
    series: [
      {
        type: 'line',
        data: props.data.map((entry) => entry[props.dataKey]),
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2 },
        areaStyle: props.fill
          ? {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: color.replace('rgb(', 'rgba(').replace(')', ', 0.35)') },
                  { offset: 1, color: color.replace('rgb(', 'rgba(').replace(')', ', 0.02)') },
                ],
              },
            }
          : undefined,
      },
    ],
  }
})
</script>

<template>
  <VChart :option="option" autoresize :style="{ height: height + 'px' }" class="w-full" />
</template>
