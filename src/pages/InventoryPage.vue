<script setup lang="ts">
import { computed } from 'vue'
import { Boxes, PackageMinus, PackageX, Warehouse } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import PageHeader from '@/components/shared/PageHeader.vue'
import DataTable from '@/components/shared/DataTable.vue'
import type { DataTableColumn } from '@/components/shared/DataTable.vue'
import StatCard from '@/components/shared/StatCard.vue'
import { inventoryService } from '@/services/inventory-service'
import type { InventoryItem } from '@/lib/data/types'
import { useTranslations } from '@/i18n'

type InventoryRow = InventoryItem & {
  category: string
  available: number
  status: string
}

const t = useTranslations()

const available = (item: InventoryItem) => item.onHand - item.reserved

const stockStatus = (item: InventoryItem) => {
  const qty = available(item)
  return qty === 0 ? 'Out' : qty <= item.reorderPoint ? 'Low' : 'OK'
}

const items = inventoryService.list()

const rows = computed<InventoryRow[]>(() =>
  items.map((item) => ({
    ...item,
    category: item.warehouse,
    available: available(item),
    status: stockStatus(item),
  })),
)

const totalUnits = computed(() => items.reduce((sum, item) => sum + item.onHand, 0))
const lowStockCount = computed(() => items.filter((item) => stockStatus(item) === 'Low').length)
const outOfStockCount = computed(() => items.filter((item) => stockStatus(item) === 'Out').length)

const stats = computed(() => [
  { title: t('totalSkus'), value: String(items.length), icon: Boxes },
  { title: t('totalUnits'), value: totalUnits.value.toLocaleString('en-US'), icon: Warehouse },
  { title: t('lowStockCount'), value: String(lowStockCount.value), icon: PackageMinus },
  { title: 'Out of stock', value: String(outOfStockCount.value), icon: PackageX },
])

const columns = computed<DataTableColumn[]>(() => [
  { key: 'sku', header: 'SKU', sortable: true },
  { key: 'name', header: t('itemName'), sortable: true },
  { key: 'category', header: t('category'), sortable: true },
  { key: 'onHand', header: t('onHand'), align: 'right', sortable: true },
  { key: 'reserved', header: t('reserved'), align: 'right', sortable: true },
  { key: 'available', header: t('available'), align: 'right', sortable: true },
  { key: 'reorderPoint', header: t('reorderPoint'), align: 'right', sortable: true },
  { key: 'status', header: t('status'), sortable: true },
])

function statusVariant(status: string) {
  if (status === 'OK') return 'default'
  if (status === 'Low') return 'secondary'
  return 'destructive'
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('inventory')"
      :description="t('inventoryDescription')"
      :breadcrumbs="[{ title: t('dashboard'), href: '/dashboard' }, { title: t('inventory'), href: '/inventory' }]"
    />

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        v-for="card in stats"
        :key="card.title"
        :title="card.title"
        :value="card.value"
        :icon="card.icon"
      />
    </div>

    <DataTable :columns="columns" :data="rows" :filter-placeholder="t('inventory')">
      <template #cell="{ row, column }">
        <template v-if="column.key === 'sku'">
          <span class="font-mono">{{ row.sku }}</span>
        </template>
        <template v-else-if="column.key === 'category'">
          {{ row.category }}
        </template>
        <template v-else-if="column.key === 'onHand' || column.key === 'reserved' || column.key === 'available' || column.key === 'reorderPoint'">
          <span class="tabular-nums">{{ row[column.key] }}</span>
        </template>
        <template v-else-if="column.key === 'status'">
          <Badge :variant="statusVariant(String(row.status))">{{ row.status }}</Badge>
        </template>
        <template v-else>{{ row[column.key] }}</template>
      </template>
    </DataTable>
  </div>
</template>
