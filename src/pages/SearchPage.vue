<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Search, SearchX } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import { Input } from '@/components/ui/input'
import PageHeader from '@/components/shared/PageHeader.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import { orderService } from '@/services/order-service'
import { productService } from '@/services/product-service'
import { customerService } from '@/services/customer-service'
import { invoiceService } from '@/services/invoice-service'
import { userService } from '@/services/user-service'
import { useTranslations } from '@/i18n'

const MAX_PER_SECTION = 5

interface SearchItem {
  id: string
  title: string
  subtitle: string
  href: string
}

interface SearchSection {
  key: string
  label: string
  items: SearchItem[]
}

const t = useTranslations()
const route = useRoute()
const router = useRouter()

const query = computed(() => {
  const value = route.query.q
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '')
})

const term = ref(query.value)

watch(query, (value) => {
  term.value = value
})

watch(term, (value) => {
  if (value === query.value) return
  router.replace({ query: { ...route.query, q: value ? value : undefined } })
})

function matches(query: string, fields: (string | number | undefined)[]) {
  const needle = query.toLowerCase()
  return fields.some((field) => field !== undefined && String(field).toLowerCase().includes(needle))
}

const sections = computed<SearchSection[]>(() => {
  const q = query.value.trim()
  if (!q) return []
  const all: SearchSection[] = [
    {
      key: 'orders',
      label: t('orders'),
      items: orderService
        .list()
        .filter((o) => matches(q, [o.id, o.customer, o.product, o.status]))
        .slice(0, MAX_PER_SECTION)
        .map((o) => ({
          id: o.id,
          title: `${o.id} — ${o.customer}`,
          subtitle: `${o.product} · $${o.amount}`,
          href: `/orders/${o.id}`,
        })),
    },
    {
      key: 'products',
      label: t('products'),
      items: productService
        .list()
        .filter((p) => matches(q, [p.name, p.category, p.status]))
        .slice(0, MAX_PER_SECTION)
        .map((p) => ({
          id: p.id,
          title: p.name,
          subtitle: p.category,
          href: `/products/${p.id}`,
        })),
    },
    {
      key: 'customers',
      label: t('customers'),
      items: customerService
        .list()
        .filter((c) => matches(q, [c.name, c.email, c.company]))
        .slice(0, MAX_PER_SECTION)
        .map((c) => ({
          id: c.id,
          title: c.name,
          subtitle: c.company,
          href: `/customers/${c.id}`,
        })),
    },
    {
      key: 'invoices',
      label: t('invoices'),
      items: invoiceService
        .list()
        .filter((i) => matches(q, [i.id, i.customer]))
        .slice(0, MAX_PER_SECTION)
        .map((i) => ({
          id: i.id,
          title: i.id,
          subtitle: `${i.customer} · $${i.amount}`,
          href: '/invoices',
        })),
    },
    {
      key: 'users',
      label: t('users'),
      items: userService
        .list()
        .filter((u) => matches(q, [u.name, u.email]))
        .slice(0, MAX_PER_SECTION)
        .map((u) => ({
          id: u.id,
          title: u.name,
          subtitle: u.email,
          href: '/users',
        })),
    },
  ]
  return all.filter((section) => section.items.length > 0)
})

const total = computed(() => sections.value.reduce((sum, section) => sum + section.items.length, 0))
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('searchResults')"
      :description="query ? `${t('searchResultsFor')} &quot;${query}&quot;` : t('searchResultsDescription')"
      :breadcrumbs="[{ title: t('searchResults'), href: '/search' }]"
    />

    <div class="relative mx-auto w-full max-w-3xl">
      <Search class="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input v-model="term" type="search" class="pl-8" :placeholder="t('searchPrompt')" :aria-label="t('searchResultsForLabel')" />
    </div>

    <EmptyState
      v-if="query && total === 0"
      :icon="SearchX"
      :title="t('noSearchResults')"
      :description="`${t('noSearchResultsFor')} &quot;${query}&quot;`"
    />

    <div v-if="!query || total > 0" class="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <div v-if="!query" class="flex flex-col items-center gap-3 py-12 text-center">
        <div class="flex size-12 items-center justify-center rounded-full bg-muted">
          <Search class="size-6 text-muted-foreground" />
        </div>
        <p class="text-sm text-muted-foreground">{{ t('searchPrompt') }}</p>
      </div>

      <Card v-for="section in sections" :key="section.key" class="shadow-none">
        <CardHeader class="flex-row items-center justify-between">
          <CardTitle class="text-sm">{{ section.label }}</CardTitle>
          <Badge variant="secondary">{{ section.items.length }}</Badge>
        </CardHeader>
        <CardContent class="divide-y">
          <RouterLink
            v-for="item in section.items"
            :key="item.id"
            :to="item.href"
            class="flex items-center justify-between gap-4 py-2.5 text-sm hover:text-foreground"
          >
            <span class="font-medium">{{ item.title }}</span>
            <span class="text-xs text-muted-foreground">{{ item.subtitle }}</span>
          </RouterLink>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
