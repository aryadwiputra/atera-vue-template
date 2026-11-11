<script setup lang="ts">
import { ref } from 'vue'
import { Send } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue'
import SelectValue from '@/components/ui/select/SelectValue.vue'
import SelectContent from '@/components/ui/select/SelectContent.vue'
import SelectItem from '@/components/ui/select/SelectItem.vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import { useToast } from '@/composables/use-toast'
import { useTranslations } from '@/i18n'

const t = useTranslations()
const { toast } = useToast()

const subject = ref('')
const category = ref('general')
const message = ref('')

function submit() {
  if (!subject.value.trim() || !message.value.trim()) return
  toast({ title: t('sentSuccessfully'), variant: 'success' })
  subject.value = ''
  message.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader :title="t('helpSupport')" :description="t('helpSupportDescription')" />

    <Card>
      <CardHeader>
        <CardTitle>{{ t('contactSupport') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <form class="flex flex-col gap-4" @submit.prevent="submit">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="grid gap-2">
              <label for="subject" class="text-sm font-medium">{{ t('subject') }}</label>
              <Input id="subject" v-model="subject" />
            </div>
            <div class="grid gap-2">
              <label for="category" class="text-sm font-medium">{{ t('category') }}</label>
              <Select v-model="category">
                <SelectTrigger id="category" class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">{{ t('general') }}</SelectItem>
                  <SelectItem value="billing">{{ t('billing') }}</SelectItem>
                  <SelectItem value="technical">{{ t('technical') }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-2 sm:col-span-2">
              <label for="message" class="text-sm font-medium">{{ t('message') }}</label>
              <Textarea id="message" v-model="message" class="min-h-[120px]" />
            </div>
          </div>
          <Button class="mt-4" type="submit">
            <Send class="size-4" />
            {{ t('send') }}
          </Button>
        </form>
      </CardContent>
    </Card>

    <div class="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>{{ t('faq') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="list-inside list-disc text-sm text-muted-foreground">
            <li>{{ t('faq1') }}</li>
            <li>{{ t('faq2') }}</li>
            <li>{{ t('faq3') }}</li>
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{{ t('quickLinks') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="list-inside list-disc text-sm text-muted-foreground">
            <li><a href="#" class="hover:underline">{{ t('docs') }}</a></li>
            <li><a href="#" class="hover:underline">{{ t('community') }}</a></li>
            <li><a href="#" class="hover:underline">{{ t('safety') }}</a></li>
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{{ t('status') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">{{ t('operational') }}</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
