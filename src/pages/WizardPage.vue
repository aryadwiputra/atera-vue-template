<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Check } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import PageHeader from '@/components/shared/PageHeader.vue'
import { useTranslations } from '@/i18n'
import { useToast } from '@/composables/use-toast'
import { cn } from '@/lib/utils'

type ProjectType = 'Web App' | 'Mobile' | 'Desktop'
type Visibility = 'Public' | 'Private'

const t = useTranslations()
const { toast } = useToast()

const step = ref(1)
const form = reactive({
  projectName: '',
  projectType: 'Web App' as ProjectType,
  inviteEmails: '',
  visibility: 'Private' as Visibility,
  notificationsEnabled: true,
})
const errors = reactive({ projectName: false, inviteEmails: false })

const projectTypes: ProjectType[] = ['Web App', 'Mobile', 'Desktop']
const visibilities: Visibility[] = ['Public', 'Private']

const summaryRows = computed(() => [
  { label: t('projectName'), value: form.projectName },
  { label: t('projectType'), value: form.projectType },
  { label: t('inviteTeam'), value: form.inviteEmails },
  {
    label: t('preferences'),
    value: `${form.visibility === 'Public' ? t('public') : t('private')} · ${form.notificationsEnabled ? t('notificationsEnabled') : ''}`,
  },
])

const stepTitle = computed(() =>
  step.value === 1
    ? t('projectDetails')
    : step.value === 2
      ? t('teamSetup')
      : step.value === 3
        ? t('preferences')
        : t('review'),
)

function validateStep(current: number) {
  if (current === 1) {
    errors.projectName = form.projectName.length === 0
    return !errors.projectName
  }
  if (current === 2) {
    errors.inviteEmails = !form.inviteEmails.split(',').some((item) => item.trim().length > 0)
    return !errors.inviteEmails
  }
  return true
}

function goToStep(target: number) {
  if (target > step.value && !validateStep(step.value)) return
  step.value = target
}

function startOver() {
  form.projectName = ''
  form.projectType = 'Web App'
  form.inviteEmails = ''
  form.visibility = 'Private'
  form.notificationsEnabled = true
  errors.projectName = false
  errors.inviteEmails = false
  step.value = 1
}

function finish() {
  toast({ title: t('projectSetup'), description: form.projectName, variant: 'success' })
  startOver()
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-3xl flex-col gap-6">
    <PageHeader :title="t('wizardTitle')" :description="t('projectSetupDescription')" />

    <Card>
      <CardHeader>
        <div class="flex items-center gap-2">
          <div
            v-for="item in [1, 2, 3, 4]"
            :key="item"
            :class="cn(
              'flex size-8 items-center justify-center rounded-full text-sm transition-colors',
              step >= item ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
            )"
          >
            <Check v-if="step > item" class="size-4" />
            <template v-else>{{ item }}</template>
          </div>
        </div>
        <CardTitle class="pt-4">{{ stepTitle }}</CardTitle>
      </CardHeader>

      <CardContent class="flex flex-col gap-4">
        <div v-if="step === 1" class="grid gap-2">
          <label class="text-sm font-medium">{{ t('projectName') }}</label>
          <Input v-model="form.projectName" :placeholder="t('projectName')" />
          <p v-if="errors.projectName" class="text-xs text-destructive">{{ t('projectName') }}</p>
          <label class="text-sm font-medium">{{ t('projectType') }}</label>
          <Select v-model="form.projectType">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="item in projectTypes" :key="item" :value="item">
                {{ item }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div v-if="step === 2" class="grid gap-2">
          <label class="text-sm font-medium">{{ t('inviteTeam') }}</label>
          <Input v-model="form.inviteEmails" placeholder="a@x.com, b@x.com" />
          <p v-if="errors.inviteEmails" class="text-xs text-destructive">{{ t('inviteTeam') }}</p>
        </div>

        <div v-if="step === 3" class="grid gap-2">
          <label class="text-sm font-medium">{{ t('public') }} / {{ t('private') }}</label>
          <Select v-model="form.visibility">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="item in visibilities" :key="item" :value="item">
                {{ item === 'Public' ? t('public') : t('private') }}
              </SelectItem>
            </SelectContent>
          </Select>
          <div class="flex items-center gap-2">
            <Checkbox id="notificationsEnabled" v-model="form.notificationsEnabled" />
            <label for="notificationsEnabled" class="text-sm font-medium">
              {{ t('notificationsEnabled') }}
            </label>
          </div>
        </div>

        <div v-if="step === 4" class="flex flex-col gap-3">
          <div v-for="row in summaryRows" :key="row.label" class="rounded-lg border p-3">
            <p class="text-xs text-muted-foreground">{{ row.label }}</p>
            <p class="text-sm font-medium">{{ row.value }}</p>
          </div>
        </div>

        <div class="flex gap-2 pt-2">
          <Button v-if="step > 1" variant="outline" @click="step = step - 1">
            {{ t('back') }}
          </Button>
          <Button v-if="step < 4" @click="goToStep(step + 1)">{{ t('nextStep') }}</Button>
          <Button v-else @click="finish">{{ t('finish') }}</Button>
          <Button variant="ghost" @click="startOver">{{ t('startOver') }}</Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
