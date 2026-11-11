<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import CardContent from '@/components/ui/card/CardContent.vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import { notificationService } from '@/services/notification-service'
import type { Notification } from '@/lib/data/notifications'
import { useTranslations } from '@/i18n'

const t = useTranslations()
const items = ref<Notification[]>(notificationService.list())

function markAllRead() {
  notificationService.markAllRead()
  items.value = notificationService.list()
}

function markRead(id: string) {
  notificationService.markRead(id)
  items.value = notificationService.list()
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader :title="t('notifications')" :description="t('workspaceActivityDescription')">
      <template #actions>
        <Button variant="outline" @click="markAllRead">{{ t('markAllRead') }}</Button>
      </template>
    </PageHeader>

    <Card>
      <CardContent class="p-0">
        <button
          v-for="item in items"
          :key="item.id"
          type="button"
          class="flex w-full items-start gap-4 border-b p-4 text-left last:border-0 hover:bg-muted/30"
          @click="markRead(item.id)"
        >
          <div class="mt-1 size-2 rounded-full" :class="item.read ? 'bg-muted' : 'bg-primary'" />
          <div>
            <p class="font-medium">{{ item.title }}</p>
            <p class="text-sm text-muted-foreground">{{ item.description }}</p>
            <p class="mt-1 text-xs text-muted-foreground">{{ item.time }}</p>
          </div>
        </button>
      </CardContent>
    </Card>
  </div>
</template>
