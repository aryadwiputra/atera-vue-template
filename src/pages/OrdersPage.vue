<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, Pencil, Trash2 } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/shared/PageHeader.vue'
import DataTable from '@/components/shared/DataTable.vue'
import type { DataTableColumn } from '@/components/shared/DataTable.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import RecordDialog from '@/components/shared/RecordDialog.vue'
import type { RecordField } from '@/components/shared/RecordDialog.vue'
import { orderService } from '@/services/order-service'
import type { Order, OrderStatus } from '@/lib/data/types'
import { useTranslations } from '@/i18n'
import { useToast } from '@/composables/use-toast'

const t = useTranslations()
const { toast } = useToast()
const rows = ref<Order[]>(orderService.list())
const pendingDelete = ref<Order | null>(null)
const createOpen = ref(false)
const editOpen = ref(false)
const editing = ref<Order | null>(null)

const fields = computed<RecordField[]>(() => [
  { key: 'customer', label: t('customer') },
  { key: 'customerEmail', label: t('customerEmail'), type: 'email' },
  { key: 'product', label: t('product') },
  { key: 'status', label: t('status'), type: 'select', options: ['Paid', 'Pending', 'Refunded'] },
  { key: 'amount', label: t('amount'), type: 'number' },
  { key: 'date', label: t('date'), type: 'date' },
])

function createOrder(values: Record<string, string>) {
  orderService.create({
    customer: values.customer,
    customerEmail: values.customerEmail,
    product: values.product,
    status: values.status as OrderStatus,
    amount: Number(values.amount),
    date: values.date,
  })
  rows.value = orderService.list()
  toast({ title: t('orderCreated'), variant: 'success' })
}

const editInitial = computed<Record<string, string>>(() =>
  editing.value
    ? {
        customer: editing.value.customer,
        customerEmail: editing.value.customerEmail,
        product: editing.value.product,
        status: editing.value.status,
        amount: String(editing.value.amount),
        date: editing.value.date,
      }
    : ({} as Record<string, string>),
)

function requestEdit(row: Record<string, unknown>) {
  editing.value = row as unknown as Order
  editOpen.value = true
}

function updateOrder(values: Record<string, string>) {
  if (!editing.value) return
  orderService.update(editing.value.id, {
    customer: values.customer,
    customerEmail: values.customerEmail,
    product: values.product,
    status: values.status as OrderStatus,
    amount: Number(values.amount),
    date: values.date,
  })
  rows.value = orderService.list()
  editing.value = null
  toast({ title: t('orderUpdated'), variant: 'success' })
}

const columns = computed<DataTableColumn[]>(() => [
  { key: 'id', header: t('orderId'), sortable: true },
  { key: 'customer', header: t('customer'), sortable: true },
  { key: 'product', header: t('product'), sortable: true },
  { key: 'status', header: t('status'), sortable: true },
  { key: 'amount', header: t('amount'), align: 'right', sortable: true },
  { key: 'actions', header: t('actions'), align: 'right' },
])

function statusVariant(status: string) {
  return status === 'Paid' ? 'default' : status === 'Refunded' ? 'destructive' : 'secondary'
}

function requestDelete(row: Record<string, unknown>) {
  pendingDelete.value = row as unknown as Order
}

function confirmDelete() {
  if (!pendingDelete.value) return
  orderService.remove(pendingDelete.value.id)
  rows.value = orderService.list()
  pendingDelete.value = null
  toast({ title: t('orderDeleted'), variant: 'success' })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('orders')"
      :description="t('ordersDescription')"
      :breadcrumbs="[{ title: t('dashboard'), href: '/dashboard' }, { title: t('orders'), href: '/orders' }]"
    >
      <template #actions>
        <Button size="sm" @click="createOpen = true">
          <Plus class="size-4" />
          {{ t('newOrder') }}
        </Button>
      </template>
    </PageHeader>

    <DataTable :columns="columns" :data="rows" :filter-placeholder="t('filterOrders')">
      <template #cell="{ row, column }">
        <template v-if="column.key === 'status'">
          <Badge :variant="statusVariant(String(row.status))">{{ row.status }}</Badge>
        </template>
        <template v-else-if="column.key === 'amount'">
          <span class="font-mono tabular-nums">${{ Number(row.amount).toLocaleString('en-US') }}</span>
        </template>
        <template v-else-if="column.key === 'id'">
          <span class="font-mono text-xs">{{ row.id }}</span>
        </template>
        <template v-else-if="column.key === 'actions'">
          <div class="flex justify-end gap-1">
            <Button variant="ghost" size="icon" :aria-label="t('edit')" @click="requestEdit(row)">
              <Pencil class="size-4" />
            </Button>
            <Button variant="ghost" size="icon" :aria-label="t('delete')" @click="requestDelete(row)">
              <Trash2 class="size-4" />
            </Button>
          </div>
        </template>
        <template v-else>{{ row[column.key] }}</template>
      </template>
    </DataTable>

    <ConfirmDialog
      :open="pendingDelete !== null"
      :title="t('deleteOrder')"
      :description="t('deleteOrderDescription')"
      :confirm-label="t('delete')"
      :cancel-label="t('cancel')"
      @update:open="(value) => !value && (pendingDelete = null)"
      @confirm="confirmDelete"
    />

    <RecordDialog
      v-model:open="createOpen"
      :title="t('newOrder')"
      :fields="fields"
      :submit-label="t('create')"
      :cancel-label="t('cancel')"
      @submit="createOrder"
    />

    <RecordDialog
      v-model:open="editOpen"
      :title="t('editOrder')"
      :fields="fields"
      :initial="editInitial"
      :submit-label="t('save')"
      :cancel-label="t('cancel')"
      @submit="updateOrder"
    />
  </div>
</template>
