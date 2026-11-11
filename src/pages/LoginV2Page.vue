<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Eye, EyeOff, LoaderCircle } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth'
import { useTranslations } from '@/i18n'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const t = useTranslations()

const demo = auth.demo()
const form = reactive({ email: demo.email, password: demo.password })
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 300))
  const result = auth.signIn(form.email, form.password)
  loading.value = false
  if (!result.ok) {
    error.value = t(result.message)
    return
  }
  const destination = typeof route.query.from === 'string' ? route.query.from : '/dashboard'
  router.push(destination)
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">{{ t('loginTitle') }}</h1>
      <p class="mt-2 text-sm text-muted-foreground">{{ t('loginDescription') }}</p>
    </div>

    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <div class="flex flex-col gap-2 text-sm font-medium">
        <Label for="v2-email">{{ t('emailAddress') }}</Label>
        <Input id="v2-email" v-model="form.email" type="email" autocomplete="email" required />
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex items-baseline justify-between">
          <Label for="v2-password" class="text-sm font-medium">{{ t('password') }}</Label>
          <RouterLink
            to="/forgot-password"
            class="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            {{ t('forgotPassword') }}
          </RouterLink>
        </div>
        <div class="relative">
          <Input
            id="v2-password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
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

      <div class="flex items-center gap-2">
        <Checkbox id="remember-me" v-model="rememberMe" />
        <Label for="remember-me" class="text-sm font-medium">{{ t('rememberMe') }}</Label>
      </div>

      <p v-if="error" role="alert" class="text-sm text-destructive">{{ error }}</p>

      <Button type="submit" class="mt-2 w-full" :disabled="loading">
        <LoaderCircle v-if="loading" class="size-4 animate-spin" />
        {{ t('logIn') }}
      </Button>
    </form>

    <p class="text-center text-sm text-muted-foreground">
      {{ t('noAccount') }}
      <RouterLink to="/sign-up" class="text-foreground underline-offset-4 hover:underline">
        {{ t('signUp') }}
      </RouterLink>
    </p>
  </div>
</template>
