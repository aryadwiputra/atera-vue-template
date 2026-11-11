<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, Trash2 } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/shared/PageHeader.vue'
import DataTable from '@/components/shared/DataTable.vue'
import type { DataTableColumn } from '@/components/shared/DataTable.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import RecordDialog from '@/components/shared/RecordDialog.vue'
import type { RecordField } from '@/components/shared/RecordDialog.vue'
import { productService } from '@/services/product-service'
import type { Product, ProductStatus } from '@/lib/data/types'
import { useTranslations } from '@/i18n'
import { useToast } from '@/composables/use-toast'

const t = useTranslations()
const { toast } = useToast()
const rows = ref<Product[]>(productService.list())
const pendingDelete = ref<Product | null>(null)
const createOpen = ref(false)

const createFields = computed<RecordField[]>(() => [
  { key: 'name', label: t('productName') },
  { key: 'category', label: t('category') },
  { key: 'price', label: t('price'), type: 'number' },
  { key: 'stock', label: t('stock'), type: 'number' },
  { key: 'status', label: t('status'), type: 'select', options: ['Active', 'Draft'] },
])

function createProduct(values: Record<string, string>) {
  productService.create({
    name: values.name,
    category: values.category,
    price: Number(values.price),
    stock: Number(values.stock),
    status: values.status as ProductStatus,
  })
  rows.value = productService.list()
  toast({ title: t('productCreated'), variant: 'success' })
}

const columns = computed<DataTableColumn[]>(() => [
  { key: 'name', header: t('productName'), sortable: true },
  { key: 'category', header: t('category'), sortable: true },
  { key: 'price', header: t('price'), align: 'right', sortable: true },
  { key: 'stock', header: t('stock'), align: 'right', sortable: true },
  { key: 'status', header: t('status'), sortable: true },
  { key: 'sales', header: t('sales'), align: 'right', sortable: true },
  { key: 'actions', header: t('actions'), align: 'right' },
])

function requestDelete(row: Record<string, unknown>) {
  pendingDelete.value = row as unknown as Product
}

function confirmDelete() {
  if (!pendingDelete.value) return
  productService.remove(pendingDelete.value.id)
  rows.value = productService.list()
  pendingDelete.value = null
  toast({ title: t('productDeleted'), variant: 'success' })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('products')"
      :description="t('productsDescription')"
      :breadcrumbs="[{ title: t('dashboard'), href: '/dashboard' }, { title: t('products'), href: '/products' }]"
    >
      <template #actions>
        <Button size="sm" @click="createOpen = true">
          <Plus class="size-4" />
          {{ t('newProduct') }}
        </Button>
      </template>
    </PageHeader>

    <DataTable :columns="columns" :data="rows" :filter-placeholder="t('filterProducts')">
      <template #cell="{ row, column }">
        <template v-if="column.key === 'status'">
          <Badge :variant="row.status === 'Active' ? 'default' : 'secondary'">
            {{ row.status === 'Active' ? t('active') : t('draft') }}
          </Badge>
        </template>
        <template v-else-if="column.key === 'price'">
          <span class="font-mono tabular-nums">${{ Number(row.price).toLocaleString('en-US') }}</span>
        </template>
        <template v-else-if="column.key === 'stock' || column.key === 'sales'">
          <span class="font-mono tabular-nums">{{ Number(row[column.key]).toLocaleString('en-US') }}</span>
        </template>
        <template v-else-if="column.key === 'actions'">
          <Button variant="ghost" size="icon" :aria-label="t('delete')" @click="requestDelete(row)">
            <Trash2 class="size-4" />
          </Button>
        </template>
        <template v-else>{{ row[column.key] }}</template>
      </template>
    </DataTable>

    <ConfirmDialog
      :open="pendingDelete !== null"
      :title="t('deleteProduct')"
      :description="t('deleteProductDescription')"
      :confirm-label="t('delete')"
      :cancel-label="t('cancel')"
      @update:open="(value) => !value && (pendingDelete = null)"
      @confirm="confirmDelete"
    />

    <RecordDialog
      v-model:open="createOpen"
      :title="t('newProduct')"
      :fields="createFields"
      :submit-label="t('create')"
      :cancel-label="t('cancel')"
      @submit="createProduct"
    />
  </div>
</template>
