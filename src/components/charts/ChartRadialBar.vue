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
  }>(),
  { height: 280 },
)

const { chartColors } = useChartColors()

const option = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: resolveCssColor(readCssVar('--card')),
    borderColor: resolveCssColor(readCssVar('--border')),
    textStyle: { color: resolveCssColor(readCssVar('--card-foreground')) },
  },
  series: [
    {
      type: 'pie',
      radius: ['30%', '90%'],
      silent: true,
      label: { show: false },
      data: [{ value: 100, itemStyle: { color: resolveCssColor(readCssVar('--muted')) } }],
    },
    {
      type: 'pie',
      radius: ['30%', '90%'],
      label: { show: false },
      data: props.data.map((entry, index) => ({
        name: String(entry.name),
        value: Number(entry[props.dataKey]),
        itemStyle: {
          color: chartColors.value[index % chartColors.value.length],
          borderRadius: 8,
        },
      })),
    },
  ],
}))
</script>

<template>
  <VChart :option="option" autoresize :style="{ height: height + 'px' }" class="w-full" />
</template>
