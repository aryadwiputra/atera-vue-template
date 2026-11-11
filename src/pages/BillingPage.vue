<script setup lang="ts">
import { Check } from '@lucide/vue'
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
import { cn } from '@/lib/utils'

const t = useTranslations()

const plans = [
  {
    name: 'Starter',
    price: '$49',
    description: 'For growing teams',
    features: ['3 team members', 'Basic analytics', 'Email support'],
  },
  {
    name: 'Pro',
    price: '$129',
    description: 'For scaling businesses',
    features: ['Unlimited members', 'Advanced analytics', 'Priority support'],
  },
  {
    name: 'Enterprise',
    price: '$599',
    description: 'For complex operations',
    features: ['Dedicated success manager', 'Custom reporting', 'SLA and SSO'],
  },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('billing')"
      :description="t('manageSubscriptionDescription')"
      :breadcrumbs="[{ title: t('dashboard'), href: '/dashboard' }, { title: t('billing'), href: '/billing' }]"
    />

    <div class="grid gap-4 md:grid-cols-3">
      <Card
        v-for="(plan, index) in plans"
        :key="plan.name"
        :class="cn(index === 1 && 'border-primary shadow-sm')"
      >
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>{{ plan.name }}</CardTitle>
            <Badge v-if="index === 1">{{ t('currentPlan') }}</Badge>
          </div>
          <CardDescription>{{ plan.description }}</CardDescription>
          <p class="pt-3 text-3xl font-semibold tabular-nums">
            {{ plan.price }}
            <span class="text-sm font-normal text-muted-foreground">/ {{ t('month') }}</span>
          </p>
        </CardHeader>
        <CardContent class="flex flex-col gap-3">
          <p
            v-for="feature in plan.features"
            :key="feature"
            class="flex items-center gap-2 text-sm"
          >
            <Check class="size-4 text-primary" />
            {{ feature }}
          </p>
        </CardContent>
        <CardFooter>
          <Button
            :variant="index === 1 ? 'default' : 'outline'"
            class="w-full"
          >
            {{ index === 1 ? t('managePlan') : t('choosePlan') }}
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
