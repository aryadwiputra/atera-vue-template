<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PageHeader from '@/components/shared/PageHeader.vue'
import { customerService } from '@/services/customer-service'
import { useTranslations } from '@/i18n'

const route = useRoute()
const t = useTranslations()
const id = computed(() => String(route.params.id))
const customer = computed(() => customerService.get(id.value))
</script>

<template>
  <div class="flex flex-col gap-6">
    <template v-if="customer">
      <PageHeader
        :title="customer.name"
        :description="customer.email"
        :breadcrumbs="[
          { title: t('dashboard'), href: '/dashboard' },
          { title: t('customers'), href: '/customers' },
          { title: customer.name, href: `/customers/${customer.id}` },
        ]"
      >
        <template #actions>
          <Button variant="outline" as-child>
            <RouterLink to="/customers">
              <ArrowLeft class="size-4" />
              {{ t('back') }}
            </RouterLink>
          </Button>
        </template>
      </PageHeader>

      <div class="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{{ t('company') }}</CardTitle>
          </CardHeader>
          <CardContent>{{ customer.company }}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{{ t('orders') }}</CardTitle>
          </CardHeader>
          <CardContent class="text-2xl font-semibold tabular-nums">
            {{ customer.orders.toLocaleString('en-US') }}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{{ t('totalSpent') }}</CardTitle>
          </CardHeader>
          <CardContent class="font-mono text-2xl font-semibold tabular-nums">
            ${{ customer.spent.toLocaleString('en-US') }}
          </CardContent>
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
          <RouterLink to="/customers">
            <ArrowLeft class="size-4" />
            {{ t('back') }}
          </RouterLink>
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
