<script setup lang="ts">
import { computed, ref } from 'vue'
import { Boxes, Cpu, Eye, PackageCheck, Pencil, Plus, Trash2, Wallet } from '@lucide/vue'
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import PageHeader from '@/components/shared/PageHeader.vue'
import DataTable from '@/components/shared/DataTable.vue'
import type { DataTableColumn } from '@/components/shared/DataTable.vue'
import StatCard from '@/components/shared/StatCard.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import RecordDialog from '@/components/shared/RecordDialog.vue'
import type { RecordField } from '@/components/shared/RecordDialog.vue'
import { assetService } from '@/services/asset-service'
import type { Asset, AssetStatus } from '@/lib/data/types'
import { useTranslations } from '@/i18n'
import { useToast } from '@/composables/use-toast'

const t = useTranslations()
const { toast } = useToast()

const assetStatuses: AssetStatus[] = ['In Use', 'Available', 'Maintenance', 'Retired']

const formatMoney = (value: number) => `$${value.toLocaleString('en-US')}`

const emptyForm = (): Omit<Asset, 'id'> => ({
  tag: '',
  name: '',
  category: '',
  assignedTo: '',
  location: '',
  purchaseDate: new Date().toISOString().slice(0, 10),
  warrantyEnd: new Date().toISOString().slice(0, 10),
  value: 0,
  status: 'Available',
})

const rows = ref<Asset[]>(assetService.list())
const detail = ref<Asset | null>(null)
const createOpen = ref(false)
const editOpen = ref(false)
const editing = ref<Asset | null>(null)
const editForm = ref<Omit<Asset, 'id'>>(emptyForm())
const pendingDelete = ref<Asset | null>(null)

const totalValue = computed(() =>
  rows.value.filter((item) => item.status !== 'Retired').reduce((sum, item) => sum + item.value, 0),
)

const inUseCount = computed(() => rows.value.filter((item) => item.status === 'In Use').length)
const availableCount = computed(() => rows.value.filter((item) => item.status === 'Available').length)

const stats = computed(() => [
  { title: t('totalAssets'), value: String(rows.value.length), icon: Boxes },
  { title: t('inUse'), value: String(inUseCount.value), icon: Cpu },
  { title: t('available'), value: String(availableCount.value), icon: PackageCheck },
  { title: t('totalAssetValue'), value: formatMoney(totalValue.value), icon: Wallet },
])

const createFields = computed<RecordField[]>(() => [
  { key: 'tag', label: t('assetTag') },
  { key: 'name', label: t('assetName') },
  { key: 'category', label: t('category') },
  { key: 'assignedTo', label: t('assignedTo') },
  { key: 'location', label: t('location') },
  { key: 'purchaseDate', label: t('purchaseDate'), type: 'date' },
  { key: 'warrantyEnd', label: t('warrantyEnd'), type: 'date' },
  { key: 'value', label: t('totalAssetValue'), type: 'number' },
  { key: 'status', label: t('status'), type: 'select', options: assetStatuses },
])

const columns = computed<DataTableColumn[]>(() => [
  { key: 'tag', header: t('assetTag'), sortable: true },
  { key: 'name', header: t('assetName'), sortable: true },
  { key: 'category', header: t('category'), sortable: true },
  { key: 'assignedTo', header: t('assignedTo'), sortable: true },
  { key: 'location', header: t('location'), sortable: true },
  { key: 'status', header: t('status'), sortable: true },
  { key: 'value', header: t('totalAssetValue'), align: 'right', sortable: true },
  { key: 'actions', header: t('actions'), align: 'right' },
])

const detailRows = computed<[string, string][]>(() => {
  const asset = detail.value
  if (!asset) return []
  return [
    [t('assetTag'), asset.tag],
    [t('assetName'), asset.name],
    [t('category'), asset.category],
    [t('assignedTo'), asset.assignedTo || '—'],
    [t('location'), asset.location],
    [t('purchaseDate'), asset.purchaseDate],
    [t('warrantyEnd'), asset.warrantyEnd],
    [t('totalAssetValue'), formatMoney(asset.value)],
    [t('status'), asset.status],
  ]
})

const history = computed(() => {
  const asset = detail.value
  if (!asset) return []
  return [
    { label: 'Created', date: asset.purchaseDate },
    { label: `Assigned to ${asset.assignedTo || 'stock'}`, date: asset.purchaseDate },
    { label: 'Last audit', date: '2026-09-15' },
  ]
})

function statusVariant(status: string) {
  if (status === 'In Use') return 'default'
  if (status === 'Available') return 'secondary'
  if (status === 'Maintenance') return 'outline'
  return 'destructive'
}

function createAsset(values: Record<string, string>) {
  assetService.create({
    tag: values.tag,
    name: values.name,
    category: values.category,
    assignedTo: values.assignedTo,
    location: values.location,
    purchaseDate: values.purchaseDate,
    warrantyEnd: values.warrantyEnd,
    value: Number(values.value),
    status: values.status as AssetStatus,
  })
  rows.value = assetService.list()
  toast({ title: t('assetSaved'), variant: 'success' })
}

function openEdit(asset: Asset) {
  editing.value = asset
  editForm.value = {
    tag: asset.tag,
    name: asset.name,
    category: asset.category,
    assignedTo: asset.assignedTo,
    location: asset.location,
    purchaseDate: asset.purchaseDate,
    warrantyEnd: asset.warrantyEnd,
    value: asset.value,
    status: asset.status,
  }
  editOpen.value = true
}

function submitEdit() {
  if (!editing.value) return
  assetService.update(editing.value.id, { ...editForm.value })
  rows.value = assetService.list()
  editOpen.value = false
  toast({ title: t('assetSaved'), variant: 'success' })
}

function requestDelete(row: Record<string, unknown>) {
  pendingDelete.value = row as unknown as Asset
}

function confirmDelete() {
  if (!pendingDelete.value) return
  assetService.remove(pendingDelete.value.id)
  rows.value = assetService.list()
  pendingDelete.value = null
  toast({ title: t('assetDeleted'), variant: 'success' })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('assets')"
      :description="t('assetsDescription')"
      :breadcrumbs="[{ title: t('dashboard'), href: '/dashboard' }, { title: t('assets'), href: '/assets' }]"
    >
      <template #actions>
        <Button size="sm" @click="createOpen = true">
          <Plus class="size-4" />
          {{ t('addAsset') }}
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

    <DataTable :columns="columns" :data="rows" :filter-placeholder="t('filterTransactions')">
      <template #cell="{ row, column }">
        <template v-if="column.key === 'tag'">
          <span class="font-medium">{{ row.tag }}</span>
        </template>
        <template v-else-if="column.key === 'assignedTo'">
          {{ row.assignedTo || '—' }}
        </template>
        <template v-else-if="column.key === 'status'">
          <Badge :variant="statusVariant(String(row.status))">{{ row.status }}</Badge>
        </template>
        <template v-else-if="column.key === 'value'">
          <span class="font-mono tabular-nums">{{ formatMoney(Number(row.value)) }}</span>
        </template>
        <template v-else-if="column.key === 'actions'">
          <div class="flex justify-end gap-1">
            <Button variant="ghost" size="icon" class="size-8" :aria-label="t('view')" @click="detail = row">
              <Eye class="size-4" />
            </Button>
            <Button variant="ghost" size="icon" class="size-8" :aria-label="t('edit')" @click="openEdit(row)">
              <Pencil class="size-4" />
            </Button>
            <Button variant="ghost" size="icon" class="size-8 text-destructive hover:text-destructive" :aria-label="t('delete')" @click="requestDelete(row)">
              <Trash2 class="size-4" />
            </Button>
          </div>
        </template>
        <template v-else>{{ row[column.key] }}</template>
      </template>
    </DataTable>

    <Sheet :open="detail !== null" @update:open="(value) => !value && (detail = null)">
      <SheetContent class="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{{ detail ? `${detail.tag} — ${detail.name}` : '' }}</SheetTitle>
        </SheetHeader>
        <div v-if="detail" class="grid gap-6 overflow-y-auto px-4 pb-6">
          <div class="grid gap-2 text-sm">
            <div
              v-for="[label, value] in detailRows"
              :key="label"
              class="flex items-center justify-between gap-4 border-b py-1.5 last:border-0"
            >
              <span class="text-muted-foreground">{{ label }}</span>
              <span class="text-right font-medium">{{ value }}</span>
            </div>
          </div>
          <div class="grid gap-2">
            <h3 class="text-sm font-semibold">{{ t('assetHistory') }}</h3>
            <div v-for="entry in history" :key="entry.label" class="flex items-center justify-between gap-4 text-sm">
              <span>{{ entry.label }}</span>
              <span class="text-xs text-muted-foreground">{{ entry.date }}</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>

    <ConfirmDialog
      :open="pendingDelete !== null"
      :title="t('deleteAsset')"
      :description="t('deleteAssetDescription')"
      :confirm-label="t('delete')"
      :cancel-label="t('cancel')"
      @update:open="(value) => !value && (pendingDelete = null)"
      @confirm="confirmDelete"
    />

    <RecordDialog
      v-model:open="createOpen"
      :title="t('addAsset')"
      :fields="createFields"
      :submit-label="t('create')"
      :cancel-label="t('cancel')"
      @submit="createAsset"
    />

    <Dialog v-model:open="editOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ t('editAsset') }}</DialogTitle>
        </DialogHeader>
        <form class="grid gap-4" @submit.prevent="submitEdit">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-2">
              <Label for="asset-tag" class="text-sm font-medium">{{ t('assetTag') }}</Label>
              <Input id="asset-tag" v-model="editForm.tag" required />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="asset-name" class="text-sm font-medium">{{ t('assetName') }}</Label>
              <Input id="asset-name" v-model="editForm.name" required />
            </div>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-2">
              <Label for="asset-category" class="text-sm font-medium">{{ t('category') }}</Label>
              <Input id="asset-category" v-model="editForm.category" />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="asset-location" class="text-sm font-medium">{{ t('location') }}</Label>
              <Input id="asset-location" v-model="editForm.location" />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <Label for="asset-assigned" class="text-sm font-medium">{{ t('assignedTo') }}</Label>
            <Input id="asset-assigned" v-model="editForm.assignedTo" />
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-2">
              <Label for="asset-purchase" class="text-sm font-medium">{{ t('purchaseDate') }}</Label>
              <Input id="asset-purchase" v-model="editForm.purchaseDate" type="date" required />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="asset-warranty" class="text-sm font-medium">{{ t('warrantyEnd') }}</Label>
              <Input id="asset-warranty" v-model="editForm.warrantyEnd" type="date" required />
            </div>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-2">
              <Label for="asset-value" class="text-sm font-medium">{{ t('totalAssetValue') }}</Label>
              <Input id="asset-value" v-model.number="editForm.value" type="number" min="0" required />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="asset-status" class="text-sm font-medium">{{ t('status') }}</Label>
              <Select v-model="editForm.status">
                <SelectTrigger id="asset-status" class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="status in assetStatuses" :key="status" :value="status">
                    {{ status }}
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
