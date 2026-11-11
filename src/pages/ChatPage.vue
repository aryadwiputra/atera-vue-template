<script setup lang="ts">
import { computed, ref } from 'vue'
import { MessageSquare, Plus, Send } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import PageHeader from '@/components/shared/PageHeader.vue'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'

const t = useTranslations()

const channels = ['General', 'Product', 'Design', 'Random']

const initialMessages: Record<string, string[]> = {
  General: ['Welcome to the Atera team space.', 'The quarterly review is ready for your feedback.'],
  Product: ['The roadmap review is scheduled for Friday.'],
  Design: ['The latest dashboard exploration is ready.'],
  Random: ['Share anything useful with the team here.'],
}

const senders = ['Avery Morgan', 'Sofia Chen', 'Marcus Reed']

const channel = ref('General')
const message = ref('')
const messages = ref<Record<string, string[]>>({ ...initialMessages })

const currentMessages = computed(() => messages.value[channel.value] ?? [])

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
}

function submit() {
  if (!message.value.trim()) return
  messages.value = {
    ...messages.value,
    [channel.value]: [...(messages.value[channel.value] ?? []), message.value],
  }
  message.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader :title="t('chat')" :description="t('chatDescription')" />

    <Card>
      <div class="grid min-h-[560px] md:grid-cols-[220px_minmax(0,1fr)]">
        <aside class="flex flex-col border-b bg-muted/20 md:border-r md:border-b-0">
          <div class="mb-3 flex items-center justify-between px-4 py-3">
            <span class="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{{ t('channels') }}</span>
            <Button variant="ghost" size="icon-sm" :aria-label="t('addChannel')">
              <Plus class="size-4" />
            </Button>
          </div>
          <div class="flex flex-col gap-1 px-2">
            <button
              v-for="item in channels"
              :key="item"
              type="button"
              :class="cn(
                'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors',
                channel === item
                  ? 'bg-accent font-medium text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted',
              )"
              @click="channel = item"
            >
              <MessageSquare class="size-4" />
              {{ item }}
            </button>
          </div>
        </aside>

        <section class="flex min-h-[500px] flex-col">
          <header class="flex items-center gap-3 border-b px-5 py-4">
            <div class="flex size-9 items-center justify-center rounded-md bg-muted">
              <MessageSquare class="size-4" />
            </div>
            <div>
              <h2 class="font-semibold">{{ channel }}</h2>
              <p class="text-xs text-muted-foreground">{{ t('teamConversation') }}</p>
            </div>
          </header>

          <div class="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
            <div v-for="(item, index) in currentMessages" :key="`${item}-${index}`" class="flex gap-3">
              <div
                class="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium"
              >
                {{ initials(senders[index % senders.length]) }}
              </div>
              <div>
                <div class="flex items-baseline gap-2">
                  <span class="text-sm font-medium">{{ senders[index % senders.length] }}</span>
                  <Badge variant="secondary">{{ t('now') }}</Badge>
                </div>
                <p class="mt-1 text-sm text-muted-foreground">{{ item }}</p>
              </div>
            </div>
          </div>

          <form class="flex gap-2 border-t p-4" @submit.prevent="submit">
            <Input v-model="message" :placeholder="`#${channel.toLowerCase()}`" />
            <Button type="submit" size="icon" :aria-label="t('send')">
              <Send class="size-4" />
            </Button>
          </form>
        </section>
      </div>
    </Card>
  </div>
</template>
