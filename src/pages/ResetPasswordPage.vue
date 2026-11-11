<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft, CheckCircle2, Eye, EyeOff } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslations } from '@/i18n'

const t = useTranslations()
const form = ref({ password: '', confirm: '' })
const showPassword = ref(false)
const showConfirm = ref(false)
const saved = ref(false)
const error = ref('')

function onSubmit() {
  error.value = ''
  if (form.value.password.length < 8) {
    error.value = t('atLeast8Chars')
    return
  }
  if (form.value.password !== form.value.confirm) {
    error.value = t('passwordMismatch')
    return
  }
  saved.value = true
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">{{ t('resetPassword') }}</h1>
      <p class="mt-2 text-sm text-muted-foreground">{{ t('chooseNewPassword') }}</p>
    </div>

    <div v-if="saved" class="flex flex-col items-center gap-3 rounded-lg border p-6 text-center">
      <div class="text-primary">
        <CheckCircle2 class="size-8" />
      </div>
      <p class="font-semibold">{{ t('passwordUpdated') }}</p>
      <p class="text-sm text-muted-foreground">{{ t('passwordResetSuccess') }}</p>
    </div>

    <form v-else class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <div class="flex flex-col gap-2">
        <Label for="password" class="text-sm font-medium">{{ t('newPassword') }}</Label>
        <div class="relative">
          <Input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            class="pr-10"
            required
          />
          <button
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            :aria-label="showPassword ? t('hidePassword') : t('showPassword')"
            @click="showPassword = !showPassword"
          >
            <EyeOff v-if="showPassword" class="size-4" />
            <Eye v-else class="size-4" />
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <Label for="confirm" class="text-sm font-medium">{{ t('confirmPassword') }}</Label>
        <div class="relative">
          <Input
            id="confirm"
            v-model="form.confirm"
            :type="showConfirm ? 'text' : 'password'"
            autocomplete="new-password"
            class="pr-10"
            required
          />
          <button
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            :aria-label="showConfirm ? t('hidePassword') : t('showPassword')"
            @click="showConfirm = !showConfirm"
          >
            <EyeOff v-if="showConfirm" class="size-4" />
            <Eye v-else class="size-4" />
          </button>
        </div>
      </div>

      <p v-if="error" role="alert" class="text-sm text-destructive">{{ error }}</p>

      <Button type="submit" class="mt-2 w-full">{{ t('updatePassword') }}</Button>
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
