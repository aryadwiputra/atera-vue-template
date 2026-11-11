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
    height?: number
    xKey?: string
    yKey?: string
    zKey?: string
  }>(),
  { height: 280, xKey: 'x', yKey: 'y', zKey: 'z' },
)

const { chartColors } = useChartColors()

const option = computed<EChartsOption>(() => {
  const zValues = props.data.map((entry) => Number(entry[props.zKey]))
  const minZ = Math.min(...zValues)
  const maxZ = Math.max(...zValues)
  const span = maxZ - minZ || 1

  return {
    grid: { top: 8, right: 16, bottom: 0, left: 0, containLabel: true },
    tooltip: {
      trigger: 'item',
      backgroundColor: resolveCssColor(readCssVar('--card')),
      borderColor: resolveCssColor(readCssVar('--border')),
      textStyle: { color: resolveCssColor(readCssVar('--card-foreground')) },
    },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: resolveCssColor(readCssVar('--muted-foreground')) },
      splitLine: {
        lineStyle: { type: [3, 3], color: resolveCssColor(readCssVar('--border')) },
      },
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
    series: [
      {
        type: 'scatter',
        data: props.data.map((entry) => [
          Number(entry[props.xKey]),
          Number(entry[props.yKey]),
          Number(entry[props.zKey]),
        ]),
        symbolSize: (value: unknown) => {
          const z = Number((value as number[])[2])
          return 8 + ((z - minZ) / span) * 20
        },
        itemStyle: { color: chartColors.value[0] },
      },
    ],
  }
})
</script>

<template>
  <VChart :option="option" autoresize :style="{ height: height + 'px' }" class="w-full" />
</template>
