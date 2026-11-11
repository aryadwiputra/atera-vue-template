<script setup lang="ts">
import ErrorPage from './ErrorPage.vue'
import { useTranslations } from '@/i18n'

const t = useTranslations()

function onRetry() {
  window.location.reload()
}
</script>

<template>
  <ErrorPage
    code="500"
    :title="t('somethingWentWrong')"
    :description="t('serverErrorDescription')"
    home-href="/dashboard"
    :on-retry="onRetry"
  />
</template>
