<script setup lang="ts">
import { CheckCircle2, FolderKanban, ListChecks, Users } from '@lucide/vue'
import ChartCard from '@/components/charts/ChartCard.vue'
import ChartBar from '@/components/charts/ChartBar.vue'
import StatCard from '@/components/shared/StatCard.vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'

const t = useTranslations()

const taskCompletion = [
  { name: 'Mon', value: 18 },
  { name: 'Tue', value: 26 },
  { name: 'Wed', value: 31 },
  { name: 'Thu', value: 22 },
  { name: 'Fri', value: 15 },
  { name: 'Sat', value: 8 },
  { name: 'Sun', value: 6 },
]

type ProjectStatus = 'onTrack' | 'atRisk' | 'delayed'

const projects: Array<{
  name: string
  progress: number
  team: string[]
  dueDate: string
  status: ProjectStatus
}> = [
  {
    name: 'Website Redesign',
    progress: 82,
    team: ['AK', 'JD', 'MS'],
    dueDate: 'Nov 18, 2026',
    status: 'onTrack',
  },
  {
    name: 'Mobile App v2',
    progress: 47,
    team: ['RB', 'TD', 'AK', 'JL'],
    dueDate: 'Dec 01, 2026',
    status: 'atRisk',
  },
  {
    name: 'API Migration',
    progress: 93,
    team: ['MS', 'JD'],
    dueDate: 'Nov 12, 2026',
    status: 'onTrack',
  },
  {
    name: 'Customer Portal',
    progress: 34,
    team: ['RB', 'AK', 'JL'],
    dueDate: 'Dec 15, 2026',
    status: 'delayed',
  },
  {
    name: 'Marketing Site',
    progress: 100,
    team: ['TD', 'MS'],
    dueDate: 'Oct 30, 2026',
    status: 'onTrack',
  },
]

const statusStyles: Record<ProjectStatus, string> = {
  onTrack: 'bg-status-success/15 text-status-success',
  atRisk: 'bg-status-warning/15 text-status-warning',
  delayed: 'bg-status-danger/15 text-status-danger',
}

function statusLabel(status: ProjectStatus) {
  if (status === 'onTrack') return t('onTrack')
  if (status === 'atRisk') return t('atRisk')
  return t('delayed')
}

function initialsColor(index: number) {
  const colors = [
    'bg-chart-1/20 text-chart-1',
    'bg-chart-2/20 text-chart-2',
    'bg-chart-3/20 text-chart-3',
    'bg-chart-4/20 text-chart-4',
    'bg-chart-5/20 text-chart-5',
  ]
  return colors[index % colors.length]
}
</script>

<template>
  <main class="flex min-h-full flex-col gap-6 p-4 md:p-6">
    <PageHeader :title="t('projectManagement')" :description="t('projectManagementDescription')" />

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard :title="t('activeProjects')" value="12" change="+2" :icon="FolderKanban" />
      <StatCard :title="t('totalTasks')" value="148" change="+24" :icon="ListChecks" />
      <StatCard :title="t('completedTasks')" value="96" change="+18" :icon="CheckCircle2" />
      <StatCard :title="t('teamMembers')" value="8" change="+1" :icon="Users" />
    </div>

    <ChartCard :title="t('taskCompletion')" :description="t('taskCompletionDescription')">
      <ChartBar :data="taskCompletion" data-key="value" x-key="name" />
    </ChartCard>

    <Card class="gap-4 shadow-none">
      <CardHeader>
        <CardTitle>{{ t('projects') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b text-left text-muted-foreground">
                <th class="px-2 py-3 font-medium">{{ t('project') }}</th>
                <th class="px-2 py-3 font-medium">{{ t('progress') }}</th>
                <th class="px-2 py-3 font-medium">{{ t('team') }}</th>
                <th class="px-2 py-3 font-medium">{{ t('dueDate') }}</th>
                <th class="px-2 py-3 font-medium">{{ t('status') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in projects" :key="project.name" class="border-b last:border-0">
                <td class="px-2 py-3 font-medium">{{ project.name }}</td>
                <td class="px-2 py-3">
                  <div class="flex items-center gap-2">
                    <div class="h-2 w-24 overflow-hidden rounded-full bg-muted">
                      <div class="h-full rounded-full bg-primary" :style="{ width: `${project.progress}%` }" />
                    </div>
                    <span class="text-xs text-muted-foreground">{{ project.progress }}%</span>
                  </div>
                </td>
                <td class="px-2 py-3">
                  <div class="flex -space-x-2">
                    <span
                      v-for="(member, index) in project.team"
                      :key="member"
                      :class="cn(
                        'flex size-7 items-center justify-center rounded-full border-2 border-background text-2xs font-semibold',
                        initialsColor(index),
                      )"
                    >
                      {{ member }}
                    </span>
                  </div>
                </td>
                <td class="px-2 py-3">{{ project.dueDate }}</td>
                <td class="px-2 py-3">
                  <Badge variant="outline" :class="statusStyles[project.status]">
                    {{ statusLabel(project.status) }}
                  </Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </main>
</template>
