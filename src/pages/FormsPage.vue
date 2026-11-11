<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

interface ContactValues {
  name: string
  email: string
  message: string
}

const t = useTranslations()
const { toast } = useToast()

const fileInput = ref<HTMLInputElement | null>(null)
const fileName = ref<string | null>(null)
const selectedOption = ref('')

const { values, errors, handleSubmit, resetForm } = useForm<ContactValues>({
  validationSchema: toTypedSchema(
    z.object({
      name: z.string().min(2, 'nameRequired'),
      email: z.string().email('invalidEmail'),
      message: z.string().min(10, 'messageRequired'),
    }),
  ),
  initialValues: { name: '', email: '', message: '' },
})

const onSubmit = handleSubmit(() => {
  toast({ title: t('validationPassed'), variant: 'success' })
  resetForm()
})

function errorText(error: unknown) {
  return error ? t(String(error)) : ''
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  fileName.value = input.files?.[0]?.name ?? null
}
</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <PageHeader :title="t('forms')" :description="t('formsDescription')" />

    <div class="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{{ t('inputVariants') }}</CardTitle>
        </CardHeader>
        <CardContent class="grid gap-4 sm:grid-cols-2">
          <label class="grid gap-2 text-sm font-medium">
            {{ t('text') }}
            <Input :placeholder="t('text')" />
          </label>
          <label class="grid gap-2 text-sm font-medium">
            {{ t('disabled') }}
            <Input disabled :placeholder="t('disabled')" />
          </label>
          <label class="grid gap-2 text-sm font-medium">
            {{ t('readOnly') }}
            <Input readonly value="Read only" />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{{ t('selectOption') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <label class="grid gap-2 text-sm font-medium">
            {{ t('selectOption') }}
            <Select v-model="selectedOption">
              <SelectTrigger>
                <SelectValue :placeholder="t('selectAnOption')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one">{{ t('optionOne') }}</SelectItem>
                <SelectItem value="two">{{ t('optionTwo') }}</SelectItem>
                <SelectItem value="three">{{ t('optionThree') }}</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{{ t('validation') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <form class="grid gap-4" @submit.prevent="onSubmit">
            <label class="grid gap-2 text-sm font-medium">
              {{ t('name') }}
              <Input v-model="values.name" :placeholder="t('name')" />
              <span v-if="errors.name" class="text-xs text-destructive">{{ errorText(errors.name) }}</span>
            </label>
            <label class="grid gap-2 text-sm font-medium">
              {{ t('email') }}
              <Input v-model="values.email" type="email" :placeholder="t('email')" />
              <span v-if="errors.email" class="text-xs text-destructive">{{ errorText(errors.email) }}</span>
            </label>
            <label class="grid gap-2 text-sm font-medium">
              {{ t('message') }}
              <Input v-model="values.message" :placeholder="t('message')" />
              <span v-if="errors.message" class="text-xs text-destructive">{{ errorText(errors.message) }}</span>
            </label>
            <Button type="submit">{{ t('submit') }}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{{ t('fileUpload') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground"
            @click="fileInput?.click()"
          >
            <p>{{ t('dragDropFile') }}</p>
            <p>{{ t('browse') }} — {{ fileName ?? t('noFileSelected') }}</p>
            <input ref="fileInput" type="file" class="hidden" @change="onFileChange" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
