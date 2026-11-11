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
import { userService } from '@/services/user-service'
import type { User, UserRole, UserStatus } from '@/lib/data/types'
import { useTranslations } from '@/i18n'
import { useToast } from '@/composables/use-toast'

const t = useTranslations()
const { toast } = useToast()
const rows = ref<User[]>(userService.list())
const pendingDelete = ref<User | null>(null)
const createOpen = ref(false)

const createFields = computed<RecordField[]>(() => [
  { key: 'name', label: t('name') },
  { key: 'email', label: t('email'), type: 'email' },
  { key: 'role', label: t('role'), type: 'select', options: ['Admin', 'Editor', 'Moderator', 'Viewer'] },
  { key: 'department', label: t('department') },
  { key: 'status', label: t('status'), type: 'select', options: ['Active', 'Inactive', 'Suspended'] },
])

function createUser(values: Record<string, string>) {
  userService.create({
    name: values.name,
    email: values.email,
    role: values.role as UserRole,
    department: values.department,
    status: values.status as UserStatus,
  })
  rows.value = userService.list()
  toast({ title: t('userCreated'), variant: 'success' })
}

const columns = computed<DataTableColumn[]>(() => [
  { key: 'name', header: t('name'), sortable: true },
  { key: 'email', header: t('email'), sortable: true },
  { key: 'role', header: t('role'), sortable: true },
  { key: 'department', header: t('department'), sortable: true },
  { key: 'status', header: t('status'), sortable: true },
  { key: 'lastActive', header: t('lastActive'), sortable: true },
  { key: 'actions', header: t('actions'), align: 'right' },
])

function statusVariant(status: string) {
  return status === 'Active' ? 'default' : status === 'Suspended' ? 'destructive' : 'secondary'
}

function requestDelete(row: Record<string, unknown>) {
  pendingDelete.value = row as unknown as User
}

function confirmDelete() {
  if (!pendingDelete.value) return
  userService.remove(pendingDelete.value.id)
  rows.value = userService.list()
  pendingDelete.value = null
  toast({ title: t('userDeleted'), variant: 'success' })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('users')"
      :description="t('usersDescription')"
      :breadcrumbs="[{ title: t('dashboard'), href: '/dashboard' }, { title: t('users'), href: '/users' }]"
    >
      <template #actions>
        <Button size="sm" @click="createOpen = true">
          <Plus class="size-4" />
          {{ t('newUser') }}
        </Button>
      </template>
    </PageHeader>

    <DataTable :columns="columns" :data="rows" :filter-placeholder="t('filterUsers')">
      <template #cell="{ row, column }">
        <template v-if="column.key === 'status'">
          <Badge :variant="statusVariant(String(row.status))">{{ row.status }}</Badge>
        </template>
        <template v-else-if="column.key === 'email'">
          <span class="text-muted-foreground">{{ row.email }}</span>
        </template>
        <template v-else-if="column.key === 'lastActive'">
          <span class="text-muted-foreground">{{ row.lastActive }}</span>
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
      :title="t('deleteUser')"
      :description="t('deleteUserDescription')"
      :confirm-label="t('delete')"
      :cancel-label="t('cancel')"
      @update:open="(value) => !value && (pendingDelete = null)"
      @confirm="confirmDelete"
    />

    <RecordDialog
      v-model:open="createOpen"
      :title="t('newUser')"
      :fields="createFields"
      :submit-label="t('create')"
      :cancel-label="t('cancel')"
      @submit="createUser"
    />
  </div>
</template>
