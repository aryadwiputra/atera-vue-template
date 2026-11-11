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
    dataKeys: string[]
    height?: number
    xKey?: string
  }>(),
  { height: 280, xKey: 'name' },
)

const { chartColors } = useChartColors()

const option = computed<EChartsOption>(() => ({
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
  series: props.dataKeys.map((key, index) => ({
    type: 'line',
    name: key,
    data: props.data.map((entry) => entry[key]),
    smooth: true,
    symbol: 'none',
    lineStyle: { width: 2 },
    itemStyle: { color: chartColors.value[index % chartColors.value.length] },
  })),
}))
</script>

<template>
  <VChart :option="option" autoresize :style="{ height: height + 'px' }" class="w-full" />
</template>
