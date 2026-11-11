<script setup lang="ts">
import { CreditCard } from '@lucide/vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PageHeader from '@/components/shared/PageHeader.vue'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/i18n'

const t = useTranslations()
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('billing')"
      :description="t('billingSettingsDescription')"
      :breadcrumbs="[
        { title: t('dashboard'), href: '/dashboard' },
        { title: t('settings'), href: '/settings' },
        { title: t('billing'), href: '/settings/billing' },
      ]"
    />

    <Card class="max-w-xl">
      <CardHeader>
        <CardTitle>{{ t('currentPlan') }}</CardTitle>
      </CardHeader>
      <CardContent class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-md bg-muted">
            <CreditCard class="size-5" />
          </div>
          <div>
            <p class="text-sm font-medium">Pro</p>
            <p class="text-xs text-muted-foreground">{{ t('billedMonthly') }}</p>
          </div>
        </div>
        <Button variant="outline" as-child>
          <RouterLink to="/pricing">{{ t('upgrade') }}</RouterLink>
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
