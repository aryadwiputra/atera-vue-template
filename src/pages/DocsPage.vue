<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const services = [
  'asset-service',
  'calendar-service',
  'crm-service',
  'customer-service',
  'editor-document-service',
  'file-service',
  'finance-service',
  'hr-service',
  'inventory-service',
  'invoice-service',
  'kanban-service',
  'mail-service',
  'notification-service',
  'order-service',
  'pos-service',
  'procurement-service',
  'product-service',
  'profile-service',
  'supplier-service',
  'user-service',
]

const folders = [
  ['src/pages', 'Route screens (Vue SFCs), grouped by navigation area'],
  ['src/layouts', 'Protected and auth shells'],
  ['src/components/ui', 'shadcn-vue primitives (reka-ui)'],
  ['src/components/shared', 'DataTable, StatCard, PageHeader, EmptyState, ConfirmDialog, RecordDialog, Toaster'],
  ['src/components/charts', 'ECharts wrappers (area, bar, line, pie, radar, radial, scatter, treemap, composed)'],
  ['src/components/dashboard', 'Dashboard widgets (metrics, overview chart, traffic, goals, activity, recent orders)'],
  ['src/composables', 'useToast, useChartColors'],
  ['src/lib/data', 'Typed in-memory mock modules'],
  ['src/lib/navigation.ts', 'Sidebar tree: 5 groups, 38 items'],
  ['src/services', 'Thin typed service layer over the mock data'],
  ['src/stores', 'Pinia stores (auth, preferences)'],
  ['src/i18n', 'vue-i18n dictionary (en/de/fr)'],
]
</script>

<template>
  <div class="min-h-svh bg-background text-foreground">
    <header class="border-b">
      <div class="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <span class="text-sm font-semibold">Atera Documentation</span>
        <RouterLink to="/dashboard" class="text-sm text-muted-foreground transition-colors hover:text-foreground">
          Back to app
        </RouterLink>
      </div>
    </header>

    <main class="mx-auto max-w-4xl px-6 py-10">
      <h1 class="text-2xl font-semibold tracking-tight">Atera Documentation</h1>
      <p class="mt-2 text-sm text-muted-foreground">
        A Vue 3 + TypeScript admin dashboard template. This page explains how the pieces fit
        together and how to extend them.
      </p>

      <Tabs default-value="architecture" class="mt-8">
        <TabsList class="flex flex-wrap gap-2">
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="data">Data Layer</TabsTrigger>
          <TabsTrigger value="components">UI Components</TabsTrigger>
          <TabsTrigger value="theming">Theming</TabsTrigger>
          <TabsTrigger value="i18n">i18n</TabsTrigger>
          <TabsTrigger value="pages">Adding a Page</TabsTrigger>
        </TabsList>

        <TabsContent value="architecture" class="mt-6 flex flex-col gap-4">
          <h2 class="text-lg font-medium">Project structure</h2>
          <dl class="divide-y border-y">
            <div v-for="[path, desc] in folders" :key="path" class="grid gap-1 py-2 sm:grid-cols-[220px_1fr]">
              <dt class="font-mono text-xs">{{ path }}</dt>
              <dd class="text-sm text-muted-foreground">{{ desc }}</dd>
            </div>
          </dl>
          <h2 class="text-lg font-medium">Data flow</h2>
          <p class="text-sm leading-relaxed text-muted-foreground">
            Pages call a service, the service delegates to a mock data module. To connect a real
            backend, replace one service file per domain. Pages do not change.
          </p>
          <pre class="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-xs"><code>UI (page) → service → data module → (swap point for REST / GraphQL)</code></pre>
        </TabsContent>

        <TabsContent value="data" class="mt-6 flex flex-col gap-4">
          <h2 class="text-lg font-medium">Service layer</h2>
          <p class="text-sm leading-relaxed text-muted-foreground">
            Each domain has a typed interface and a mock implementation. Swap the implementation
            for an HTTP client and the rest of the app keeps working.
          </p>
          <pre class="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-xs"><code>export interface OrderService {
  list(): Order[]
  get(id: string): Order | undefined
  create(input: Omit&lt;Order, 'id'&gt;): Order
  update(id: string, updates: Partial&lt;Order&gt;): Order | undefined
  remove(id: string): boolean
}

export const orderService: OrderService = {
  list: listOrders,
  get: getOrder,
  create: createOrder,
  update: updateOrder,
  remove: removeOrder,
}</code></pre>
          <h2 class="text-lg font-medium">Services</h2>
          <ul class="flex flex-col gap-1 text-sm text-muted-foreground">
            <li v-for="service in services" :key="service" class="font-mono text-xs">src/services/{{ service }}.ts</li>
          </ul>
        </TabsContent>

        <TabsContent value="components" class="mt-6 flex flex-col gap-4">
          <h2 class="text-lg font-medium">Shared components</h2>
          <dl class="divide-y border-y">
            <div class="grid gap-1 py-2 sm:grid-cols-[180px_1fr]">
              <dt class="font-mono text-xs">DataTable</dt>
              <dd class="text-sm text-muted-foreground">Filter, sort, paginate, select, mobile cards. Pass columns and data, customise cells with the #cell slot.</dd>
            </div>
            <div class="grid gap-1 py-2 sm:grid-cols-[180px_1fr]">
              <dt class="font-mono text-xs">StatCard</dt>
              <dd class="text-sm text-muted-foreground">Title, value, change and optional icon.</dd>
            </div>
            <div class="grid gap-1 py-2 sm:grid-cols-[180px_1fr]">
              <dt class="font-mono text-xs">PageHeader</dt>
              <dd class="text-sm text-muted-foreground">Title, description, breadcrumbs and an actions slot.</dd>
            </div>
            <div class="grid gap-1 py-2 sm:grid-cols-[180px_1fr]">
              <dt class="font-mono text-xs">EmptyState</dt>
              <dd class="text-sm text-muted-foreground">Icon, title, description and an action slot.</dd>
            </div>
            <div class="grid gap-1 py-2 sm:grid-cols-[180px_1fr]">
              <dt class="font-mono text-xs">ConfirmDialog</dt>
              <dd class="text-sm text-muted-foreground">Destructive confirmation with v-model:open.</dd>
            </div>
            <div class="grid gap-1 py-2 sm:grid-cols-[180px_1fr]">
              <dt class="font-mono text-xs">RecordDialog</dt>
              <dd class="text-sm text-muted-foreground">Create and edit form built from a field list, validated with vee-validate and zod.</dd>
            </div>
            <div class="grid gap-1 py-2 sm:grid-cols-[180px_1fr]">
              <dt class="font-mono text-xs">Toaster</dt>
              <dd class="text-sm text-muted-foreground">Stack of toasts fed by the useToast composable.</dd>
            </div>
          </dl>
          <h2 class="text-lg font-medium">Charts</h2>
          <p class="text-sm leading-relaxed text-muted-foreground">
            Chart wrappers in <span class="font-mono text-xs">src/components/charts</span> render
            ECharts through vue-echarts. Colors are read from the theme tokens
            (<span class="font-mono text-xs">--chart-1</span> to
            <span class="font-mono text-xs">--chart-5</span>) with
            <span class="font-mono text-xs">useChartColors()</span>, so charts follow the active
            color preset and dark mode.
          </p>
          <p class="text-sm text-muted-foreground">
            Base primitives live in <span class="font-mono text-xs">src/components/ui</span> and are
            built on reka-ui (the shadcn-vue port of Radix).
          </p>
        </TabsContent>

        <TabsContent value="theming" class="mt-6 flex flex-col gap-4">
          <h2 class="text-lg font-medium">Design tokens</h2>
          <p class="text-sm leading-relaxed text-muted-foreground">
            Tokens live in <span class="font-mono text-xs">src/app.css</span> as a Tailwind v4
            <span class="font-mono text-xs">@theme</span> block using oklch values. Light and dark
            pairs are defined in <span class="font-mono text-xs">:root</span> and
            <span class="font-mono text-xs">.dark</span>.
          </p>
          <ul class="list-disc pl-5 text-sm text-muted-foreground">
            <li>Five color presets: zinc, blue, violet, rose, orange via <span class="font-mono text-xs">[data-color]</span>.</li>
            <li>Density: compact, comfortable, spacious via <span class="font-mono text-xs">[data-density]</span>.</li>
            <li>Container: fluid or boxed via <span class="font-mono text-xs">[data-container]</span>.</li>
            <li>Appearance: light, dark, system, applied by the preferences store.</li>
          </ul>
        </TabsContent>

        <TabsContent value="i18n" class="mt-6 flex flex-col gap-4">
          <h2 class="text-lg font-medium">Translations</h2>
          <p class="text-sm leading-relaxed text-muted-foreground">
            The dictionary lives in <span class="font-mono text-xs">src/i18n/index.ts</span> with
            English, German and French. Use the <span class="font-mono text-xs">useTranslations()</span>
            composable inside components. There is no interpolation, so concatenate dynamic values.
          </p>
          <pre class="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-xs"><code>const t = useTranslations()
t('orders') // "Orders"</code></pre>
        </TabsContent>

        <TabsContent value="pages" class="mt-6 flex flex-col gap-4">
          <h2 class="text-lg font-medium">Adding a page</h2>
          <ol class="list-decimal pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Add a data module in <span class="font-mono text-xs">src/lib/data</span> and a service in <span class="font-mono text-xs">src/services</span>.</li>
            <li>Create a page in <span class="font-mono text-xs">src/pages</span> using PageHeader and DataTable.</li>
            <li>Register the route in <span class="font-mono text-xs">src/router/index.ts</span>.</li>
            <li>Add a navigation entry in <span class="font-mono text-xs">src/lib/navigation.ts</span>.</li>
            <li>Add translation keys to all three locales in <span class="font-mono text-xs">src/i18n/index.ts</span>.</li>
            <li>Run <span class="font-mono text-xs">bun run build</span>.</li>
          </ol>
        </TabsContent>
      </Tabs>
    </main>
  </div>
</template>
