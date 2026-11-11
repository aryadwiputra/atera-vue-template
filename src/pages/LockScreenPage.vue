<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ArrowLeft, Eye, EyeOff, LoaderCircle, LockKeyhole } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/auth'
import { useTranslations } from '@/i18n'

const auth = useAuthStore()
const router = useRouter()
const t = useTranslations()

const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 300))
  const result = auth.signIn(auth.session?.email ?? '', password.value)
  loading.value = false
  if (!result.ok) {
    error.value = t(result.message)
    return
  }
  router.push('/dashboard')
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">{{ t('welcomeBack') }}</h1>
      <p class="mt-2 text-sm text-muted-foreground">{{ t('lockScreenDescription') }}</p>
    </div>

    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <div class="flex justify-center">
        <div class="flex size-14 items-center justify-center rounded-full bg-muted">
          <LockKeyhole class="size-6" />
        </div>
      </div>

      <div class="relative">
        <Input
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          class="pr-10"
          :placeholder="t('password')"
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

      <p v-if="error" role="alert" class="text-sm text-destructive">{{ error }}</p>

      <Button type="submit" class="mt-2 w-full" :disabled="loading">
        <LoaderCircle v-if="loading" class="size-4 animate-spin" />
        {{ t('unlock') }}
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
