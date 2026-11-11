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
    nameKey?: string
    dataKey?: string
    innerRadius?: number
  }>(),
  { height: 280, nameKey: 'name', dataKey: 'value' },
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
      radius: [props.innerRadius ?? 0, '80%'],
      data: props.data.map((entry, index) => ({
        name: String(entry[props.nameKey]),
        value: Number(entry[props.dataKey]),
        itemStyle: { color: chartColors.value[index % chartColors.value.length] },
      })),
      itemStyle: { borderWidth: 0 },
      label: { show: false },
    },
  ],
}))
</script>

<template>
  <VChart :option="option" autoresize :style="{ height: height + 'px' }" class="w-full" />
</template>
