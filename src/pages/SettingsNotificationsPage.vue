<script setup lang="ts">
import { computed, reactive } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import PageHeader from '@/components/shared/PageHeader.vue'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/i18n'

const t = useTranslations()

const enabled = reactive<Record<string, boolean>>({
  orders: true,
  reports: true,
  news: false,
})

const items = computed(() => [
  { id: 'orders', label: t('orderUpdates'), description: t('orderUpdatesDescription') },
  { id: 'reports', label: t('weeklyReport'), description: t('weeklyReportsDescription') },
  { id: 'news', label: t('productNews'), description: t('productNewsDescription') },
])
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('notifications')"
      :description="t('notificationsSettingsDescription')"
      :breadcrumbs="[
        { title: t('dashboard'), href: '/dashboard' },
        { title: t('settings'), href: '/settings' },
        { title: t('notifications'), href: '/settings/notifications' },
      ]"
    />

    <Card class="max-w-xl">
      <CardHeader>
        <CardTitle>{{ t('emailNotifications') }}</CardTitle>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <div
          v-for="item in items"
          :key="item.id"
          class="flex items-center justify-between gap-4"
        >
          <div>
            <p class="text-sm font-medium">{{ item.label }}</p>
            <p class="text-xs text-muted-foreground">{{ item.description }}</p>
          </div>
          <Checkbox v-model="enabled[item.id]" />
        </div>
        <Button variant="outline" class="w-fit">{{ t('saveChanges') }}</Button>
      </CardContent>
    </Card>
  </div>
</template>
