<script setup lang="ts">
import { computed } from 'vue'
import StatCard from '@/components/shared/StatCard.vue'
import OverviewChart from '@/components/dashboard/OverviewChart.vue'
import TrafficSources from '@/components/dashboard/TrafficSources.vue'
import RecentOrders from '@/components/dashboard/RecentOrders.vue'
import GoalsCard from '@/components/dashboard/GoalsCard.vue'
import ActivityCard from '@/components/dashboard/ActivityCard.vue'
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

const recentOrders = computed(() =>
  orders.map((order) => ({
    customer: order.customer,
    id: '#' + order.id,
    product: order.product,
    status: order.status,
    amount: '$' + order.amount.toFixed(2),
  })),
)
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

    <section class="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
      <OverviewChart />
      <TrafficSources />
    </section>

    <section class="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
      <RecentOrders :orders="recentOrders" />
      <div class="flex flex-col gap-4">
        <GoalsCard />
        <ActivityCard />
      </div>
    </section>
  </div>
</template>
