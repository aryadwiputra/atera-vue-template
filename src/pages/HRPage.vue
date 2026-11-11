<script setup lang="ts">
import { computed, ref } from 'vue'
import { Briefcase, CalendarClock, Pencil, Plus, UserCheck, Users } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import PageHeader from '@/components/shared/PageHeader.vue'
import DataTable from '@/components/shared/DataTable.vue'
import type { DataTableColumn } from '@/components/shared/DataTable.vue'
import StatCard from '@/components/shared/StatCard.vue'
import RecordDialog from '@/components/shared/RecordDialog.vue'
import type { RecordField } from '@/components/shared/RecordDialog.vue'
import { hrService } from '@/services/hr-service'
import type { Employee, EmployeeStatus } from '@/lib/data/types'
import { useTranslations } from '@/i18n'
import { useToast } from '@/composables/use-toast'

const t = useTranslations()
const { toast } = useToast()

const employeeStatuses: EmployeeStatus[] = ['Active', 'On Leave', 'Remote', 'Offboarded']

const statusBadge: Record<EmployeeStatus, string> = {
  Active: 'bg-status-success/15 text-status-success',
  'On Leave': 'bg-status-warning/15 text-status-warning',
  Remote: 'bg-chart-1/15 text-chart-1',
  Offboarded: 'bg-muted text-muted-foreground',
}

const emptyForm = (): Omit<Employee, 'id'> => ({
  name: '',
  position: '',
  department: '',
  email: '',
  startDate: new Date().toISOString().slice(0, 10),
  status: 'Active',
})

const rows = ref<Employee[]>(hrService.listEmployees())
const openPositions = hrService.listOpenPositions()
const createOpen = ref(false)
const editOpen = ref(false)
const editing = ref<Employee | null>(null)
const editForm = ref<Omit<Employee, 'id'>>(emptyForm())

const activeCount = computed(() => rows.value.filter((item) => item.status === 'Active').length)
const onLeaveCount = computed(() => rows.value.filter((item) => item.status === 'On Leave').length)

const stats = computed(() => [
  { title: t('headcount'), value: String(rows.value.length), icon: Users },
  { title: t('active'), value: String(activeCount.value), icon: UserCheck },
  { title: t('onLeaveToday'), value: String(onLeaveCount.value), icon: CalendarClock },
  { title: t('openPositionsCount'), value: String(openPositions.length), icon: Briefcase },
])

const createFields = computed<RecordField[]>(() => [
  { key: 'name', label: t('employeeName') },
  { key: 'position', label: t('positionLabel') },
  { key: 'department', label: t('department') },
  { key: 'email', label: t('email'), type: 'email' },
  { key: 'startDate', label: t('startDate'), type: 'date' },
  { key: 'status', label: t('status'), type: 'select', options: employeeStatuses },
])

const columns = computed<DataTableColumn[]>(() => [
  { key: 'id', header: 'ID', sortable: true },
  { key: 'name', header: t('employeeName'), sortable: true },
  { key: 'position', header: t('positionLabel'), sortable: true },
  { key: 'department', header: t('department'), sortable: true },
  { key: 'email', header: t('email'), sortable: true },
  { key: 'status', header: t('employeeStatus'), sortable: true },
  { key: 'startDate', header: t('startDate'), sortable: true },
  { key: 'actions', header: t('actions'), align: 'right' },
])

function createEmployee(values: Record<string, string>) {
  hrService.createEmployee({
    name: values.name,
    position: values.position,
    department: values.department,
    email: values.email,
    startDate: values.startDate,
    status: values.status as EmployeeStatus,
  })
  rows.value = hrService.listEmployees()
  toast({ title: t('employeeSaved'), description: values.name, variant: 'success' })
}

function openEdit(employee: Employee) {
  editing.value = employee
  editForm.value = {
    name: employee.name,
    position: employee.position,
    department: employee.department,
    email: employee.email,
    startDate: employee.startDate,
    status: employee.status,
  }
  editOpen.value = true
}

function submitEdit() {
  if (!editing.value) return
  hrService.updateEmployee(editing.value.id, { ...editForm.value })
  rows.value = hrService.listEmployees()
  editOpen.value = false
  toast({ title: t('employeeSaved'), description: editForm.value.name, variant: 'success' })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('hr')"
      :description="t('hrDescription')"
      :breadcrumbs="[{ title: t('enterprise'), href: '/hr' }, { title: t('hr'), href: '/hr' }]"
    >
      <template #actions>
        <Button size="sm" @click="createOpen = true">
          <Plus class="size-4" />
          {{ t('addEmployee') }}
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

    <DataTable :columns="columns" :data="rows" :filter-placeholder="t('search')">
      <template #cell="{ row, column }">
        <template v-if="column.key === 'id'">
          <span class="font-mono text-xs">{{ row.id }}</span>
        </template>
        <template v-else-if="column.key === 'name'">
          <span class="font-medium">{{ row.name }}</span>
        </template>
        <template v-else-if="column.key === 'status'">
          <Badge :class="['border-transparent', statusBadge[row.status as EmployeeStatus]]">
            {{ row.status }}
          </Badge>
        </template>
        <template v-else-if="column.key === 'startDate'">
          <span class="tabular-nums">{{ row.startDate }}</span>
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

    <Card>
      <CardHeader>
        <CardTitle>{{ t('openPositions') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{{ t('positionLabel') }}</TableHead>
              <TableHead>{{ t('department') }}</TableHead>
              <TableHead class="text-right">{{ t('applicants') }}</TableHead>
              <TableHead class="text-right">{{ t('postedAt') }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="position in openPositions" :key="position.id">
              <TableCell class="font-medium">{{ position.title }}</TableCell>
              <TableCell>{{ position.department }}</TableCell>
              <TableCell class="text-right tabular-nums">{{ position.applicants }}</TableCell>
              <TableCell class="text-right tabular-nums">{{ position.postedAt }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <RecordDialog
      v-model:open="createOpen"
      :title="t('addEmployee')"
      :description="t('hrDescription')"
      :fields="createFields"
      :submit-label="t('addEmployee')"
      :cancel-label="t('cancel')"
      @submit="createEmployee"
    />

    <Dialog v-model:open="editOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ t('edit') }}</DialogTitle>
        </DialogHeader>
        <form class="grid gap-4" @submit.prevent="submitEdit">
          <div class="flex flex-col gap-2">
            <Label for="employee-name" class="text-sm font-medium">{{ t('employeeName') }}</Label>
            <Input id="employee-name" v-model="editForm.name" required />
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-2">
              <Label for="employee-position" class="text-sm font-medium">{{ t('positionLabel') }}</Label>
              <Input id="employee-position" v-model="editForm.position" required />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="employee-department" class="text-sm font-medium">{{ t('department') }}</Label>
              <Input id="employee-department" v-model="editForm.department" required />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <Label for="employee-email" class="text-sm font-medium">{{ t('email') }}</Label>
            <Input id="employee-email" v-model="editForm.email" type="email" required />
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-2">
              <Label for="employee-start" class="text-sm font-medium">{{ t('startDate') }}</Label>
              <Input id="employee-start" v-model="editForm.startDate" type="date" required />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="employee-status" class="text-sm font-medium">{{ t('employeeStatus') }}</Label>
              <Select v-model="editForm.status">
                <SelectTrigger id="employee-status" class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="status in employeeStatuses" :key="status" :value="status">
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
