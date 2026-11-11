import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { readCssVar, resolveCssColor } from '@/lib/color'
import { usePreferencesStore } from '@/stores/preferences'

export function useChartColors() {
  const store = usePreferencesStore()
  const colors = ref<string[]>([])

  function resolve() {
    colors.value = Array.from({ length: 5 }, (_, index) =>
      resolveCssColor(readCssVar(`--chart-${index + 1}`)),
    )
  }

  if (typeof document !== 'undefined') resolve()
  onMounted(resolve)

  watch([() => store.appearance, () => store.color], async () => {
    await nextTick()
    resolve()
  })

  return { chartColors: computed(() => colors.value) }
}
