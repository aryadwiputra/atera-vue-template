<script setup lang="ts">
import { BadgeCheck } from '@lucide/vue'
import { ref } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import PageHeader from '@/components/shared/PageHeader.vue'
import { useTranslations } from '@/i18n'

const t = useTranslations()

const annual = ref(true)

const plans = [
  {
    name: 'Starter',
    monthly: 49,
    yearly: 490,
    description: 'For growing teams',
    features: ['3 team members', 'Basic analytics', 'Email support'],
  },
  {
    name: 'Pro',
    monthly: 129,
    yearly: 1290,
    description: 'For scaling businesses',
    features: ['Unlimited members', 'Advanced analytics', 'Priority support'],
  },
  {
    name: 'Enterprise',
    monthly: 599,
    yearly: 5990,
    description: 'For complex operations',
    features: ['Dedicated success manager', 'Custom reporting', 'SLA and SSO'],
  },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('pricing')"
      :description="t('pricingDescription')"
      :breadcrumbs="[{ title: t('dashboard'), href: '/dashboard' }, { title: t('pricing'), href: '/pricing' }]"
    />

    <div class="flex justify-center gap-2">
      <Button :variant="annual ? 'default' : 'outline'" @click="annual = true">
        {{ t('yearly') }}
      </Button>
      <Button :variant="annual ? 'outline' : 'default'" @click="annual = false">
        {{ t('monthly') }}
      </Button>
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <Card v-for="plan in plans" :key="plan.name">
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>{{ plan.name }}</CardTitle>
            <Badge v-if="plan.name === 'Pro'">{{ t('popular') }}</Badge>
          </div>
          <CardDescription>{{ plan.description }}</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <p>
            <span class="text-4xl font-bold">${{ annual ? Math.round(plan.yearly / 12) : plan.monthly }}</span>
            <span class="text-sm text-muted-foreground">/{{ t('month') }}</span>
          </p>
          <div class="flex flex-col gap-2">
            <div v-for="feature in plan.features" :key="feature" class="flex items-center gap-2">
              <BadgeCheck class="size-4 text-primary" />
              <span class="text-sm">{{ feature }}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            class="w-full"
            :variant="plan.name === 'Pro' ? 'default' : 'outline'"
          >
            {{ t('choosePlanNamed', { name: plan.name }) }}
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
