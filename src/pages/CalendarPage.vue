<script setup lang="ts">
import { computed, ref } from 'vue'
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PageHeader from '@/components/shared/PageHeader.vue'
import { calendarService } from '@/services/calendar-service'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'

const t = useTranslations()
const events = calendarService.listEvents()
const currentMonth = ref(new Date())
const selectedDate = ref(new Date())

const format = (date: Date, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-US', options).format(date)
const toDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}
const startOfWeek = (date: Date) => {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  result.setDate(result.getDate() - result.getDay())
  return result
}
const endOfWeek = (date: Date) => {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  result.setDate(result.getDate() + (6 - result.getDay()))
  return result
}
const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)
const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)
const addMonths = (date: Date, amount: number) => new Date(date.getFullYear(), date.getMonth() + amount, 1)
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
const isSameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
const isToday = (date: Date) => isSameDay(date, new Date())
const eachDay = (start: Date, end: Date) => {
  const days: Date[] = []
  const cursor = new Date(start)
  while (cursor <= end) {
    days.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const days = computed(() => eachDay(startOfWeek(startOfMonth(currentMonth.value)), endOfWeek(endOfMonth(currentMonth.value))))
const dayEvents = (day: Date) => events.filter((event) => isSameDay(toDate(event.date), day))
const selectedEvents = computed(() => events.filter((event) => isSameDay(toDate(event.date), selectedDate.value)))

function prevMonth() {
  currentMonth.value = addMonths(currentMonth.value, -1)
}

function nextMonth() {
  currentMonth.value = addMonths(currentMonth.value, 1)
}

function goToday() {
  currentMonth.value = new Date()
  selectedDate.value = new Date()
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader :title="t('calendar')" description="Keep track of meetings and important milestones.">
      <template #actions>
        <Button size="sm">
          <Plus class="size-4" />
          New event
        </Button>
      </template>
    </PageHeader>

    <div class="grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(280px,1fr)]">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between">
          <CardTitle class="flex items-center gap-2">
            <CalendarDays class="size-5" />
            {{ format(currentMonth, { month: 'long', year: 'numeric' }) }}
          </CardTitle>
          <div class="flex gap-1">
            <Button variant="outline" size="icon" class="size-8" aria-label="Previous month" @click="prevMonth">
              <ChevronLeft class="size-4" />
            </Button>
            <Button variant="outline" size="sm" class="h-8" @click="goToday">
              Today
            </Button>
            <Button variant="outline" size="icon" class="size-8" aria-label="Next month" @click="nextMonth">
              <ChevronRight class="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent class="flex flex-col gap-1">
          <div class="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
            <div v-for="day in weekdays" :key="day" class="py-2">{{ day }}</div>
          </div>
          <div class="grid grid-cols-7 gap-1">
            <button
              v-for="day in days"
              :key="day.getTime()"
              type="button"
              :class="cn(
                'flex min-h-20 flex-col gap-1 rounded-lg border p-2 text-start text-sm transition-colors',
                !isSameMonth(day, currentMonth) && 'opacity-40',
                isToday(day) && 'border-primary font-semibold text-primary',
                isSameDay(day, selectedDate) && 'bg-muted',
              )"
              @click="selectedDate = day"
            >
              <span>{{ format(day, { day: 'numeric' }) }}</span>
              <span class="flex flex-wrap gap-0.5">
                <span
                  v-for="event in dayEvents(day).slice(0, 2)"
                  :key="event.id"
                  class="max-w-full truncate rounded bg-muted px-1 py-0.5 text-2xs font-normal text-muted-foreground"
                >
                  {{ event.title }}
                </span>
              </span>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{{ format(selectedDate, { weekday: 'long', month: 'long', day: 'numeric' }) }}</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-3">
          <p v-if="selectedEvents.length === 0" class="text-sm text-muted-foreground">No events on this day.</p>
          <div
            v-for="event in selectedEvents"
            :key="event.id"
            class="flex items-center justify-between gap-3 rounded-lg border p-3"
          >
            <div>
              <p class="text-sm font-medium">{{ event.title }}</p>
              <p class="text-xs text-muted-foreground">{{ event.time }}</p>
            </div>
            <Badge variant="secondary">{{ event.type }}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
