<script setup lang="ts">
import { useChartColors } from '@/composables/use-chart-colors'

defineProps<{
  data: Array<Record<string, number | string>>
}>()

const { chartColors } = useChartColors()
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <div v-for="(entry, index) in data" :key="String(entry.name)" class="flex items-center gap-1.5">
      <span
        class="inline-block size-2 rounded-full"
        :style="{ backgroundColor: chartColors[index % chartColors.length] }"
      />
      <span class="text-[11px] text-muted-foreground">{{ entry.name }} · {{ entry.value }}</span>
    </div>
  </div>
</template>
