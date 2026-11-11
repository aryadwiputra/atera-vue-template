<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PageHeader from '@/components/shared/PageHeader.vue'
import { orderService } from '@/services/order-service'
import { useTranslations } from '@/i18n'

const route = useRoute()
const t = useTranslations()
const id = computed(() => String(route.params.id))
const order = computed(() => orderService.get(id.value))

function statusVariant(status: string) {
  return status === 'Paid' ? 'default' : status === 'Refunded' ? 'destructive' : 'secondary'
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <template v-if="order">
      <PageHeader
        :title="`${t('orderId')} #${order.id}`"
        :description="`${order.customer} · ${order.date}`"
        :breadcrumbs="[
          { title: t('dashboard'), href: '/dashboard' },
          { title: t('orders'), href: '/orders' },
          { title: order.id, href: `/orders/${order.id}` },
        ]"
      >
        <template #actions>
          <Button variant="outline" as-child>
            <RouterLink to="/orders">
              <ArrowLeft class="size-4" />
              {{ t('back') }}
            </RouterLink>
          </Button>
        </template>
      </PageHeader>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{{ t('customer') }}</CardTitle>
          </CardHeader>
          <CardContent class="flex flex-col gap-1">
            <span class="font-medium">{{ order.customer }}</span>
            <span class="text-xs text-muted-foreground">{{ order.customerEmail }}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{{ t('product') }}</CardTitle>
          </CardHeader>
          <CardContent class="font-medium">{{ order.product }}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{{ t('status') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge :variant="statusVariant(order.status)">{{ order.status }}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{{ t('amount') }}</CardTitle>
          </CardHeader>
          <CardContent class="font-mono text-2xl font-semibold tabular-nums">
            ${{ order.amount.toFixed(2) }}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{{ t('date') }}</CardTitle>
          </CardHeader>
          <CardContent class="font-medium">{{ order.date }}</CardContent>
        </Card>
      </div>
    </template>

    <Card v-else>
      <CardHeader>
        <CardTitle>{{ t('notFound') }}</CardTitle>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <p class="text-sm text-muted-foreground">{{ t('notFoundDescription') }}</p>
        <Button variant="outline" as-child class="w-fit">
          <RouterLink to="/orders">
            <ArrowLeft class="size-4" />
            {{ t('back') }}
          </RouterLink>
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
