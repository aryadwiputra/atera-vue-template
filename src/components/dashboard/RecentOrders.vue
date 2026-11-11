<script setup lang="ts">
import { ChevronRightIcon, MoreHorizontalIcon } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from '@/i18n'
import { dashboardOrders } from './types'

type DashboardOrder = {
  customer: string
  id: string
  product: string
  status: string
  amount: string
}

const props = withDefaults(defineProps<{ orders?: DashboardOrder[] }>(), {
  orders: () => dashboardOrders,
})

const t = useTranslations()
const headings = ['customer', 'orderId', 'product', 'status', 'amount'] as const
</script>

<template>
  <Card class="min-w-0 gap-4 py-5 shadow-none">
    <CardHeader class="flex flex-row items-center justify-between px-5">
      <div>
        <CardTitle class="text-base">{{ t('recentOrders') }}</CardTitle>
        <CardDescription class="mt-1 text-xs">{{ t('latestTransactions') }}</CardDescription>
      </div>
      <Button variant="ghost" size="sm" class="h-7 text-xs">
        {{ t('viewAll') }} <ChevronRightIcon class="size-3.5" />
      </Button>
    </CardHeader>
    <CardContent class="overflow-x-auto px-5">
      <table class="w-full min-w-[560px] text-left text-xs">
        <thead class="border-b text-2xs tracking-wider text-muted-foreground uppercase">
          <tr>
            <th v-for="heading in headings" :key="heading" class="pb-3 font-medium">{{ t(heading) }}</th>
            <th class="pb-3" />
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="order in props.orders" :key="order.id">
            <td class="py-3 font-medium">{{ order.customer }}</td>
            <td class="py-3 text-muted-foreground">{{ order.id }}</td>
            <td class="py-3 text-muted-foreground">{{ order.product }}</td>
            <td class="py-3">
              <Badge variant="outline" class="rounded-md px-1.5 py-0 text-2xs">{{ t(order.status.toLowerCase()) }}</Badge>
            </td>
            <td class="py-3 font-medium">{{ order.amount }}</td>
            <td class="py-3 text-right">
              <Button variant="ghost" size="icon" class="size-6">
                <MoreHorizontalIcon class="size-3.5" />
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </CardContent>
  </Card>
</template>
