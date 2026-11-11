<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import PageHeader from '@/components/shared/PageHeader.vue'
import { kanbanService } from '@/services/kanban-service'
import type { KanbanTask } from '@/lib/data/kanban'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'

const t = useTranslations()
const tasks = ref<KanbanTask[]>(kanbanService.listTasks())

const priorityColor = {
  high: 'bg-destructive/15 text-destructive',
  medium: 'bg-muted text-muted-foreground',
  low: 'bg-muted/50 text-muted-foreground',
} as const

const priorityLabel = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
} as const

function columnTasks(columnId: string) {
  return tasks.value.filter((task) => task.columnId === columnId)
}

function move(taskId: string, columnId: string) {
  kanbanService.moveTask(taskId, columnId)
  tasks.value = kanbanService.listTasks()
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('kanban')"
      description="Plan work and keep the team moving."
      :breadcrumbs="[{ title: t('dashboard'), href: '/dashboard' }, { title: t('kanban'), href: '/kanban' }]"
    >
      <template #actions>
        <Button size="sm">
          <Plus class="size-4" />
          Add task
        </Button>
      </template>
    </PageHeader>

    <div class="grid gap-4 md:grid-cols-3">
      <Card v-for="column in kanbanService.columns" :key="column.id" class="flex flex-col">
        <CardContent class="flex flex-1 flex-col gap-4 p-5">
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">{{ column.title }}</h2>
            <Badge variant="secondary">{{ columnTasks(column.id).length }}</Badge>
          </div>
          <div class="flex flex-col gap-3">
            <div
              v-for="task in columnTasks(column.id)"
              :key="task.id"
              class="rounded-lg border bg-background p-4 transition-colors hover:border-foreground/20"
            >
              <div class="flex items-start justify-between gap-2">
                <p class="text-sm font-medium leading-snug">{{ task.title }}</p>
                <Badge variant="outline" :class="cn('shrink-0 text-2xs', priorityColor[task.priority])">
                  {{ priorityLabel[task.priority] }}
                </Badge>
              </div>
              <p class="mt-2 text-xs text-muted-foreground">{{ task.assignee }}</p>
              <div class="mt-3 flex gap-1">
                <button
                  v-for="col in kanbanService.columns.filter((c) => c.id !== task.columnId)"
                  :key="col.id"
                  type="button"
                  :title="col.title"
                  class="rounded border px-1.5 py-0.5 text-2xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  @click="move(task.id, col.id)"
                >
                  {{ col.title }} →
                </button>
              </div>
            </div>
            <div
              v-if="columnTasks(column.id).length === 0"
              class="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground"
            >
              Drag cards here
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
