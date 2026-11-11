<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowLeftRight, Pencil, PiggyBank, Plus, Trash2, TrendingDown, TrendingUp } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import StatCard from '@/components/shared/StatCard.vue'
import DataTable from '@/components/shared/DataTable.vue'
import type { DataTableColumn } from '@/components/shared/DataTable.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import ChartCard from '@/components/charts/ChartCard.vue'
import ChartComposed from '@/components/charts/ChartComposed.vue'
import ChartPie from '@/components/charts/ChartPie.vue'
import PieLegend from '@/components/charts/PieLegend.vue'
import { financeService } from '@/services/finance-service'
import type { FinanceTransaction, TransactionStatus, TransactionType } from '@/lib/data/types'
import { useTranslations } from '@/i18n'
import { useToast } from '@/composables/use-toast'
import { cn } from '@/lib/utils'

const t = useTranslations()
const { toast } = useToast()

const cashFlowTrend = [
  { month: 'Jun', income: 14200, expenses: 9800 },
  { month: 'Jul', income: 15800, expenses: 10400 },
  { month: 'Aug', income: 15100, expenses: 11200 },
  { month: 'Sep', income: 17400, expenses: 9600 },
  { month: 'Oct', income: 16900, expenses: 12100 },
  { month: 'Nov', income: 18300, expenses: 10800 },
]

const expenseBreakdown = [
  { name: 'Operations', value: 34 },
  { name: 'Marketing', value: 26 },
  { name: 'Payroll', value: 22 },
  { name: 'Software', value: 12 },
  { name: 'Other', value: 6 },
]

const transactionCategories = ['Subscriptions', 'Services', 'Infrastructure', 'Payroll', 'Marketing', 'Software', 'Office', 'Travel']

const formatMoney = (value: number) => `$${value.toLocaleString('en-US')}`

type FormState = {
  description: string
  category: string
  type: TransactionType
  amount: number
  status: TransactionStatus
  date: string
}

const emptyForm = (): FormState => ({
  description: '',
  category: 'Subscriptions',
  type: 'Expense',
  amount: 0,
  status: 'Cleared',
  date: new Date().toISOString().slice(0, 10),
})

const items = ref<FinanceTransaction[]>(financeService.list())
const formOpen = ref(false)
const editing = ref<FinanceTransaction | null>(null)
const form = ref<FormState>(emptyForm())
const pendingDelete = ref<FinanceTransaction | null>(null)

function refresh() {
  items.value = financeService.list()
}

const totalIncome = computed(() =>
  items.value.filter((item) => item.type === 'Income').reduce((sum, item) => sum + item.amount, 0),
)
const totalExpenses = computed(() =>
  items.value.filter((item) => item.type === 'Expense').reduce((sum, item) => sum + item.amount, 0),
)
const netCashFlow = computed(() => totalIncome.value - totalExpenses.value)
const pendingCount = computed(() => items.value.filter((item) => item.status === 'Pending').length)

function openCreate() {
  editing.value = null
  form.value = emptyForm()
  formOpen.value = true
}

function openEdit(transaction: FinanceTransaction) {
  editing.value = transaction
  form.value = {
    description: transaction.description,
    category: transaction.category,
    type: transaction.type,
    amount: transaction.amount,
    status: transaction.status,
    date: transaction.date,
  }
  formOpen.value = true
}

function handleSubmit() {
  if (form.value.description.trim() === '' || form.value.amount <= 0) return
  if (editing.value) {
    financeService.update(editing.value.id, { ...form.value })
    toast({ title: t('transactionUpdated'), description: form.value.description, variant: 'success' })
  } else {
    financeService.create({ ...form.value })
    toast({ title: t('transactionCreated'), description: form.value.description, variant: 'success' })
  }
  refresh()
  formOpen.value = false
}

const columns = computed<DataTableColumn[]>(() => [
  { key: 'date', header: t('date'), sortable: true },
  { key: 'description', header: '' },
  { key: 'category', header: t('category'), sortable: true },
  { key: 'type', header: t('type'), sortable: true },
  { key: 'amount', header: t('amount'), align: 'right', sortable: true },
  { key: 'status', header: t('status'), sortable: true },
  { key: 'actions', header: '', align: 'right' },
])

const summary = computed(() => [
  {
    title: t('totalIncome'),
    value: formatMoney(totalIncome.value),
    change: `+${items.value.filter((item) => item.type === 'Income').length} ${t('entries')}`,
    icon: TrendingUp,
    description: t('totalIncomeDescription'),
  },
  {
    title: t('totalExpenses'),
    value: formatMoney(totalExpenses.value),
    change: `${pendingCount.value} ${t('pendingLower')}`,
    changePositive: false,
    icon: TrendingDown,
    description: t('totalExpensesDescription'),
  },
  {
    title: t('netCashFlow'),
    value: formatMoney(netCashFlow.value),
    change: netCashFlow.value >= 0 ? t('positiveNetFlow') : t('negativeNetFlow'),
    changePositive: netCashFlow.value >= 0,
    icon: ArrowLeftRight,
    description: t('netCashFlowDescription'),
  },
  {
    title: t('savings'),
    value: formatMoney(Math.round(netCashFlow.value * 0.35)),
    change: '+3.1%',
    icon: PiggyBank,
    description: t('savingsDescription'),
  },
])

function requestDelete(row: Record<string, unknown>) {
  pendingDelete.value = row as unknown as FinanceTransaction
}

function confirmDelete() {
  if (!pendingDelete.value) return
  financeService.remove(pendingDelete.value.id)
  refresh()
  pendingDelete.value = null
  toast({ title: t('transactionDeleted'), variant: 'success' })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('finance')"
      :description="t('financeDescription')"
      :breadcrumbs="[{ title: t('overview'), href: '#' }, { title: t('finance'), href: '/finance' }]"
    >
      <template #actions>
        <Button size="sm" @click="openCreate">
          <Plus class="size-4" />
          {{ t('addTransaction') }}
        </Button>
      </template>
    </PageHeader>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        v-for="card in summary"
        :key="card.title"
        :title="card.title"
        :value="card.value"
        :change="card.change"
        :change-positive="card.changePositive"
        :icon="card.icon"
        :description="card.description"
      />
    </div>

    <div class="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
      <ChartCard :title="t('cashFlowTrend')" :description="t('cashFlowTrendDescription')">
        <ChartComposed :data="cashFlowTrend" :bar-keys="['income']" :line-keys="['expenses']" x-key="month" />
      </ChartCard>
      <ChartCard :title="t('expenseBreakdown')" :description="t('expenseBreakdownDescription')">
        <ChartPie :data="expenseBreakdown" :inner-radius="70" />
        <PieLegend :data="expenseBreakdown" />
      </ChartCard>
    </div>

    <div class="flex flex-col gap-3">
      <h2 class="text-base font-semibold tracking-tight">{{ t('transactions') }}</h2>
      <DataTable :columns="columns" :data="items" :filter-placeholder="t('filterTransactions')">
        <template #cell="{ row, column }">
          <template v-if="column.key === 'description'">
            <span class="font-medium">{{ row.description }}</span>
          </template>
          <template v-else-if="column.key === 'type'">
            <Badge :variant="row.type === 'Income' ? 'default' : 'secondary'">
              {{ row.type === 'Income' ? t('income') : t('expense') }}
            </Badge>
          </template>
          <template v-else-if="column.key === 'amount'">
            <span
              :class="cn(
                'font-semibold tabular-nums',
                row.type === 'Income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive',
              )"
            >
              {{ row.type === 'Income' ? '+' : '-' }}{{ formatMoney(Number(row.amount)) }}
            </span>
          </template>
          <template v-else-if="column.key === 'status'">
            <Badge :variant="row.status === 'Cleared' ? 'outline' : 'secondary'">
              {{ row.status === 'Cleared' ? t('cleared') : t('pending') }}
            </Badge>
          </template>
          <template v-else-if="column.key === 'actions'">
            <div class="flex justify-end gap-1">
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
    </div>

    <Dialog v-model:open="formOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ editing ? t('editTransaction') : t('addTransaction') }}</DialogTitle>
          <DialogDescription>{{ t('transactionDescription') }}</DialogDescription>
        </DialogHeader>
        <form class="grid gap-4" @submit.prevent="handleSubmit">
          <div class="flex flex-col gap-2">
            <Label for="txn-description" class="text-sm font-medium">{{ t('descriptionField') }}</Label>
            <Input id="txn-description" v-model="form.description" required />
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-2">
              <Label for="txn-category" class="text-sm font-medium">{{ t('category') }}</Label>
              <Select v-model="form.category">
                <SelectTrigger id="txn-category" class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="category in transactionCategories" :key="category" :value="category">
                    {{ category }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex flex-col gap-2">
              <Label for="txn-type" class="text-sm font-medium">{{ t('type') }}</Label>
              <Select v-model="form.type">
                <SelectTrigger id="txn-type" class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Income">{{ t('income') }}</SelectItem>
                  <SelectItem value="Expense">{{ t('expense') }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-2">
              <Label for="txn-amount" class="text-sm font-medium">{{ t('amount') }}</Label>
              <Input id="txn-amount" v-model.number="form.amount" type="number" min="0" step="0.01" required />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="txn-status" class="text-sm font-medium">{{ t('status') }}</Label>
              <Select v-model="form.status">
                <SelectTrigger id="txn-status" class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cleared">{{ t('cleared') }}</SelectItem>
                  <SelectItem value="Pending">{{ t('pending') }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <Label for="txn-date" class="text-sm font-medium">{{ t('date') }}</Label>
            <Input id="txn-date" v-model="form.date" type="date" required />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" @click="formOpen = false">{{ t('cancel') }}</Button>
            <Button type="submit">{{ editing ? t('saveChanges') : t('addTransaction') }}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <ConfirmDialog
      :open="pendingDelete !== null"
      :title="t('deleteTransaction')"
      :description="t('deleteTransactionDescription')"
      :confirm-label="t('delete')"
      :cancel-label="t('cancel')"
      @update:open="(value: boolean) => !value && (pendingDelete = null)"
      @confirm="confirmDelete"
    />
  </div>
</template>
