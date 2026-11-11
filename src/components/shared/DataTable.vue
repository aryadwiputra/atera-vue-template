<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronDown, ChevronUp, ChevronsUpDown, ListX, Search } from '@lucide/vue'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import EmptyState from '@/components/shared/EmptyState.vue'

export interface DataTableColumn {
  key: string
  header: string
  sortable?: boolean
  align?: 'left' | 'right'
  class?: string
}

const props = withDefaults(
  defineProps<{
    columns: DataTableColumn[]
    data: any[]
    filterPlaceholder?: string
    rowKey?: string
    emptyTitle?: string
  }>(),
  {
    filterPlaceholder: 'Filter...',
    rowKey: 'id',
    emptyTitle: 'No matching records',
  },
)

const filter = ref('')
const page = ref(1)
const pageSize = ref(10)
const sort = ref<{ key: string; direction: 'asc' | 'desc' } | null>(null)
const selected = ref<Set<string>>(new Set())

const filtered = computed(() => {
  const query = filter.value.trim().toLowerCase()
  let rows = props.data

  if (query) {
    rows = rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(query),
      ),
    )
  }

  if (sort.value) {
    const { key, direction } = sort.value
    rows = [...rows].sort((a, b) => {
      const left = a[key]
      const right = b[key]
      if (typeof left === 'number' && typeof right === 'number') {
        return direction === 'asc' ? left - right : right - left
      }
      const result = String(left).localeCompare(String(right), undefined, {
        numeric: true,
      })
      return direction === 'asc' ? result : -result
    })
  }

  return rows
})

const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
const pageData = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

watch([filter, pageSize], () => {
  page.value = 1
})

watch(pageCount, (count) => {
  if (page.value > count) page.value = count
})

function rowId(row: any): string {
  return String(row[props.rowKey])
}

const allVisibleSelected = computed(
  () => pageData.value.length > 0 && pageData.value.every((row) => selected.value.has(rowId(row))),
)

function toggleAll() {
  const next = new Set(selected.value)
  if (allVisibleSelected.value) {
    pageData.value.forEach((row) => next.delete(rowId(row)))
  } else {
    pageData.value.forEach((row) => next.add(rowId(row)))
  }
  selected.value = next
}

function toggleRow(row: any) {
  const next = new Set(selected.value)
  const id = rowId(row)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selected.value = next
}

function toggleSort(column: DataTableColumn) {
  if (!column.sortable) return
  if (!sort.value || sort.value.key !== column.key) {
    sort.value = { key: column.key, direction: 'asc' }
  } else if (sort.value.direction === 'asc') {
    sort.value = { key: column.key, direction: 'desc' }
  } else {
    sort.value = null
  }
}

function cellValue(row: any, key: string): string {
  const value = row[key]
  return value == null ? '' : String(value)
}

function clearFilter() {
  filter.value = ''
}

defineExpose({ clearSelection: () => (selected.value = new Set()) })
</script>

<template>
  <Card class="py-0 shadow-none">
    <CardContent class="p-0">
      <div class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="relative w-full sm:max-w-xs">
          <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input v-model="filter" :placeholder="filterPlaceholder" class="pl-9" />
        </div>
        <div class="flex items-center gap-2 text-xs text-muted-foreground">
          <span v-if="selected.size">{{ selected.size }} selected</span>
          <span v-else>{{ filtered.length }} results</span>
          <Button v-if="filter" variant="ghost" size="sm" @click="clearFilter">Clear</Button>
        </div>
      </div>

      <div class="hidden overflow-x-auto border-t md:block">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b bg-muted/40">
              <th class="w-10 px-4 py-3">
                <Checkbox :model-value="allVisibleSelected" @update:model-value="toggleAll" />
              </th>
              <th
                v-for="column in columns"
                :key="column.key"
                :class="['px-4 py-3 text-xs font-medium text-muted-foreground', column.align === 'right' ? 'text-right' : 'text-left']"
              >
                <button
                  v-if="column.sortable"
                  type="button"
                  class="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                  @click="toggleSort(column)"
                >
                  {{ column.header }}
                  <ChevronUp v-if="sort?.key === column.key && sort.direction === 'asc'" class="size-3.5" />
                  <ChevronDown v-else-if="sort?.key === column.key && sort.direction === 'desc'" class="size-3.5" />
                  <ChevronsUpDown v-else class="size-3.5 opacity-50" />
                </button>
                <span v-else>{{ column.header }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pageData.length === 0">
              <td :colspan="columns.length + 1">
                <EmptyState :icon="ListX" :title="emptyTitle">
                  <Button v-if="filter" variant="outline" size="sm" @click="clearFilter">Clear</Button>
                </EmptyState>
              </td>
            </tr>
            <tr
              v-for="row in pageData"
              :key="rowId(row)"
              class="border-b last:border-0 transition-colors hover:bg-muted/30"
            >
              <td class="px-4 py-3">
                <Checkbox
                  :model-value="selected.has(rowId(row))"
                  @update:model-value="toggleRow(row)"
                />
              </td>
              <td
                v-for="column in columns"
                :key="column.key"
                :class="['px-4 py-3', column.align === 'right' ? 'text-right' : 'text-left', column.class]"
              >
                <slot name="cell" :row="row" :column="column">
                  {{ cellValue(row, column.key) }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-col gap-3 p-4 md:hidden">
        <div v-if="pageData.length === 0">
          <EmptyState :icon="ListX" :title="emptyTitle" />
        </div>
        <div
          v-for="row in pageData"
          :key="rowId(row)"
          class="rounded-lg border p-3"
        >
          <slot name="mobile-card" :row="row">
            <dl class="grid grid-cols-2 gap-2 text-sm">
              <template v-for="column in columns" :key="column.key">
                <dt class="text-xs text-muted-foreground">{{ column.header }}</dt>
                <dd class="text-right">{{ cellValue(row, column.key) }}</dd>
              </template>
            </dl>
          </slot>
        </div>
      </div>

      <div class="flex items-center justify-between gap-3 border-t px-4 py-3 text-xs text-muted-foreground">
        <div class="flex items-center gap-2">
          <span>Rows per page</span>
          <Select v-model="pageSize">
            <SelectTrigger class="h-8 w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem :value="5">5</SelectItem>
              <SelectItem :value="10">10</SelectItem>
              <SelectItem :value="25">25</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="flex items-center gap-2">
          <span>
            {{ filtered.length === 0 ? 0 : (page - 1) * pageSize + 1 }}-{{ Math.min(page * pageSize, filtered.length) }} of {{ filtered.length }}
          </span>
          <Button variant="outline" size="sm" :disabled="page <= 1" @click="page--">Previous</Button>
          <Button variant="outline" size="sm" :disabled="page >= pageCount" @click="page++">Next</Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
