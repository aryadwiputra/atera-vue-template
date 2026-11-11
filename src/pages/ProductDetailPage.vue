<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PageHeader from '@/components/shared/PageHeader.vue'
import { productService } from '@/services/product-service'
import { useTranslations } from '@/i18n'

const route = useRoute()
const t = useTranslations()
const id = computed(() => String(route.params.id))
const product = computed(() => productService.get(id.value))
</script>

<template>
  <div class="flex flex-col gap-6">
    <template v-if="product">
      <PageHeader
        :title="product.name"
        :description="product.category"
        :breadcrumbs="[
          { title: t('dashboard'), href: '/dashboard' },
          { title: t('products'), href: '/products' },
          { title: product.name, href: `/products/${product.id}` },
        ]"
      >
        <template #actions>
          <Button variant="outline" as-child>
            <RouterLink to="/products">
              <ArrowLeft class="size-4" />
              {{ t('back') }}
            </RouterLink>
          </Button>
        </template>
      </PageHeader>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{{ t('category') }}</CardTitle>
          </CardHeader>
          <CardContent class="font-medium">{{ product.category }}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{{ t('price') }}</CardTitle>
          </CardHeader>
          <CardContent class="font-mono text-2xl font-semibold tabular-nums">
            ${{ product.price.toLocaleString('en-US') }}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{{ t('stock') }}</CardTitle>
          </CardHeader>
          <CardContent class="text-2xl font-semibold tabular-nums">
            {{ product.stock.toLocaleString('en-US') }}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{{ t('sales') }}</CardTitle>
          </CardHeader>
          <CardContent class="text-2xl font-semibold tabular-nums">
            {{ product.sales.toLocaleString('en-US') }}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{{ t('status') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge :variant="product.status === 'Active' ? 'default' : 'secondary'">
              {{ product.status === 'Active' ? t('active') : t('draft') }}
            </Badge>
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
          <RouterLink to="/products">
            <ArrowLeft class="size-4" />
            {{ t('back') }}
          </RouterLink>
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
