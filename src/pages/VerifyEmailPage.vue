<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowLeft, MailCheck } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/i18n'

const t = useTranslations()
</script>

<template>
  <div class="flex flex-col gap-8">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">{{ t('verifyYourEmail') }}</h1>
      <p class="mt-2 text-sm text-muted-foreground">{{ t('verifyYourEmailDescription') }}</p>
    </div>

    <div class="flex flex-col items-center gap-3 rounded-lg border p-6 text-center">
      <div class="text-primary">
        <MailCheck class="size-8" />
      </div>
      <p class="font-semibold">{{ t('verificationEmailSent') }}</p>
      <p class="text-sm text-muted-foreground">{{ t('checkInboxVerification') }}</p>
    </div>

    <Button variant="outline" class="w-full">{{ t('resendEmail') }}</Button>

    <RouterLink
      to="/login"
      class="flex items-center justify-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
    >
      <ArrowLeft class="size-4" />
      {{ t('backToSignIn') }}
    </RouterLink>
  </div>
</template>
