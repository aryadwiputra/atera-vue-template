<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Bot, Plus, Send, Sparkles } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import PageHeader from '@/components/shared/PageHeader.vue'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface Conversation {
  id: string
  title: string
  preview: string
}

const t = useTranslations()

const conversations: Conversation[] = [
  { id: '1', title: 'Quarterly report summary', preview: 'Can you summarize these numbers for me?' },
  { id: '2', title: 'Customer email draft', preview: 'Write a friendly follow-up email to a lead.' },
  { id: '3', title: 'Bug triage help', preview: 'The checkout page throws a 500 error.' },
  { id: '4', title: 'Campaign ideas', preview: 'Give me five launch ideas for spring.' },
  { id: '5', title: 'Onboarding checklist', preview: 'Draft an onboarding plan for new hires.' },
]

const suggestions = [
  { key: 'suggestionSummarize', text: 'Summarize this quarter\u2019s performance' },
  { key: 'suggestionDraft', text: 'Draft a customer follow-up email' },
  { key: 'suggestionIdeas', text: 'Brainstorm campaign ideas' },
  { key: 'suggestionExplain', text: 'Explain this metric' },
]

const cannedReplies = [
  'Here is a quick summary: revenue grew 12.5% quarter over quarter, driven mostly by the enterprise segment. Churn stayed flat while new signups rose sharply in the last two weeks.',
  'Great idea! I would start with the highest-impact items, group them into three phases, and assign a clear owner to each. Want me to draft a detailed plan?',
  'Based on the data, the trend is positive and stable. The main risk is seasonal dip in December, so I recommend keeping the current pacing through the holidays.',
  'I put together a short draft. It opens with context, states the ask in one sentence, and closes with a clear call to action. You can tweak the tone as needed.',
]

const activeConversation = ref(conversations[0]?.id ?? '1')
const messages = ref<ChatMessage[]>([
  { role: 'assistant', content: 'Hi! I am your AI assistant. How can I help you today?' },
])
const message = ref('')
const typing = ref(false)

const activeTitle = computed(
  () => conversations.find((item) => item.id === activeConversation.value)?.title ?? '',
)

let timer: number | undefined

watch(typing, (isTyping) => {
  if (!isTyping) return
  timer = window.setTimeout(() => {
    typing.value = false
    const assistantCount = messages.value.filter((item) => item.role === 'assistant').length
    messages.value.push({
      role: 'assistant',
      content: cannedReplies[assistantCount % cannedReplies.length] ?? '',
    })
  }, 400)
})

onBeforeUnmount(() => {
  if (timer) window.clearTimeout(timer)
})

function submit(text: string) {
  const trimmed = text.trim()
  if (!trimmed || typing.value) return
  messages.value.push({ role: 'user', content: trimmed })
  message.value = ''
  typing.value = true
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader :title="t('aiChat')" :description="t('aiChatDescription')" />

    <Card class="overflow-hidden">
      <div class="grid min-h-[560px] md:grid-cols-[240px_minmax(0,1fr)]">
        <aside class="flex flex-col border-b bg-muted/20 md:border-r md:border-b-0">
          <div class="mb-3 flex items-center justify-between px-4 py-3">
            <span class="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {{ t('conversations') }}
            </span>
            <Button variant="ghost" size="icon-sm" :aria-label="t('newConversation')">
              <Plus class="size-4" />
            </Button>
          </div>
          <div class="flex flex-col gap-1 px-2">
            <button
              v-for="item in conversations"
              :key="item.id"
              type="button"
              :class="cn(
                'flex w-full flex-col gap-1 rounded-md px-3 py-2 text-left text-sm transition-colors',
                activeConversation === item.id
                  ? 'bg-accent font-medium text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted',
              )"
              @click="activeConversation = item.id"
            >
              <span class="truncate">{{ item.title }}</span>
              <span class="truncate text-xs text-muted-foreground">{{ item.preview }}</span>
            </button>
          </div>
        </aside>

        <section class="flex min-h-[500px] flex-col">
          <header class="flex items-center gap-3 border-b px-5 py-4">
            <div class="flex size-9 items-center justify-center rounded-md bg-muted">
              <Bot class="size-4" />
            </div>
            <div>
              <h2 class="font-semibold">{{ activeTitle }}</h2>
              <p class="text-xs text-muted-foreground">{{ t('aiAssistant') }}</p>
            </div>
          </header>

          <div class="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
            <div
              v-for="(item, index) in messages"
              :key="`${item.role}-${index}`"
              :class="cn('flex', item.role === 'user' ? 'justify-end' : 'justify-start')"
            >
              <div
                :class="cn(
                  'max-w-[75%] rounded-lg px-4 py-2.5 text-sm',
                  item.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )"
              >
                {{ item.content }}
              </div>
            </div>
            <div v-if="typing" class="flex justify-start">
              <div
                class="flex items-center gap-2 rounded-lg bg-muted px-4 py-2.5 text-sm text-muted-foreground"
              >
                <Sparkles class="size-4" />
                {{ t('typing') }}
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 border-t px-4 py-3">
            <Button
              v-for="suggestion in suggestions"
              :key="suggestion.key"
              variant="outline"
              size="sm"
              class="rounded-full text-xs"
              @click="submit(t(suggestion.key))"
            >
              {{ t(suggestion.key) }}
            </Button>
          </div>

          <form class="flex gap-2 border-t p-4" @submit.prevent="submit(message)">
            <Input v-model="message" :placeholder="t('sendAMessage')" />
            <Button type="submit" size="icon" :aria-label="t('send')">
              <Send class="size-4" />
            </Button>
          </form>
        </section>
      </div>
    </Card>
  </div>
</template>
