<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Eye, EyeOff, LoaderCircle } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth'
import { useTranslations } from '@/i18n'

const auth = useAuthStore()
const router = useRouter()
const t = useTranslations()

const form = reactive({ name: '', email: '', password: '', confirm: '' })
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  if (form.password !== form.confirm) {
    error.value = t('passwordMismatch')
    return
  }
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 300))
  const result = auth.signUp({ name: form.name, email: form.email, password: form.password })
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
      <h1 class="text-2xl font-semibold tracking-tight">{{ t('createYourAccount') }}</h1>
      <p class="mt-2 text-sm text-muted-foreground">{{ t('createAccountDescription') }}</p>
    </div>

    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <div class="flex flex-col gap-2 text-sm font-medium">
        <Label for="v2-name">{{ t('name') }}</Label>
        <Input id="v2-name" v-model="form.name" autocomplete="name" :placeholder="t('enterYourName')" required />
      </div>

      <div class="flex flex-col gap-2 text-sm font-medium">
        <Label for="v2-email">{{ t('emailAddress') }}</Label>
        <Input id="v2-email" v-model="form.email" type="email" autocomplete="email" placeholder="you@example.com" required />
      </div>

      <div class="flex flex-col gap-2">
        <Label for="v2-password" class="text-sm font-medium">{{ t('password') }}</Label>
        <div class="relative">
          <Input
            id="v2-password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            class="pr-10"
            minlength="8"
            :placeholder="t('atLeast8Chars')"
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

      <div class="flex flex-col gap-2 text-sm font-medium">
        <Label for="v2-confirm">{{ t('confirmPassword') }}</Label>
        <Input id="v2-confirm" v-model="form.confirm" type="password" autocomplete="new-password" required />
      </div>

      <p v-if="error" role="alert" class="text-sm text-destructive">{{ error }}</p>

      <Button type="submit" class="mt-2 w-full" :disabled="loading">
        <LoaderCircle v-if="loading" class="size-4 animate-spin" />
        {{ t('createAccount') }}
      </Button>
    </form>

    <p class="text-center text-sm text-muted-foreground">
      {{ t('haveAccount') }}
      <RouterLink to="/login" class="text-foreground underline-offset-4 hover:underline">
        {{ t('logIn') }}
      </RouterLink>
    </p>
  </div>
</template>
