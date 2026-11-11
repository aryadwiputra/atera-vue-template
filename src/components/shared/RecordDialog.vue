<script setup lang="ts">
import { reactive, watch } from 'vue'
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
    submitLabel?: string
    cancelLabel?: string
  }>(),
  { submitLabel: 'Create', cancelLabel: 'Cancel' },
)

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ submit: [values: Record<string, string>] }>()

const values = reactive<Record<string, string>>({})

function reset() {
  for (const key of Object.keys(values)) delete values[key]
  for (const field of props.fields) {
    values[field.key] = field.type === 'select' ? (field.options?.[0] ?? '') : ''
  }
}

watch(open, (isOpen) => {
  if (isOpen) reset()
})

function onSubmit() {
  const missing = props.fields.some((field) => field.required !== false && !values[field.key])
  if (missing) return
  emit('submit', { ...values })
  open.value = false
}
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

          <Select v-if="field.type === 'select'" v-model="values[field.key]">
            <SelectTrigger :id="field.key" class="w-full">
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
            v-model="values[field.key]"
            :type="field.type ?? 'text'"
            :placeholder="field.placeholder"
            :required="field.required !== false"
          />
        </div>

        <DialogFooter class="mt-2">
          <Button type="button" variant="outline" @click="open = false">{{ cancelLabel }}</Button>
          <Button type="submit">{{ submitLabel }}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
