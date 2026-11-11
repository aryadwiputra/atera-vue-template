<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, Pencil, Trash2, FileText, CircleCheck, Wallet } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/shared/PageHeader.vue'
import StatCard from '@/components/shared/StatCard.vue'
import DataTable from '@/components/shared/DataTable.vue'
import type { DataTableColumn } from '@/components/shared/DataTable.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import RecordDialog from '@/components/shared/RecordDialog.vue'
import type { RecordField } from '@/components/shared/RecordDialog.vue'
import { invoiceService } from '@/services/invoice-service'
import type { Invoice, InvoiceStatus } from '@/lib/data/types'
import { useTranslations } from '@/i18n'
import { useToast } from '@/composables/use-toast'

const t = useTranslations()
const { toast } = useToast()
const rows = ref<Invoice[]>(invoiceService.list())
const pendingDelete = ref<Invoice | null>(null)
const createOpen = ref(false)
const editOpen = ref(false)
const editing = ref<Invoice | null>(null)

const totalInvoiced = computed(() => rows.value.reduce((sum, row) => sum + row.amount, 0))
const totalPaid = computed(() =>
  rows.value.filter((row) => row.status === 'Paid').reduce((sum, row) => sum + row.amount, 0),
)
const totalOutstanding = computed(() =>
  rows.value.filter((row) => row.status !== 'Paid').reduce((sum, row) => sum + row.amount, 0),
)

const fields = computed<RecordField[]>(() => [
  { key: 'customer', label: t('customer') },
  { key: 'date', label: t('date'), type: 'date' },
  { key: 'dueDate', label: t('dueDate'), type: 'date' },
  { key: 'amount', label: t('amount'), type: 'number' },
  { key: 'status', label: t('status'), type: 'select', options: ['Paid', 'Pending', 'Overdue'] },
])

function createInvoice(values: Record<string, string>) {
  invoiceService.create({
    customer: values.customer,
    date: values.date,
    dueDate: values.dueDate,
    amount: Number(values.amount),
    status: values.status as InvoiceStatus,
  })
  rows.value = invoiceService.list()
  toast({ title: t('invoiceCreated'), variant: 'success' })
}

const editInitial = computed<Record<string, string>>(() =>
  editing.value
    ? {
        customer: editing.value.customer,
        date: editing.value.date,
        dueDate: editing.value.dueDate,
        amount: String(editing.value.amount),
        status: editing.value.status,
      }
    : ({} as Record<string, string>),
)

function requestEdit(row: Record<string, unknown>) {
  editing.value = row as unknown as Invoice
  editOpen.value = true
}

function updateInvoice(values: Record<string, string>) {
  if (!editing.value) return
  invoiceService.update(editing.value.id, {
    customer: values.customer,
    date: values.date,
    dueDate: values.dueDate,
    amount: Number(values.amount),
    status: values.status as InvoiceStatus,
  })
  rows.value = invoiceService.list()
  editing.value = null
  toast({ title: t('invoiceUpdated'), variant: 'success' })
}

const columns = computed<DataTableColumn[]>(() => [
  { key: 'id', header: t('invoice'), sortable: true },
  { key: 'customer', header: t('customer'), sortable: true },
  { key: 'date', header: t('issued'), sortable: true },
  { key: 'dueDate', header: t('due'), sortable: true },
  { key: 'amount', header: t('amount'), align: 'right', sortable: true },
  { key: 'status', header: t('status'), sortable: true },
  { key: 'actions', header: t('actions'), align: 'right' },
])

function statusVariant(status: string) {
  return status === 'Paid' ? 'default' : status === 'Overdue' ? 'destructive' : 'secondary'
}

function requestDelete(row: Record<string, unknown>) {
  pendingDelete.value = row as unknown as Invoice
}

function confirmDelete() {
  if (!pendingDelete.value) return
  invoiceService.remove(pendingDelete.value.id)
  rows.value = invoiceService.list()
  pendingDelete.value = null
  toast({ title: t('invoiceDeleted'), variant: 'success' })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('invoices')"
      :description="t('reviewInvoicesDescription')"
      :breadcrumbs="[{ title: t('dashboard'), href: '/dashboard' }, { title: t('invoices'), href: '/invoices' }]"
    >
      <template #actions>
        <Button size="sm" @click="createOpen = true">
          <Plus class="size-4" />
          {{ t('newInvoice') }}
        </Button>
      </template>
    </PageHeader>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard :title="t('totalInvoiced')" :value="`$${totalInvoiced.toLocaleString('en-US')}`" :icon="FileText" />
      <StatCard :title="t('paid')" :value="`$${totalPaid.toLocaleString('en-US')}`" :icon="CircleCheck" />
      <StatCard :title="t('outstanding')" :value="`$${totalOutstanding.toLocaleString('en-US')}`" :icon="Wallet" />
    </div>

    <DataTable :columns="columns" :data="rows" :filter-placeholder="t('filterInvoices')">
      <template #cell="{ row, column }">
        <template v-if="column.key === 'id'">
          <span class="font-mono text-xs">{{ row.id }}</span>
        </template>
        <template v-else-if="column.key === 'status'">
          <Badge :variant="statusVariant(String(row.status))">{{ row.status }}</Badge>
        </template>
        <template v-else-if="column.key === 'amount'">
          <span class="font-mono tabular-nums">${{ Number(row.amount).toLocaleString('en-US') }}</span>
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
      :title="t('deleteInvoice')"
      :description="t('deleteInvoiceDescription')"
      :confirm-label="t('delete')"
      :cancel-label="t('cancel')"
      @update:open="(value) => !value && (pendingDelete = null)"
      @confirm="confirmDelete"
    />

    <RecordDialog
      v-model:open="createOpen"
      :title="t('newInvoice')"
      :description="t('createInvoiceDescription')"
      :fields="fields"
      :submit-label="t('create')"
      :cancel-label="t('cancel')"
      @submit="createInvoice"
    />

    <RecordDialog
      v-model:open="editOpen"
      :title="t('editInvoice')"
      :fields="fields"
      :initial="editInitial"
      :submit-label="t('save')"
      :cancel-label="t('cancel')"
      @submit="updateInvoice"
    />
  </div>
</template>
