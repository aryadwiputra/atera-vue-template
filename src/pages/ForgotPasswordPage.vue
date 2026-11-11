<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft, MailCheck } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslations } from '@/i18n'

const t = useTranslations()
const email = ref('')
const sent = ref(false)

function onSubmit() {
  sent.value = true
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">{{ t('forgotPasswordTitle') }}</h1>
      <p class="mt-2 text-sm text-muted-foreground">{{ t('enterEmailResetLink') }}</p>
    </div>

    <div v-if="sent" class="flex flex-col items-center gap-3 rounded-lg border p-6 text-center">
      <div class="text-primary">
        <MailCheck class="size-8" />
      </div>
      <p class="font-semibold">{{ t('checkYourInbox') }}</p>
      <p class="text-sm text-muted-foreground">{{ t('resetLinkSent') }}</p>
    </div>

    <form v-else class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <div class="flex flex-col gap-2 text-sm font-medium">
        <Label for="email">{{ t('email') }}</Label>
        <Input id="email" v-model="email" type="email" placeholder="you@example.com" required />
      </div>
      <Button type="submit" class="mt-2 w-full">{{ t('sendResetLink') }}</Button>
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
