<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, Pencil, Trash2, Users, ShoppingCart, Wallet } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/shared/PageHeader.vue'
import StatCard from '@/components/shared/StatCard.vue'
import DataTable from '@/components/shared/DataTable.vue'
import type { DataTableColumn } from '@/components/shared/DataTable.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import RecordDialog from '@/components/shared/RecordDialog.vue'
import type { RecordField } from '@/components/shared/RecordDialog.vue'
import { customerService } from '@/services/customer-service'
import type { Customer } from '@/lib/data/types'
import { useTranslations } from '@/i18n'
import { useToast } from '@/composables/use-toast'

const t = useTranslations()
const { toast } = useToast()
const rows = ref<Customer[]>(customerService.list())
const pendingDelete = ref<Customer | null>(null)
const createOpen = ref(false)
const editOpen = ref(false)
const editing = ref<Customer | null>(null)

const totalCustomers = computed(() => rows.value.length)
const totalOrders = computed(() => rows.value.reduce((sum, row) => sum + row.orders, 0))
const totalSpent = computed(() => rows.value.reduce((sum, row) => sum + row.spent, 0))

const fields = computed<RecordField[]>(() => [
  { key: 'name', label: t('name') },
  { key: 'email', label: t('email'), type: 'email' },
  { key: 'company', label: t('company') },
])

function createCustomer(values: Record<string, string>) {
  customerService.create({
    name: values.name,
    email: values.email,
    company: values.company,
    orders: 0,
    spent: 0,
    joined: new Date().toISOString().slice(0, 10),
  })
  rows.value = customerService.list()
  toast({ title: t('customerCreated'), variant: 'success' })
}

const editInitial = computed<Record<string, string>>(() =>
  editing.value
    ? {
        name: editing.value.name,
        email: editing.value.email,
        company: editing.value.company,
      }
    : ({} as Record<string, string>),
)

function requestEdit(row: Record<string, unknown>) {
  editing.value = row as unknown as Customer
  editOpen.value = true
}

function updateCustomer(values: Record<string, string>) {
  if (!editing.value) return
  customerService.update(editing.value.id, {
    name: values.name,
    email: values.email,
    company: values.company,
  })
  rows.value = customerService.list()
  editing.value = null
  toast({ title: t('customerUpdated'), variant: 'success' })
}

const columns = computed<DataTableColumn[]>(() => [
  { key: 'name', header: t('customer'), sortable: true },
  { key: 'company', header: t('company'), sortable: true },
  { key: 'orders', header: t('orders'), align: 'right', sortable: true },
  { key: 'spent', header: t('totalSpent'), align: 'right', sortable: true },
  { key: 'joined', header: t('joined'), sortable: true },
  { key: 'actions', header: t('actions'), align: 'right' },
])

function requestDelete(row: Record<string, unknown>) {
  pendingDelete.value = row as unknown as Customer
}

function confirmDelete() {
  if (!pendingDelete.value) return
  customerService.remove(pendingDelete.value.id)
  rows.value = customerService.list()
  pendingDelete.value = null
  toast({ title: t('customerDeleted'), variant: 'success' })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('customers')"
      :description="t('customersDescription')"
      :breadcrumbs="[{ title: t('dashboard'), href: '/dashboard' }, { title: t('customers'), href: '/customers' }]"
    >
      <template #actions>
        <Button size="sm" @click="createOpen = true">
          <Plus class="size-4" />
          {{ t('newCustomer') }}
        </Button>
      </template>
    </PageHeader>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard :title="t('totalCustomers')" :value="totalCustomers" :icon="Users" />
      <StatCard :title="t('totalOrders')" :value="totalOrders" :icon="ShoppingCart" />
      <StatCard :title="t('totalSpent')" :value="`$${totalSpent.toLocaleString('en-US')}`" :icon="Wallet" />
    </div>

    <DataTable :columns="columns" :data="rows" :filter-placeholder="t('filterCustomers')">
      <template #cell="{ row, column }">
        <template v-if="column.key === 'name'">
          <div class="flex flex-col">
            <span class="font-medium">{{ row.name }}</span>
            <span class="text-xs text-muted-foreground">{{ row.email }}</span>
          </div>
        </template>
        <template v-else-if="column.key === 'orders'">
          <span class="tabular-nums">{{ Number(row.orders).toLocaleString('en-US') }}</span>
        </template>
        <template v-else-if="column.key === 'spent'">
          <span class="font-mono tabular-nums">${{ Number(row.spent).toLocaleString('en-US') }}</span>
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
      :title="t('deleteCustomer')"
      :description="t('deleteCustomerDescription')"
      :confirm-label="t('delete')"
      :cancel-label="t('cancel')"
      @update:open="(value) => !value && (pendingDelete = null)"
      @confirm="confirmDelete"
    />

    <RecordDialog
      v-model:open="createOpen"
      :title="t('newCustomer')"
      :fields="fields"
      :submit-label="t('create')"
      :cancel-label="t('cancel')"
      @submit="createCustomer"
    />

    <RecordDialog
      v-model:open="editOpen"
      :title="t('editCustomer')"
      :fields="fields"
      :initial="editInitial"
      :submit-label="t('save')"
      :cancel-label="t('cancel')"
      @submit="updateCustomer"
    />
  </div>
</template>
