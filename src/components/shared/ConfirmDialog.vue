<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const open = defineModel<boolean>('open', { default: false })

withDefaults(
  defineProps<{
    title: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
  }>(),
  { confirmLabel: 'Confirm', cancelLabel: 'Cancel' },
)

const emit = defineEmits<{ confirm: [] }>()

function confirm() {
  emit('confirm')
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
      <DialogFooter>
        <Button variant="outline" @click="open = false">{{ cancelLabel }}</Button>
        <Button variant="destructive" @click="confirm">{{ confirmLabel }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
