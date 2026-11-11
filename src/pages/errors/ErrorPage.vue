<script setup lang="ts">
import { Home, RefreshCw } from '@lucide/vue'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/i18n'

interface Props {
  code: string
  title: string
  description: string
  homeHref?: string
  backHref?: string
  onRetry?: () => void
}

defineProps<Props>()

const t = useTranslations()
</script>

<template>
  <div class="flex min-h-full flex-col items-center justify-center gap-6 p-6 text-center">
    <p class="text-6xl font-semibold tracking-tight">{{ code }}</p>
    <h1 class="text-xl font-semibold">{{ title }}</h1>
    <p class="max-w-md text-sm text-muted-foreground">{{ description }}</p>
    <div class="flex gap-3">
      <Button v-if="homeHref" variant="outline" as-child>
        <RouterLink :to="homeHref">{{ t('goHome') }}</RouterLink>
      </Button>
      <Button v-if="backHref" variant="outline" as-child>
        <RouterLink :to="backHref">{{ t('goBack') }}</RouterLink>
      </Button>
      <Button v-if="onRetry" @click="onRetry">
        <RefreshCw class="size-4" />{{ t('retry') }}
      </Button>
    </div>
    <Home class="size-8 text-muted-foreground" />
  </div>
</template>
