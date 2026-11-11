<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ArrowLeft, LoaderCircle } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslations } from '@/i18n'

const t = useTranslations()
const router = useRouter()
const digits = ref(['', '', '', '', '', ''])
const loading = ref(false)
const inputs = ref<HTMLInputElement[]>([])

const complete = computed(() => digits.value.every(Boolean))

function setInput(el: unknown, index: number) {
  if (el) inputs.value[index] = el as HTMLInputElement
}

function setDigit(index: number, raw: string) {
  const chars = raw.replace(/\D/g, '').split('')
  if (chars.length === 0) {
    digits.value[index] = ''
    return
  }
  const next = [...digits.value]
  for (const [offset, char] of chars.entries()) {
    if (index + offset > 5) break
    next[index + offset] = char
  }
  digits.value = next
  const target = Math.min(index + chars.length, 5)
  inputs.value[target]?.focus()
}

function onKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    inputs.value[index - 1]?.focus()
    return
  }
  if (event.key === 'ArrowLeft' && index > 0) inputs.value[index - 1]?.focus()
  if (event.key === 'ArrowRight' && index < 5) inputs.value[index + 1]?.focus()
}

function onPaste(event: ClipboardEvent) {
  event.preventDefault()
  setDigit(0, event.clipboardData?.getData('text') ?? '')
}

function onFocus(event: FocusEvent) {
  const target = event.target as HTMLInputElement
  target.select()
}

function onSubmit() {
  if (!complete.value) return
  loading.value = true
  setTimeout(() => router.push('/dashboard'), 300)
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">{{ t('twoFactor') }}</h1>
      <p class="mt-2 text-sm text-muted-foreground">{{ t('enterSixDigitCode') }}</p>
    </div>

    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <div class="flex justify-between gap-2" @paste="onPaste">
        <Input
          v-for="(digit, index) in digits"
          :key="index"
          :ref="(el) => setInput(el, index)"
          class="h-12 w-full text-center text-lg"
          inputmode="numeric"
          autocomplete="one-time-code"
          maxlength="1"
          :model-value="digit"
          @update:model-value="(value) => setDigit(index, String(value))"
          @keydown="(event: KeyboardEvent) => onKeydown(index, event)"
          @focus="onFocus"
        />
      </div>
      <Button type="submit" class="mt-2 w-full" :disabled="!complete || loading">
        <LoaderCircle v-if="loading" class="size-4 animate-spin" />
        {{ t('verifyCode') }}
      </Button>
    </form>

    <RouterLink
      to="/login"
      class="flex items-center justify-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
    >
      <ArrowLeft class="size-4" />
      {{ t('backToSignIn') }}
    </RouterLink>
  </div>
</template>
