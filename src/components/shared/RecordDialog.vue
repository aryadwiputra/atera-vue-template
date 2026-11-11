<script setup lang="ts">
import { computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface RecordField {
  key: string
  label: string
  type?: 'text' | 'email' | 'number' | 'date' | 'select'
  options?: string[]
  placeholder?: string
  required?: boolean
}

const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    fields: RecordField[]
    initial?: Record<string, string>
    submitLabel?: string
    cancelLabel?: string
  }>(),
  { submitLabel: 'Create', cancelLabel: 'Cancel' },
)

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ submit: [values: Record<string, string>] }>()

function fieldSchema(field: RecordField) {
  const optional = field.required === false
  if (field.type === 'email') {
    const base = z.string()
    return optional
      ? base.refine((value) => value === '' || z.string().email().safeParse(value).success, 'Enter a valid email address')
      : base.min(1, 'This field is required').email('Enter a valid email address')
  }
  if (field.type === 'number') {
    const numeric = (value: string) => value === '' || (value.trim() !== '' && !Number.isNaN(Number(value)))
    const base = z.string()
    return optional
      ? base.refine(numeric, 'Enter a number')
      : base.min(1, 'This field is required').refine(numeric, 'Enter a number')
  }
  return optional ? z.string() : z.string().min(1, 'This field is required')
}

const schema = computed(() =>
  toTypedSchema(
    z.object(
      Object.fromEntries(props.fields.map((field) => [field.key, fieldSchema(field)])) as Record<string, z.ZodTypeAny>,
    ),
  ),
)

function buildValues(): Record<string, string> {
  const result: Record<string, string> = {}
  for (const field of props.fields) {
    const initial = props.initial?.[field.key]
    result[field.key] = initial ?? (field.type === 'select' ? (field.options?.[0] ?? '') : '')
  }
  return result
}

const { values, errors, handleSubmit, resetForm, setFieldValue } = useForm<Record<string, string>>({
  validationSchema: schema,
  initialValues: buildValues(),
})

watch(open, (isOpen) => {
  if (isOpen) resetForm({ values: buildValues() })
})

const onSubmit = handleSubmit((formValues) => {
  emit('submit', { ...formValues })
  open.value = false
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription v-if="description">{{ description }}</DialogDescription>
      </DialogHeader>

      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <div v-for="field in fields" :key="field.key" class="flex flex-col gap-2">
          <Label :for="field.key" class="text-sm font-medium">{{ field.label }}</Label>

          <Select
            v-if="field.type === 'select'"
            :model-value="values[field.key]"
            @update:model-value="(value) => setFieldValue(field.key, String(value ?? ''))"
          >
            <SelectTrigger :id="field.key" class="w-full" :aria-invalid="Boolean(errors[field.key])">
              <SelectValue :placeholder="field.placeholder ?? field.label" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in field.options" :key="option" :value="option">
                {{ option }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Input
            v-else
            :id="field.key"
            :model-value="values[field.key]"
            :type="field.type ?? 'text'"
            @update:model-value="(value) => setFieldValue(field.key, String(value ?? ''))"
            :placeholder="field.placeholder"
            :aria-invalid="Boolean(errors[field.key])"
          />

          <p v-if="errors[field.key]" class="text-xs text-destructive">{{ errors[field.key] }}</p>
        </div>

        <DialogFooter class="mt-2">
          <Button type="button" variant="outline" @click="open = false">{{ cancelLabel }}</Button>
          <Button type="submit">{{ submitLabel }}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
