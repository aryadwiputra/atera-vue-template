<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import StatCard from '@/components/shared/StatCard.vue'
import { orderService } from '@/services/order-service'
import { productService } from '@/services/product-service'
import { userService } from '@/services/user-service'
import { useTranslations } from '@/i18n'

const t = useTranslations()

const orders = orderService.list()
const products = productService.list()
const users = userService.list()

const revenue = computed(() =>
  `$${orders.reduce((sum, order) => sum + order.amount, 0).toLocaleString('en-US')}`,
)
const paidOrders = computed(() => orders.filter((order) => order.status === 'Paid').length)
const activeUsers = computed(() => users.filter((user) => user.status === 'Active').length)
const activeProducts = computed(() => products.filter((p) => p.status === 'Active').length)

const recent = computed(() => orders.slice(0, 5))

function statusVariant(status: string) {
  return status === 'Paid' ? 'default' : status === 'Refunded' ? 'destructive' : 'secondary'
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">{{ t('dashboard') }}</h1>
        <p class="mt-1 text-sm text-muted-foreground">{{ t('welcome') }}</p>
      </div>
    </header>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard :title="t('revenue')" :value="revenue" change="+12.5%" :description="t('vsLastMonth')" />
      <StatCard :title="t('ordersToday')" :value="paidOrders" change="+3" :description="t('vsLastMonth')" />
      <StatCard :title="t('activeUsers')" :value="activeUsers" change="+2" :description="t('vsLastMonth')" />
      <StatCard :title="t('products')" :value="activeProducts" change="+1" :description="t('vsLastMonth')" />
    </section>

    <section class="rounded-xl border">
      <div class="flex items-center justify-between border-b px-4 py-3">
        <h2 class="text-sm font-medium">{{ t('recentOrders') }}</h2>
        <Button as="router-link" to="/orders" variant="ghost" size="sm">
          {{ t('orders') }}
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{{ t('orderId') }}</TableHead>
            <TableHead>{{ t('customer') }}</TableHead>
            <TableHead>{{ t('product') }}</TableHead>
            <TableHead>{{ t('status') }}</TableHead>
            <TableHead class="text-right">{{ t('amount') }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="order in recent" :key="order.id">
            <TableCell class="font-mono text-xs">{{ order.id }}</TableCell>
            <TableCell>{{ order.customer }}</TableCell>
            <TableCell class="text-muted-foreground">{{ order.product }}</TableCell>
            <TableCell>
              <Badge :variant="statusVariant(order.status)">{{ order.status }}</Badge>
            </TableCell>
            <TableCell class="text-right font-mono tabular-nums">
              ${{ order.amount.toLocaleString('en-US') }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  </div>
</template>
