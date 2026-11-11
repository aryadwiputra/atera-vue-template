<script setup lang="ts">
import { computed, markRaw, reactive, ref } from 'vue'
import {
  Briefcase,
  Building2,
  CalendarDays,
  ChevronRight,
  FileText,
  Mail,
  MapPin,
  Package,
  Pencil,
  Receipt,
  Save,
} from '@lucide/vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/auth'
import { usePreferencesStore } from '@/stores/preferences'
import { profileService } from '@/services/profile-service'
import { orderService } from '@/services/order-service'
import { invoiceService } from '@/services/invoice-service'
import { fileService } from '@/services/file-service'
import { useTranslations } from '@/i18n'
import { useToast } from '@/composables/use-toast'
import type { Profile } from '@/lib/data/profile'
import type { Order } from '@/lib/data/types'

type OrderTone = 'default' | 'secondary' | 'destructive'

const t = useTranslations()
const { toast } = useToast()
const auth = useAuthStore()
const preferences = usePreferencesStore()

const profile = ref<Profile>(profileService.get())
const form = reactive({
  fullName: profile.value.fullName || auth.session?.name || 'User',
  email: profile.value.email,
  jobTitle: profile.value.jobTitle,
  company: profile.value.company,
  location: profile.value.location,
})
const errors = reactive<{ fullName?: string; email?: string }>({})

const fullName = computed(() => profile.value.fullName || auth.session?.name || 'User')
const joined = auth.session?.authenticatedAt ? new Date(auth.session.authenticatedAt) : new Date()

const orders = orderService.list()
const invoices = invoiceService.list()
const files = fileService.list()
const recentOrders = orders.slice(0, 3)

const locale = computed(() =>
  preferences.language === 'de' ? 'de-DE' : preferences.language === 'fr' ? 'fr-FR' : 'en-US',
)

const joinedLabel = computed(() =>
  joined.toLocaleDateString(locale.value, { year: 'numeric', month: 'short', day: 'numeric' }),
)

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U'

const orderStatusTone = (status: Order['status']): OrderTone =>
  status === 'Paid' ? 'default' : status === 'Pending' ? 'secondary' : 'destructive'

const activityRows = computed(() => [
  { label: t('recentOrders'), value: orders.length, icon: markRaw(Package), href: '/orders' },
  { label: t('recentInvoices'), value: invoices.length, icon: markRaw(Receipt), href: '/invoices' },
  { label: t('recentFiles'), value: files.length, icon: markRaw(FileText), href: '/files' },
])

const preferenceLinks = computed(() => [
  {
    title: t('appearance'),
    description: t('appearanceDescription'),
    href: '/settings/appearance',
  },
  {
    title: t('notifications'),
    description: t('notificationsSettingsDescription'),
    href: '/settings/notifications',
  },
  {
    title: t('billing'),
    description: t('billingSettingsDescription'),
    href: '/settings/billing',
  },
])

function validate() {
  errors.fullName = form.fullName.trim().length >= 2 ? undefined : 'Enter at least 2 characters.'
  errors.email = !form.email.trim()
    ? 'Email is required.'
    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
      ? undefined
      : 'Enter a valid email address.'
  return !errors.fullName && !errors.email
}

function onSubmit() {
  if (!validate()) return
  const values: Profile = { ...form }
  profileService.save(values)
  profile.value = values
  toast({ title: t('profileSaved'), variant: 'success' })
}

function resetForm() {
  form.fullName = profile.value.fullName || auth.session?.name || 'User'
  form.email = profile.value.email
  form.jobTitle = profile.value.jobTitle
  form.company = profile.value.company
  form.location = profile.value.location
  errors.fullName = undefined
  errors.email = undefined
}

function focusFullName() {
  document.getElementById('profile-full-name')?.focus()
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('profile')"
      :description="t('profileDescription')"
      :breadcrumbs="[{ title: t('dashboard'), href: '/dashboard' }, { title: t('profile'), href: '/profile' }]"
    />

    <Card>
      <div class="h-28 bg-linear-to-r from-primary/15 via-primary/5 to-transparent" />
      <div class="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end">
        <div class="-mt-10">
          <Avatar class="size-20 border-4 border-background text-lg">
            <AvatarFallback>{{ initialsOf(fullName) }}</AvatarFallback>
          </Avatar>
        </div>
        <div class="min-w-0 flex-1 pt-4 sm:pt-0">
          <h2 class="truncate text-xl font-semibold tracking-tight">{{ fullName }}</h2>
          <p class="truncate text-sm text-muted-foreground">
            {{ [profile.jobTitle, profile.company].filter(Boolean).join(' · ') || t('role') }}
          </p>
        </div>
        <Button variant="outline" type="button" @click="focusFullName">
          <Pencil class="size-4" />
          {{ t('editProfile') }}
        </Button>
      </div>
      <div class="grid gap-3 border-t border-border bg-muted/30 px-6 py-4 sm:grid-cols-3">
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 class="size-4 shrink-0" />
          <span class="truncate">{{ profile.company || '—' }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin class="size-4 shrink-0" />
          <span class="truncate">{{ profile.location || '—' }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays class="size-4 shrink-0" />
          <span class="truncate">{{ t('joined') }} {{ joinedLabel }}</span>
        </div>
      </div>
    </Card>

    <div class="grid gap-6 lg:grid-cols-3">
      <Card class="lg:col-span-1">
        <CardHeader>
          <CardTitle>{{ t('accountDetails') }}</CardTitle>
          <CardDescription>{{ t('profileSettingsDescription') }}</CardDescription>
        </CardHeader>
        <CardContent>
          <form class="grid gap-4" @submit.prevent="onSubmit">
            <label class="grid gap-2 text-sm font-medium">
              {{ t('fullName') }}
              <Input id="profile-full-name" v-model="form.fullName" type="text" :placeholder="t('fullName')" />
              <span v-if="errors.fullName" class="text-xs text-destructive">{{ errors.fullName }}</span>
            </label>
            <label class="grid gap-2 text-sm font-medium">
              <span class="flex items-center gap-1"><Mail class="size-3.5" />{{ t('email') }}</span>
              <Input v-model="form.email" type="email" :placeholder="t('email')" />
              <span v-if="errors.email" class="text-xs text-destructive">{{ errors.email }}</span>
            </label>
            <label class="grid gap-2 text-sm font-medium">
              <span class="flex items-center gap-1"><Briefcase class="size-3.5" />{{ t('jobTitle') }}</span>
              <Input v-model="form.jobTitle" type="text" :placeholder="t('jobTitle')" />
            </label>
            <label class="grid gap-2 text-sm font-medium">
              <span class="flex items-center gap-1"><Building2 class="size-3.5" />{{ t('company') }}</span>
              <Input v-model="form.company" type="text" :placeholder="t('company')" />
            </label>
            <label class="grid gap-2 text-sm font-medium">
              <span class="flex items-center gap-1"><MapPin class="size-3.5" />{{ t('locations') }}</span>
              <Input v-model="form.location" type="text" :placeholder="t('locations')" />
            </label>
            <div class="flex gap-2 pt-1">
              <Button type="submit"><Save class="size-4" />{{ t('saveChanges') }}</Button>
              <Button type="button" variant="outline" @click="resetForm">{{ t('resetDefaults') }}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle>{{ t('activitySummary') }}</CardTitle>
          <CardDescription>{{ t('recentActivity') }}</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-6">
          <div class="grid gap-3 sm:grid-cols-3">
            <RouterLink
              v-for="row in activityRows"
              :key="row.href"
              :to="row.href"
              class="rounded-lg border border-border p-4 transition-colors hover:bg-muted"
            >
              <component :is="row.icon" class="size-5 text-muted-foreground" />
              <div class="mt-3 text-2xl font-semibold tracking-tight">{{ row.value }}</div>
              <div class="text-sm text-muted-foreground">{{ row.label }}</div>
            </RouterLink>
          </div>

          <div>
            <div class="mb-2 flex items-center justify-between">
              <h3 class="text-sm font-medium">{{ t('recentOrders') }}</h3>
              <RouterLink
                to="/orders"
                class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                {{ t('viewAll') }} <ChevronRight class="size-3.5" />
              </RouterLink>
            </div>
            <div class="grid gap-2">
              <div
                v-for="order in recentOrders"
                :key="order.id"
                class="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm"
              >
                <div class="flex min-w-0 items-center gap-3">
                  <span class="shrink-0 font-medium tabular-nums">{{ order.id }}</span>
                  <span class="truncate text-muted-foreground">{{ order.customer }}</span>
                </div>
                <div class="flex shrink-0 items-center gap-3">
                  <span class="tabular-nums">${{ order.amount.toFixed(2) }}</span>
                  <Badge :variant="orderStatusTone(order.status)">{{ order.status }}</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 sm:grid-cols-3">
      <RouterLink
        v-for="link in preferenceLinks"
        :key="link.href"
        :to="link.href"
        class="group flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted"
      >
        <div class="min-w-0">
          <div class="text-sm font-medium">{{ link.title }}</div>
          <div class="truncate text-sm text-muted-foreground">{{ link.description }}</div>
        </div>
        <ChevronRight class="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </RouterLink>
    </div>
  </div>
</template>
