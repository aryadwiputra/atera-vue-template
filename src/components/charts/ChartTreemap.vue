<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'
import '@/lib/echarts'
import { readCssVar, resolveCssColor } from '@/lib/color'
import { useChartColors } from '@/composables/use-chart-colors'

const props = withDefaults(
  defineProps<{
    data: Array<{ name: string; size: number } & Record<string, number | string>>
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
      type: 'treemap',
      breadcrumb: { show: false },
      data: props.data.map((entry, index) => ({
        name: entry.name,
        value: entry.size,
        itemStyle: { color: chartColors.value[index % chartColors.value.length] },
      })),
      itemStyle: {
        borderColor: resolveCssColor(readCssVar('--card')),
        borderWidth: 2,
      },
      label: { color: resolveCssColor(readCssVar('--foreground')) },
    },
  ],
}))
</script>

<template>
  <VChart :option="option" autoresize :style="{ height: height + 'px' }" class="w-full" />
</template>
