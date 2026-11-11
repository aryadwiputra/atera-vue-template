<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import PageHeader from '@/components/shared/PageHeader.vue'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/use-toast'
import { useTranslations } from '@/i18n'

const t = useTranslations()
const { toast } = useToast()
const auth = useAuthStore()

const name = ref(auth.session?.name ?? '')
const email = ref(auth.session?.email ?? '')

function save() {
  toast({ title: t('changesSaved'), variant: 'success' })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('profile')"
      :description="t('profileSettingsDescription')"
      :breadcrumbs="[
        { title: t('dashboard'), href: '/dashboard' },
        { title: t('settings'), href: '/settings' },
        { title: t('profile'), href: '/settings/profile' },
      ]"
    />

    <Card class="max-w-xl">
      <CardHeader>
        <CardTitle>{{ t('profileInformation') }}</CardTitle>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <label class="grid gap-2 text-sm font-medium">
          {{ t('name') }}
          <Input v-model="name" />
        </label>
        <label class="grid gap-2 text-sm font-medium">
          {{ t('email') }}
          <Input v-model="email" type="email" />
        </label>
        <Button class="w-fit" @click="save">{{ t('saveChanges') }}</Button>
      </CardContent>
    </Card>
  </div>
</template>
