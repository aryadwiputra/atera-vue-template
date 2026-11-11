<script setup lang="ts">
import { computed, ref } from 'vue'
import { Mail, MailOpen, Plus, Search, Star } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import PageHeader from '@/components/shared/PageHeader.vue'
import { mailService } from '@/services/mail-service'
import type { MailMessage } from '@/lib/data/mail'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'

const t = useTranslations()
const mails = ref<MailMessage[]>(mailService.list())
const selectedId = ref<string | null>(null)
const compose = ref(false)
const search = ref('')
const to = ref('')
const subject = ref('')
const body = ref('')
const sent = ref(false)

const selected = computed(() => mails.value.find((mail) => mail.id === selectedId.value) ?? null)

const filtered = computed(() => {
  const query = search.value.toLowerCase()
  return mails.value.filter(
    (mail) =>
      mail.subject.toLowerCase().includes(query) || mail.sender.toLowerCase().includes(query),
  )
})

function openMail(id: string) {
  mailService.markRead(id)
  mails.value = mailService.list()
  selectedId.value = id
}

function submit() {
  if (!to.value || !subject.value || !body.value) return
  mailService.send({ to: to.value, subject: subject.value, body: body.value })
  mails.value = mailService.list()
  compose.value = false
  to.value = ''
  subject.value = ''
  body.value = ''
  sent.value = true
  window.setTimeout(() => {
    sent.value = false
  }, 2000)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('mail')"
      :description="t('mailDescription')"
      :breadcrumbs="[{ title: t('dashboard'), href: '/dashboard' }, { title: t('mail'), href: '/mail' }]"
    >
      <template #actions>
        <Button size="sm" @click="compose = true">
          <Plus class="size-4" />
          {{ t('compose') }}
        </Button>
      </template>
    </PageHeader>

    <div
      v-if="sent"
      class="rounded-md border border-status-success bg-status-success/10 px-4 py-3 text-sm text-status-success"
    >
      {{ t('mailSent') }}
    </div>

    <Card v-if="compose">
      <CardContent class="grid gap-4 p-5">
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium" for="mail-to">{{ t('to') }}</label>
          <Input id="mail-to" v-model="to" placeholder="name@example.com" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium" for="mail-subject">{{ t('subject') }}</label>
          <Input id="mail-subject" v-model="subject" :placeholder="t('subjectPlaceholder')" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium" for="mail-body">{{ t('message') }}</label>
          <Textarea id="mail-body" v-model="body" class="min-h-32" :placeholder="t('messagePlaceholder')" />
        </div>
        <div class="flex gap-2">
          <Button size="sm" :disabled="!to || !subject || !body" @click="submit">
            {{ t('send') }}
          </Button>
          <Button size="sm" variant="outline" @click="compose = false">
            {{ t('cancel') }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card v-else class="overflow-hidden">
      <div class="grid min-h-[560px] md:grid-cols-[280px_minmax(0,1fr)]">
        <aside class="flex flex-col border-b bg-muted/20 md:border-r md:border-b-0">
          <div class="border-b p-3">
            <div class="flex items-center gap-2 rounded-md border bg-background px-3 py-1.5">
              <Search class="size-4 text-muted-foreground" />
              <Input
                v-model="search"
                class="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                :placeholder="t('searchMail')"
              />
            </div>
          </div>
          <div class="flex-1 overflow-y-auto">
            <button
              v-for="mail in filtered"
              :key="mail.id"
              type="button"
              :class="cn(
                'flex w-full items-start gap-3 border-b p-4 text-left transition-colors hover:bg-muted',
                selectedId === mail.id && 'bg-muted/70',
              )"
              @click="openMail(mail.id)"
            >
              <div
                :class="cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                  mail.unread ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                )"
              >
                {{ mail.initials }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <p :class="cn('truncate text-sm', mail.unread && 'font-semibold')">{{ mail.sender }}</p>
                  <span class="shrink-0 text-xs text-muted-foreground">{{ mail.time }}</span>
                </div>
                <p :class="cn('truncate text-sm', mail.unread && 'font-medium')">{{ mail.subject }}</p>
                <p class="truncate text-xs text-muted-foreground">{{ mail.preview }}</p>
              </div>
              <Star v-if="mail.starred" class="size-4 shrink-0 text-primary" />
            </button>
          </div>
        </aside>

        <section class="flex min-h-[500px] flex-col">
          <template v-if="selected">
            <header class="flex items-start gap-3 border-b p-5">
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
              >
                {{ selected.initials }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <h2 class="font-semibold">{{ selected.subject }}</h2>
                  <Badge variant="secondary">{{ selected.time }}</Badge>
                </div>
                <p class="mt-0.5 text-sm text-muted-foreground">{{ selected.sender }}</p>
              </div>
            </header>
            <div class="flex-1 overflow-y-auto p-5">
              <p class="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {{ selected.body }}
              </p>
            </div>
            <div class="border-t p-4">
              <Button variant="outline" size="sm">
                <Mail class="size-4" />
                {{ t('reply') }}
              </Button>
            </div>
          </template>
          <div v-else class="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
            <MailOpen class="size-10" />
            <p class="text-sm">{{ t('selectEmail') }}</p>
          </div>
        </section>
      </div>
    </Card>
  </div>
</template>
