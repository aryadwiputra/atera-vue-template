<script setup lang="ts">
import { computed, ref } from 'vue'
import { ClipboardCheck, ClipboardList, DollarSign, FileClock, Eye } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import PageHeader from '@/components/shared/PageHeader.vue'
import DataTable from '@/components/shared/DataTable.vue'
import type { DataTableColumn } from '@/components/shared/DataTable.vue'
import StatCard from '@/components/shared/StatCard.vue'
import { procurementService } from '@/services/procurement-service'
import { poTotal } from '@/lib/data/procurement'
import type { PurchaseOrder } from '@/lib/data/types'
import { useTranslations } from '@/i18n'
import { useToast } from '@/composables/use-toast'

const t = useTranslations()
const { toast } = useToast()

const formatMoney = (value: number) => `$${value.toLocaleString('en-US')}`

const rows = ref<PurchaseOrder[]>(procurementService.list())
const detail = ref<PurchaseOrder | null>(null)

const pendingCount = computed(() => rows.value.filter((po) => po.status === 'Pending').length)
const approvedCount = computed(() => rows.value.filter((po) => po.status === 'Approved').length)
const totalValue = computed(() => rows.value.reduce((sum, po) => sum + poTotal(po), 0))

const stats = computed(() => [
  { title: t('totalOrders'), value: String(rows.value.length), icon: ClipboardList },
  { title: t('pendingApproval'), value: String(pendingCount.value), icon: ClipboardCheck },
  { title: 'Approved', value: String(approvedCount.value), icon: FileClock },
  { title: t('totalSpendYtd'), value: formatMoney(totalValue.value), icon: DollarSign },
])

const columns = computed<DataTableColumn[]>(() => [
  { key: 'number', header: t('poNumber'), sortable: true },
  { key: 'supplier', header: t('poSupplier'), sortable: true },
  { key: 'items', header: t('itemsCount'), sortable: true },
  { key: 'total', header: t('poTotal'), align: 'right', sortable: true },
  { key: 'status', header: t('poStatus'), sortable: true },
  { key: 'date', header: t('poDate'), sortable: true },
  { key: 'actions', header: t('actions'), align: 'right' },
])

const lineItems = computed(() => {
  const po = detail.value
  if (!po) return []
  return po.items.map((item) => ({
    name: item.name,
    qty: item.qty,
    price: item.price,
    total: item.qty * item.price,
  }))
})

function statusVariant(status: string) {
  if (status === 'Approved' || status === 'Received') return 'default'
  if (status === 'Pending') return 'secondary'
  if (status === 'Cancelled') return 'destructive'
  return 'outline'
}

function refresh() {
  rows.value = procurementService.list()
}

function approvePo(po: PurchaseOrder) {
  procurementService.update(po.id, { status: 'Approved' })
  refresh()
  toast({ title: t('poApproved'), variant: 'success' })
  detail.value = null
}

function cancelPo(po: PurchaseOrder) {
  procurementService.update(po.id, { status: 'Cancelled' })
  refresh()
  toast({ title: t('poCancelled'), variant: 'success' })
  detail.value = null
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('procurement')"
      :description="t('procurementDescription')"
      :breadcrumbs="[{ title: t('dashboard'), href: '/dashboard' }, { title: t('procurement'), href: '/procurement' }]"
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

    <DataTable :columns="columns" :data="rows" :filter-placeholder="t('poNumber')">
      <template #cell="{ row, column }">
        <template v-if="column.key === 'number'">
          <span class="font-medium">{{ row.number }}</span>
        </template>
        <template v-else-if="column.key === 'items'">
          {{ row.items.length }}
        </template>
        <template v-else-if="column.key === 'total'">
          <span class="font-mono tabular-nums">{{ formatMoney(poTotal(row)) }}</span>
        </template>
        <template v-else-if="column.key === 'status'">
          <Badge :variant="statusVariant(String(row.status))">{{ row.status }}</Badge>
        </template>
        <template v-else-if="column.key === 'actions'">
          <div class="flex justify-end gap-1">
            <Button variant="ghost" size="icon" class="size-8" :aria-label="t('viewPo')" @click="detail = row">
              <Eye class="size-4" />
            </Button>
          </div>
        </template>
        <template v-else>{{ row[column.key] }}</template>
      </template>
    </DataTable>

    <Sheet :open="detail !== null" @update:open="(value) => !value && (detail = null)">
      <SheetContent class="sm:max-w-lg overflow-y-auto">
        <template v-if="detail">
          <SheetHeader>
            <SheetTitle>{{ detail.number }}</SheetTitle>
            <SheetDescription>{{ detail.supplier }}</SheetDescription>
          </SheetHeader>

          <div class="grid gap-4 px-4 pb-6 text-sm">
            <div class="grid gap-2">
              <div class="flex items-center justify-between gap-4 border-b py-1.5">
                <span class="text-muted-foreground">{{ t('poDate') }}</span>
                <span class="font-medium">{{ detail.date }}</span>
              </div>
              <div class="flex items-center justify-between gap-4 border-b py-1.5">
                <span class="text-muted-foreground">{{ t('expectedDelivery') }}</span>
                <span class="font-medium">{{ detail.expectedDelivery }}</span>
              </div>
              <div class="flex items-center justify-between gap-4 py-1.5">
                <span class="text-muted-foreground">{{ t('poStatus') }}</span>
                <Badge :variant="statusVariant(String(detail.status))">{{ detail.status }}</Badge>
              </div>
            </div>

            <div class="grid gap-2">
              <h3 class="text-sm font-semibold">{{ t('lineItems') }}</h3>
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-muted-foreground">
                    <th class="text-left font-medium">{{ t('lineItemName') }}</th>
                    <th class="text-right font-medium">{{ t('quantity') }}</th>
                    <th class="text-right font-medium">{{ t('unitPrice') }}</th>
                    <th class="text-right font-medium">{{ t('poTotal') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in lineItems" :key="item.name" class="border-t">
                    <td class="py-1.5">{{ item.name }}</td>
                    <td class="py-1.5 text-right tabular-nums">{{ item.qty }}</td>
                    <td class="py-1.5 text-right tabular-nums">{{ formatMoney(item.price) }}</td>
                    <td class="py-1.5 text-right tabular-nums">{{ formatMoney(item.total) }}</td>
                  </tr>
                  <tr class="border-t font-semibold">
                    <td colspan="3" class="py-1.5">{{ t('poTotal') }}</td>
                    <td class="py-1.5 text-right tabular-nums">{{ formatMoney(poTotal(detail)) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="mt-auto flex gap-2 px-4 pb-4">
            <Button v-if="detail.status === 'Pending'" class="flex-1" @click="approvePo(detail)">
              {{ t('approvePo') }}
            </Button>
            <Button
              v-if="detail.status === 'Draft' || detail.status === 'Pending'"
              variant="outline"
              class="flex-1 text-destructive hover:text-destructive"
              @click="cancelPo(detail)"
            >
              {{ t('cancelPo') }}
            </Button>
          </div>
        </template>
      </SheetContent>
    </Sheet>
  </div>
</template>
