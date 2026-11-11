<script setup lang="ts">
import { computed, ref } from 'vue'
import { Banknote, Coffee, Cookie, Minus, Plus, Receipt, Search, Trash2 } from '@lucide/vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/composables/use-toast'
import { useTranslations } from '@/i18n'
import { posService } from '@/services/pos-service'
import type { PosCartLine, PosItem, PosPaymentMethod } from '@/lib/data/pos'
import { cn } from '@/lib/utils'

const TAX_RATE = 0.11
const CURRENCY = 'Rp'

const formatMoney = (value: number) => `${CURRENCY} ${value.toLocaleString('en-US')}`

const categoryIcons: Record<PosItem['category'], typeof Coffee> = {
  Coffee,
  Tea: Coffee,
  Food: Cookie,
}

const paymentMethods = ['Cash', 'Card', 'QRIS'] as const

interface ReceiptItem {
  name: string
  quantity: number
  priceAtTime: number
}

interface ReceiptData {
  id: string
  total: number
  paymentMethod: PosPaymentMethod
  items: ReceiptItem[]
  date: string
}

const t = useTranslations()
const { toast } = useToast()

const allItems = posService.listItems()
const categories = posService.listCategories()

const query = ref('')
const activeCategory = ref('All')
const cartLines = ref<PosCartLine[]>([])
const discountPercent = ref(0)
const paymentMethod = ref<PosPaymentMethod>('Cash')
const customerName = ref('Walk-in customer')
const customerEmail = ref('walkin@example.com')
const confirmOpen = ref(false)
const receipt = ref<ReceiptData | null>(null)

const filteredItems = computed(() =>
  allItems.filter((item) => {
    const matchesCategory = activeCategory.value === 'All' || item.category === activeCategory.value
    const matchesQuery = item.name.toLowerCase().includes(query.value.toLowerCase())
    return matchesCategory && matchesQuery
  }),
)

const subtotal = computed(() => cartLines.value.reduce((sum, line) => sum + line.item.price * line.quantity, 0))
const discount = computed(() => subtotal.value * (discountPercent.value / 100))
const taxable = computed(() => subtotal.value - discount.value)
const tax = computed(() => taxable.value * TAX_RATE)
const total = computed(() => taxable.value + tax.value)
const cartCount = computed(() => cartLines.value.reduce((sum, line) => sum + line.quantity, 0))

const paymentLabel = (method: PosPaymentMethod) =>
  ({ Cash: t('cash'), Card: t('card'), QRIS: t('qris') })[method]

function inCart(id: string) {
  return cartLines.value.find((line) => line.item.id === id)?.quantity ?? 0
}

function addItem(item: PosItem) {
  const existing = cartLines.value.find((line) => line.item.id === item.id)
  if (existing) {
    existing.quantity += 1
    return
  }
  cartLines.value.push({ item, quantity: 1 })
}

function changeQuantity(id: string, delta: number) {
  cartLines.value = cartLines.value
    .map((line) => (line.item.id === id ? { ...line, quantity: line.quantity + delta } : line))
    .filter((line) => line.quantity > 0)
}

function removeLine(id: string) {
  cartLines.value = cartLines.value.filter((line) => line.item.id !== id)
}

function onDiscount(value: string | number) {
  discountPercent.value = Math.max(0, Math.min(100, Number(value)))
}

function resetCart() {
  cartLines.value = []
  discountPercent.value = 0
  paymentMethod.value = 'Cash'
  customerName.value = 'Walk-in customer'
  customerEmail.value = 'walkin@example.com'
}

function printReceipt() {
  window.print()
}

function handleCharge() {
  const order = posService.createOrder(
    cartLines.value,
    total.value,
    paymentMethod.value,
    customerName.value,
    customerEmail.value,
  )
  receipt.value = {
    id: order.id,
    total: total.value,
    paymentMethod: paymentMethod.value,
    items: cartLines.value.map((line) => ({
      name: line.item.name,
      quantity: line.quantity,
      priceAtTime: line.item.price,
    })),
    date: order.date,
  }
  confirmOpen.value = false
  resetCart()
  toast({
    title: t('orderCompleted'),
    description: t('receiptReady', { id: order.id }),
    variant: 'success',
  })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('pointOfSale')"
      :description="t('posDescription')"
      :breadcrumbs="[{ title: t('commerce'), href: '#' }, { title: t('pointOfSale'), href: '/pos' }]"
    />

    <div class="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section class="flex min-h-0 flex-col gap-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div class="relative flex-1">
            <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input v-model="query" class="pl-9" :placeholder="t('searchMenu')" />
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            :class="cn(
              'rounded-full border px-3 py-1 text-sm font-medium transition-colors duration-300',
              activeCategory === category
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground',
            )"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Card
            v-for="item in filteredItems"
            :key="item.id"
            role="button"
            tabindex="0"
            :aria-label="`Add ${item.name} to cart`"
            :class="cn(
              'cursor-pointer transition-colors duration-300 hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              inCart(item.id) > 0 && 'border-primary/40 bg-accent/20',
            )"
            @click="addItem(item)"
            @keydown="(event: KeyboardEvent) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); addItem(item) } }"
          >
            <CardContent class="flex items-start gap-3 p-4">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <component :is="categoryIcons[item.category]" class="size-5 text-muted-foreground" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium">{{ item.name }}</p>
                <p class="text-xs text-muted-foreground">{{ item.category }}</p>
                <div class="mt-2 flex items-center justify-between">
                  <span class="text-sm font-semibold">{{ formatMoney(item.price) }}</span>
                  <Badge variant="outline" class="text-xs">{{ t('stock') }} {{ item.stock }}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card v-if="filteredItems.length === 0" class="col-span-full">
            <CardContent class="p-8 text-center text-sm text-muted-foreground">
              {{ t('noItemsMatch') }}
            </CardContent>
          </Card>
        </div>
      </section>

      <section class="flex min-h-0 flex-col gap-4">
        <Card class="flex min-h-0 flex-1 flex-col">
          <CardHeader>
            <CardTitle>{{ t('currentOrder') }}</CardTitle>
          </CardHeader>
          <CardContent class="flex min-h-0 flex-1 flex-col gap-4">
            <div class="flex gap-2">
              <Input v-model="customerName" :placeholder="t('customer')" />
              <Input v-model="customerEmail" type="email" :placeholder="t('customerEmail')" />
            </div>

            <div class="min-h-0 flex-1 overflow-y-auto rounded-lg border p-3">
              <div
                v-if="cartLines.length === 0"
                class="flex h-full min-h-32 items-center justify-center text-sm text-muted-foreground"
              >
                {{ t('cartEmptyHint') }}
              </div>
              <ul v-else class="flex flex-col gap-3">
                <li v-for="line in cartLines" :key="line.item.id" class="flex items-center gap-2">
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium">{{ line.item.name }}</p>
                    <p class="text-xs text-muted-foreground">
                      {{ formatMoney(line.item.price) }} {{ t('each') }}
                    </p>
                  </div>
                  <div class="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      :aria-label="`${t('decrease')} ${line.item.name}`"
                      @click="changeQuantity(line.item.id, -1)"
                    >
                      <Minus class="size-3" />
                    </Button>
                    <span class="w-6 text-center text-sm tabular-nums">{{ line.quantity }}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      :aria-label="`${t('increase')} ${line.item.name}`"
                      @click="changeQuantity(line.item.id, 1)"
                    >
                      <Plus class="size-3" />
                    </Button>
                  </div>
                  <p class="w-20 text-right text-sm font-medium tabular-nums">
                    {{ formatMoney(line.item.price * line.quantity) }}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    class="text-muted-foreground hover:text-destructive"
                    :aria-label="`${t('remove')} ${line.item.name}`"
                    @click="removeLine(line.item.id)"
                  >
                    <Trash2 class="size-3" />
                  </Button>
                </li>
              </ul>
            </div>

            <div class="flex flex-col gap-2 text-sm">
              <div class="flex items-center justify-between">
                <span>{{ t('subtotal') }}</span>
                <span class="tabular-nums">{{ formatMoney(subtotal) }}</span>
              </div>
              <div class="flex items-center justify-between gap-3">
                <label class="flex items-center gap-2">
                  {{ t('discount') }}
                  <Input
                    type="number"
                    :min="0"
                    :max="100"
                    class="h-7 w-16"
                    :model-value="discountPercent"
                    @update:model-value="onDiscount"
                  />
                  %
                </label>
                <span class="tabular-nums text-muted-foreground">-{{ formatMoney(discount) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>{{ t('tax') }}</span>
                <span class="tabular-nums">{{ formatMoney(tax) }}</span>
              </div>
              <div class="flex items-center justify-between border-t pt-2 text-base font-semibold">
                <span>{{ t('total') }}</span>
                <span class="tabular-nums">{{ formatMoney(total) }}</span>
              </div>
            </div>

            <div>
              <p class="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {{ t('paymentMethod') }}
              </p>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="method in paymentMethods"
                  :key="method"
                  type="button"
                  :class="cn(
                    'flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-300',
                    paymentMethod === method
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground',
                  )"
                  @click="paymentMethod = method"
                >
                  <Banknote v-if="method === 'Cash'" class="size-4" />
                  {{ paymentLabel(method) }}
                </button>
              </div>
            </div>

            <Button
              size="lg"
              class="w-full"
              :disabled="cartLines.length === 0"
              @click="confirmOpen = true"
            >
              {{ t('charge') }} {{ formatMoney(total) }}
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>

    <Dialog :open="confirmOpen" @update:open="(open: boolean) => (confirmOpen = open)">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ t('confirmCharge') }}</DialogTitle>
          <DialogDescription>
            {{ cartCount }} {{ t('itemsLabel') }} · {{ t('total') }} {{ formatMoney(total) }} ·
            {{ paymentLabel(paymentMethod) }}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="confirmOpen = false">{{ t('cancel') }}</Button>
          <Button @click="handleCharge">{{ t('confirm') }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog :open="receipt !== null" @update:open="(open: boolean) => { if (!open) receipt = null }">
      <DialogContent>
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <Receipt class="size-5" />
            {{ t('paymentReceived') }}
          </DialogTitle>
          <DialogDescription>
            {{ receipt?.id }} · {{ receipt && new Date(receipt.date).toLocaleString() }}
          </DialogDescription>
        </DialogHeader>
        <div v-if="receipt" class="flex flex-col gap-3">
          <ul class="flex flex-col gap-1 rounded-lg border p-3 text-sm">
            <li
              v-for="item in receipt.items"
              :key="item.name"
              class="flex items-center justify-between"
            >
              <span>{{ item.quantity }} × {{ item.name }}</span>
              <span class="tabular-nums">{{ formatMoney(item.priceAtTime * item.quantity) }}</span>
            </li>
          </ul>
          <div class="flex items-center justify-between text-base font-semibold">
            <span>{{ t('paidVia', { method: paymentLabel(receipt.paymentMethod) }) }}</span>
            <span class="tabular-nums">{{ formatMoney(receipt.total) }}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="printReceipt">{{ t('print') }}</Button>
          <Button @click="receipt = null">{{ t('newOrder') }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
