<script setup lang="ts">
import { computed, ref } from 'vue'
import { CircleCheck, CirclePause, Pencil, Plus, Star, Truck } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import PageHeader from '@/components/shared/PageHeader.vue'
import DataTable from '@/components/shared/DataTable.vue'
import type { DataTableColumn } from '@/components/shared/DataTable.vue'
import StatCard from '@/components/shared/StatCard.vue'
import RecordDialog from '@/components/shared/RecordDialog.vue'
import type { RecordField } from '@/components/shared/RecordDialog.vue'
import { supplierService } from '@/services/supplier-service'
import type { Supplier, SupplierStatus } from '@/lib/data/types'
import { useTranslations } from '@/i18n'
import { useToast } from '@/composables/use-toast'

const t = useTranslations()
const { toast } = useToast()

const supplierStatuses: SupplierStatus[] = ['Active', 'On Hold']

const emptyForm = (): Omit<Supplier, 'id'> => ({
  name: '',
  contact: '',
  email: '',
  phone: '',
  country: '',
  rating: 4,
  onTimeRate: 90,
  status: 'Active',
})

const rows = ref<Supplier[]>(supplierService.list())
const createOpen = ref(false)
const editOpen = ref(false)
const editing = ref<Supplier | null>(null)
const editForm = ref<Omit<Supplier, 'id'>>(emptyForm())

const activeCount = computed(() => rows.value.filter((item) => item.status === 'Active').length)
const onHoldCount = computed(() => rows.value.filter((item) => item.status === 'On Hold').length)
const averageRating = computed(() => {
  if (rows.value.length === 0) return '0.0'
  const total = rows.value.reduce((sum, item) => sum + item.rating, 0)
  return (total / rows.value.length).toFixed(1)
})

const stats = computed(() => [
  { title: t('suppliers'), value: String(rows.value.length), icon: Truck },
  { title: t('active'), value: String(activeCount.value), icon: CircleCheck },
  { title: t('onHold'), value: String(onHoldCount.value), icon: CirclePause },
  { title: t('rating'), value: averageRating.value, icon: Star },
])

const createFields = computed<RecordField[]>(() => [
  { key: 'name', label: t('supplierName') },
  { key: 'contact', label: t('contactPerson') },
  { key: 'email', label: t('email'), type: 'email' },
  { key: 'phone', label: t('phone') },
  { key: 'country', label: t('country') },
  { key: 'rating', label: t('rating'), type: 'number' },
  { key: 'onTimeRate', label: t('onTimeRate'), type: 'number' },
  { key: 'status', label: t('status'), type: 'select', options: supplierStatuses },
])

const columns = computed<DataTableColumn[]>(() => [
  { key: 'id', header: 'ID', sortable: true },
  { key: 'name', header: t('supplierName'), sortable: true },
  { key: 'contact', header: t('contactPerson'), sortable: true },
  { key: 'email', header: t('email'), sortable: true },
  { key: 'phone', header: t('phone'), sortable: true },
  { key: 'country', header: t('country'), sortable: true },
  { key: 'rating', header: t('rating'), sortable: true },
  { key: 'onTimeRate', header: t('onTimeRate'), align: 'right', sortable: true },
  { key: 'status', header: t('status'), sortable: true },
  { key: 'actions', header: t('actions'), align: 'right' },
])

function statusVariant(status: SupplierStatus) {
  return status === 'Active' ? 'default' : 'secondary'
}

function createSupplier(values: Record<string, string>) {
  supplierService.create({
    name: values.name,
    contact: values.contact,
    email: values.email,
    phone: values.phone,
    country: values.country,
    rating: Number(values.rating),
    onTimeRate: Number(values.onTimeRate),
    status: values.status as SupplierStatus,
  })
  rows.value = supplierService.list()
  toast({ title: t('supplierSaved'), variant: 'success' })
}

function openEdit(supplier: Supplier) {
  editing.value = supplier
  editForm.value = {
    name: supplier.name,
    contact: supplier.contact,
    email: supplier.email,
    phone: supplier.phone,
    country: supplier.country,
    rating: supplier.rating,
    onTimeRate: supplier.onTimeRate,
    status: supplier.status,
  }
  editOpen.value = true
}

function submitEdit() {
  if (!editing.value) return
  supplierService.update(editing.value.id, { ...editForm.value })
  rows.value = supplierService.list()
  editOpen.value = false
  toast({ title: t('supplierSaved'), variant: 'success' })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('suppliers')"
      :description="t('suppliersDescription')"
      :breadcrumbs="[{ title: t('dashboard'), href: '/dashboard' }, { title: t('suppliers'), href: '/suppliers' }]"
    >
      <template #actions>
        <Button size="sm" @click="createOpen = true">
          <Plus class="size-4" />
          {{ t('addSupplier') }}
        </Button>
      </template>
    </PageHeader>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        v-for="card in stats"
        :key="card.title"
        :title="card.title"
        :value="card.value"
        :icon="card.icon"
      />
    </div>

    <DataTable :columns="columns" :data="rows" :filter-placeholder="t('supplierName')">
      <template #cell="{ row, column }">
        <template v-if="column.key === 'id'">
          <span class="font-mono text-xs">{{ row.id }}</span>
        </template>
        <template v-else-if="column.key === 'name'">
          <span class="font-medium">{{ row.name }}</span>
        </template>
        <template v-else-if="column.key === 'rating'">
          <div class="flex items-center gap-1.5">
            <Star class="size-3.5 fill-status-warning text-status-warning" />
            <span class="tabular-nums">{{ Number(row.rating).toFixed(1) }}</span>
          </div>
        </template>
        <template v-else-if="column.key === 'onTimeRate'">
          <span class="tabular-nums">{{ row.onTimeRate }}%</span>
        </template>
        <template v-else-if="column.key === 'status'">
          <Badge :variant="statusVariant(row.status)">
            {{ row.status === 'On Hold' ? t('onHold') : t('active') }}
          </Badge>
        </template>
        <template v-else-if="column.key === 'actions'">
          <div class="flex justify-end gap-1">
            <Button variant="ghost" size="icon" class="size-8" :aria-label="t('edit')" @click="openEdit(row)">
              <Pencil class="size-4" />
            </Button>
          </div>
        </template>
        <template v-else>{{ row[column.key] }}</template>
      </template>
    </DataTable>

    <RecordDialog
      v-model:open="createOpen"
      :title="t('addSupplier')"
      :fields="createFields"
      :submit-label="t('create')"
      :cancel-label="t('cancel')"
      @submit="createSupplier"
    />

    <Dialog v-model:open="editOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ t('editSupplier') }}</DialogTitle>
        </DialogHeader>
        <form class="grid gap-4" @submit.prevent="submitEdit">
          <div class="flex flex-col gap-2">
            <Label for="supplier-name" class="text-sm font-medium">{{ t('supplierName') }}</Label>
            <Input id="supplier-name" v-model="editForm.name" required />
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-2">
              <Label for="supplier-contact" class="text-sm font-medium">{{ t('contactPerson') }}</Label>
              <Input id="supplier-contact" v-model="editForm.contact" required />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="supplier-email" class="text-sm font-medium">{{ t('email') }}</Label>
              <Input id="supplier-email" v-model="editForm.email" type="email" required />
            </div>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-2">
              <Label for="supplier-phone" class="text-sm font-medium">{{ t('phone') }}</Label>
              <Input id="supplier-phone" v-model="editForm.phone" required />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="supplier-country" class="text-sm font-medium">{{ t('country') }}</Label>
              <Input id="supplier-country" v-model="editForm.country" required />
            </div>
          </div>
          <div class="grid gap-4 sm:grid-cols-3">
            <div class="flex flex-col gap-2">
              <Label for="supplier-rating" class="text-sm font-medium">{{ t('rating') }}</Label>
              <Input id="supplier-rating" v-model.number="editForm.rating" type="number" min="0" max="5" step="0.1" required />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="supplier-otd" class="text-sm font-medium">{{ t('onTimeRate') }}</Label>
              <Input id="supplier-otd" v-model.number="editForm.onTimeRate" type="number" min="0" max="100" required />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="supplier-status" class="text-sm font-medium">{{ t('status') }}</Label>
              <Select v-model="editForm.status">
                <SelectTrigger id="supplier-status" class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="status in supplierStatuses" :key="status" :value="status">
                    {{ status === 'On Hold' ? t('onHold') : t('active') }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter class="mt-2">
            <Button type="button" variant="outline" @click="editOpen = false">{{ t('cancel') }}</Button>
            <Button type="submit">{{ t('saveChanges') }}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
