<script setup lang="ts">
import { Building2, MapPin, Users } from '@lucide/vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import PageHeader from '@/components/shared/PageHeader.vue'
import { useTranslations } from '@/i18n'

const t = useTranslations()

interface Branch {
  id: string
  name: string
  address: string
  city: string
  employees: number
  type: string
  lat: number
  lng: number
}

const BRANCHES: Branch[] = [
  {
    id: 'hq',
    name: 'Berlin Headquarters',
    address: 'Unter den Linden 21, 10117 Berlin, Germany',
    city: 'Berlin',
    employees: 482,
    type: 'HQ',
    lat: 52.517,
    lng: 13.389,
  },
  {
    id: 'munich',
    name: 'Munich Office',
    address: 'Marienplatz 8, 80331 Munich, Germany',
    city: 'Munich',
    employees: 213,
    type: 'Engineering',
    lat: 48.137,
    lng: 11.575,
  },
  {
    id: 'hamburg',
    name: 'Hamburg Branch',
    address: 'Mönckebergstraße 17, 20095 Hamburg, Germany',
    city: 'Hamburg',
    employees: 156,
    type: 'Sales',
    lat: 53.551,
    lng: 9.994,
  },
  {
    id: 'cologne',
    name: 'Cologne Branch',
    address: 'Hohenzollernring 52, 50672 Cologne, Germany',
    city: 'Cologne',
    employees: 98,
    type: 'Support',
    lat: 50.938,
    lng: 6.96,
  },
  {
    id: 'frankfurt',
    name: 'Frankfurt Branch',
    address: 'Neue Mainzer Straße 66, 60311 Frankfurt, Germany',
    city: 'Frankfurt',
    employees: 127,
    type: 'Finance',
    lat: 50.111,
    lng: 8.682,
  },
  {
    id: 'dresden',
    name: 'Dresden Branch',
    address: 'Prager Straße 15, 01069 Dresden, Germany',
    city: 'Dresden',
    employees: 61,
    type: 'Design',
    lat: 51.053,
    lng: 13.74,
  },
]

const LAT_MIN = 47
const LAT_MAX = 55
const LNG_MIN = 6
const LNG_MAX = 14.5

function markerStyle(branch: Branch) {
  const x = ((branch.lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 100
  const y = ((LAT_MAX - branch.lat) / (LAT_MAX - LAT_MIN)) * 100
  return { left: `${x}%`, top: `${y}%` }
}
</script>

<template>
  <main class="flex min-h-full flex-col gap-6 p-4 md:p-6">
    <PageHeader :title="t('maps')" :description="t('mapsDescription')" />

    <div class="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <Card class="overflow-hidden">
        <CardHeader>
          <CardTitle>{{ t('officeLocations') }}</CardTitle>
          <CardDescription>{{ t('officeLocationsDescription') }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            class="relative h-[480px] overflow-hidden rounded-lg border bg-muted/30"
            :style="{
              backgroundImage:
                'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }"
          >
            <div
              class="pointer-events-none absolute inset-0"
              :style="{
                backgroundImage:
                  'radial-gradient(ellipse at 45% 40%, color-mix(in oklch, var(--chart-1) 16%, transparent), transparent 60%)',
              }"
            />
            <div
              v-for="branch in BRANCHES"
              :key="branch.id"
              class="group absolute -translate-x-1/2 -translate-y-full"
              :style="markerStyle(branch)"
            >
              <span class="flex flex-col items-center gap-1">
                <span
                  class="flex items-center justify-center rounded-full bg-primary px-2 py-1 text-primary-foreground shadow-sm transition-transform group-hover:scale-110"
                >
                  <MapPin class="size-3.5" />
                </span>
                <span
                  class="absolute bottom-full mb-8 hidden whitespace-nowrap rounded-md border bg-popover px-2 py-1 text-xs shadow-sm group-hover:block"
                >
                  {{ branch.name }}
                </span>
              </span>
              <span class="mx-auto mt-1 block size-1.5 rounded-full bg-primary/30" />
            </div>
            <div class="absolute bottom-3 left-3 rounded-md border bg-card/80 px-2 py-1 text-[11px] text-muted-foreground backdrop-blur">
              {{ t('officeLocationsDescription') }}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{{ t('locations') }}</CardTitle>
          <CardDescription>{{ t('locationsDescription') }}</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col">
          <div v-for="(branch, index) in BRANCHES" :key="branch.id">
            <Separator v-if="index > 0" class="my-3" />
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-3">
                <div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Building2 class="size-4 text-muted-foreground" />
                </div>
                <div class="flex flex-col gap-1">
                  <p class="text-sm font-medium leading-none">{{ branch.name }}</p>
                  <div class="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-muted-foreground">
                    <span class="flex items-center gap-1">
                      <MapPin class="size-3" />
                      {{ t('city') }}: {{ branch.city }}
                    </span>
                    <span class="flex items-center gap-1">
                      <Users class="size-3" />
                      {{ t('employees') }}: {{ branch.employees }}
                    </span>
                  </div>
                </div>
              </div>
              <Badge variant="secondary">{{ branch.type }}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </main>
</template>
