<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, TrendingUp } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import PageHeader from '@/components/shared/PageHeader.vue'
import StatCard from '@/components/shared/StatCard.vue'
import { crmService } from '@/services/crm-service'
import type { Deal, DealStage } from '@/lib/data/types'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'

const t = useTranslations()

const DAY_MS = 24 * 60 * 60 * 1000

const deals = ref<Deal[]>(crmService.listDeals())
const open = ref(false)
const form = ref({
  company: '',
  contact: '',
  email: '',
  value: 0,
  stage: 'new' as DealStage,
  owner: '',
})

const formatCurrency = (value: number) =>
  value >= 1000 ? `$${Math.round(value / 100) / 10}k` : `$${value}`

const initials = (name: string) =>
  name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()

const daysAgo = (iso: string) =>
  Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / DAY_MS))

function stageLabel(stage: DealStage) {
  if (stage === 'new') return t('stageNew')
  if (stage === 'contacted') return t('stageContacted')
  if (stage === 'qualified') return t('stageQualified')
  if (stage === 'won') return t('stageWon')
  return t('stageLost')
}

function formatAge(days: number) {
  if (days === 0) return t('ageToday')
  if (days === 1) return t('ageDaysOne')
  return t('ageDays').replace('{n}', String(days))
}

const stageAccent = {
  new: 'bg-muted-foreground/50',
  contacted: 'bg-info',
  qualified: 'bg-primary',
  won: 'bg-success',
  lost: 'bg-destructive',
} as const

const summary = computed(() => {
  const openDeals = deals.value.filter((deal) => deal.stage !== 'won' && deal.stage !== 'lost')
  const won = deals.value.filter((deal) => deal.stage === 'won')
  const closed = deals.value.filter((deal) => deal.stage === 'won' || deal.stage === 'lost')
  const pipelineValue = openDeals.reduce((total, deal) => total + deal.value, 0)
  const winRate = closed.length > 0 ? Math.round((won.length / closed.length) * 100) : 0
  const thisMonth = deals.value.filter((deal) => daysAgo(deal.createdAt) <= 30).length
  const avg = openDeals.length > 0 ? Math.round(pipelineValue / openDeals.length) : 0
  return { pipelineValue, winRate, thisMonth, avg }
})

function handleMove(dealId: string, stage: DealStage) {
  crmService.moveDeal(dealId, stage)
  deals.value = crmService.listDeals()
}

function handleCreate() {
  crmService.createDeal({
    company: form.value.company.trim(),
    contact: form.value.contact.trim(),
    email: form.value.email.trim(),
    value: Number(form.value.value) || 0,
    stage: form.value.stage,
    owner: form.value.owner.trim(),
    createdAt: new Date().toISOString().slice(0, 10),
  })
  deals.value = crmService.listDeals()
  open.value = false
  form.value = { company: '', contact: '', email: '', value: 0, stage: 'new', owner: '' }
}
</script>

<template>
  <main class="flex min-h-full flex-col gap-6 p-4 md:p-6">
    <PageHeader
      :breadcrumbs="[{ title: t('crm'), href: '/crm' }, { title: t('pipelineBoard'), href: '/pipeline' }]"
      :title="t('pipelineBoard')"
      :description="t('pipelineBoardDescription')"
    >
      <template #actions>
        <Button size="sm" @click="open = true">
          <Plus class="size-4" />
          {{ t('addDeal') }}
        </Button>
      </template>
    </PageHeader>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        :title="t('pipelineValue')"
        :value="`$${Math.round(summary.pipelineValue / 1000)}k`"
        change="+8.4%"
        :description="t('openDeals')"
        :icon="TrendingUp"
      />
      <StatCard
        :title="t('winRate')"
        :value="`${summary.winRate}%`"
        change="+2.1%"
        :description="t('dealsWon')"
      />
      <StatCard
        :title="t('dealsThisMonth')"
        :value="`${summary.thisMonth}`"
        change="+12.5%"
        :description="t('createdRecently')"
      />
      <StatCard
        :title="t('avgDealValue')"
        :value="formatCurrency(summary.avg)"
        change="+3.2%"
        :description="t('perOpenDeal')"
      />
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <Card v-for="stage in crmService.stages" :key="stage.id" class="flex flex-col">
        <CardContent class="flex flex-1 flex-col gap-4 p-5">
          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span :class="cn('size-2 rounded-full', stageAccent[stage.id])" />
                <h2 class="font-semibold">{{ stageLabel(stage.id) }}</h2>
              </div>
              <Badge variant="secondary">
                {{ deals.filter((deal) => deal.stage === stage.id).length }}
              </Badge>
            </div>
            <p class="text-xs text-muted-foreground">
              {{ formatCurrency(deals.filter((deal) => deal.stage === stage.id).reduce((total, deal) => total + deal.value, 0)) }}
              {{ t('inStage') }}
            </p>
          </div>
          <div class="flex flex-col gap-3">
            <div
              v-for="deal in deals.filter((d) => d.stage === stage.id)"
              :key="deal.id"
              class="rounded-lg border bg-background p-4"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold leading-snug">{{ deal.company }}</p>
                  <p class="mt-0.5 truncate text-xs text-muted-foreground">{{ deal.contact }}</p>
                </div>
                <Badge variant="outline" class="shrink-0 text-xs font-semibold tabular-nums">
                  {{ formatCurrency(deal.value) }}
                </Badge>
              </div>
              <div class="mt-3 flex items-center justify-between gap-2">
                <div class="flex min-w-0 items-center gap-2">
                  <Avatar class="size-6">
                    <AvatarFallback class="text-2xs font-medium">{{ initials(deal.owner) }}</AvatarFallback>
                  </Avatar>
                  <span class="truncate text-xs text-muted-foreground">{{ deal.owner }}</span>
                </div>
                <span class="shrink-0 text-2xs text-muted-foreground">{{ formatAge(daysAgo(deal.createdAt)) }}</span>
              </div>
              <div class="mt-3 flex flex-wrap gap-1">
                <button
                  v-for="col in crmService.stages.filter((c) => c.id !== deal.stage)"
                  :key="col.id"
                  type="button"
                  :title="`${t('moveTo')} ${stageLabel(col.id)}`"
                  class="rounded border px-1.5 py-0.5 text-2xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  @click="handleMove(deal.id, col.id)"
                >
                  {{ stageLabel(col.id) }} →
                </button>
              </div>
            </div>
            <div
              v-if="deals.filter((d) => d.stage === stage.id).length === 0"
              class="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground"
            >
              {{ t('dragHere') }}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Dialog v-model:open="open">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ t('addDeal') }}</DialogTitle>
          <DialogDescription>{{ t('addDealDescription') }}</DialogDescription>
        </DialogHeader>
        <form class="grid gap-4" @submit.prevent="handleCreate">
          <div class="flex flex-col gap-1.5">
            <Label for="deal-company" class="text-sm font-medium">{{ t('company') }}</Label>
            <Input id="deal-company" v-model="form.company" required placeholder="Acme Corp" />
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-1.5">
              <Label for="deal-contact" class="text-sm font-medium">{{ t('contact') }}</Label>
              <Input id="deal-contact" v-model="form.contact" required placeholder="Jane Doe" />
            </div>
            <div class="flex flex-col gap-1.5">
              <Label for="deal-email" class="text-sm font-medium">{{ t('email') }}</Label>
              <Input id="deal-email" v-model="form.email" type="email" placeholder="jane@acme.com" />
            </div>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-1.5">
              <Label for="deal-value" class="text-sm font-medium">{{ t('dealValue') }}</Label>
              <Input id="deal-value" v-model.number="form.value" type="number" min="0" step="100" required placeholder="12000" />
            </div>
            <div class="flex flex-col gap-1.5">
              <Label for="deal-owner" class="text-sm font-medium">{{ t('owner') }}</Label>
              <Input id="deal-owner" v-model="form.owner" required placeholder="Avery Morgan" />
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <Label for="deal-stage" class="text-sm font-medium">{{ t('stage') }}</Label>
            <Select v-model="form.stage">
              <SelectTrigger id="deal-stage" class="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="stage in crmService.stages" :key="stage.id" :value="stage.id">
                  {{ stageLabel(stage.id) }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" @click="open = false">{{ t('cancel') }}</Button>
            <Button type="submit">{{ t('createDeal') }}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </main>
</template>
