<script setup lang="ts">
import { computed, ref } from 'vue'
import { FileSpreadsheet, FileText, Folder, Grid3x3, Image, List, MoreHorizontal, Plus, Search, Upload } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import PageHeader from '@/components/shared/PageHeader.vue'
import { fileService } from '@/services/file-service'
import type { FileItem } from '@/lib/data/types'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'

const t = useTranslations()

const typeIcons = {
  folder: Folder,
  document: FileText,
  spreadsheet: FileSpreadsheet,
  image: Image,
} as const

const files = fileService.list()
const view = ref<'grid' | 'list'>('grid')
const search = ref('')
const uploading = ref(false)
const uploaded = ref(false)

const filtered = computed(() => {
  const query = search.value.toLowerCase()
  return files.filter((file) => file.name.toLowerCase().includes(query))
})

function sizeLabel(file: FileItem) {
  return file.size ?? t('folder')
}

let uploadTimer: number | undefined
let uploadedTimer: number | undefined

function simulateUpload() {
  uploading.value = true
  uploaded.value = false
  window.clearTimeout(uploadTimer)
  window.clearTimeout(uploadedTimer)
  uploadTimer = window.setTimeout(() => {
    uploading.value = false
    uploaded.value = true
    uploadedTimer = window.setTimeout(() => {
      uploaded.value = false
    }, 2000)
  }, 800)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('files')"
      :description="t('filesDescription')"
      :breadcrumbs="[{ title: t('dashboard'), href: '/dashboard' }, { title: t('files'), href: '/files' }]"
    >
      <template #actions>
        <span v-if="uploaded" class="text-xs text-muted-foreground">{{ t('uploadComplete') }}</span>
        <Button size="sm" variant="outline" :disabled="uploading" @click="simulateUpload">
          <Upload class="size-4" />
          {{ uploading ? t('uploading') : t('upload') }}
        </Button>
        <Button size="sm">
          <Plus class="size-4" />
          {{ t('newFolder') }}
        </Button>
      </template>
    </PageHeader>

    <div class="flex items-center gap-2">
      <div class="flex items-center gap-2 rounded-md border bg-background px-3 py-1.5">
        <Search class="size-4 text-muted-foreground" />
        <Input
          v-model="search"
          class="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
          :placeholder="t('searchFiles')"
        />
      </div>
      <div class="flex rounded-md border p-0.5">
        <button
          type="button"
          :aria-label="t('gridView')"
          :class="cn('rounded p-1.5', view === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground')"
          @click="view = 'grid'"
        >
          <Grid3x3 class="size-4" />
        </button>
        <button
          type="button"
          :aria-label="t('listView')"
          :class="cn('rounded p-1.5', view === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground')"
          @click="view = 'list'"
        >
          <List class="size-4" />
        </button>
      </div>
    </div>

    <div v-if="view === 'grid'" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card v-for="file in filtered" :key="file.id">
        <CardContent class="flex flex-col gap-3 p-5">
          <div class="flex items-center justify-between">
            <component :is="typeIcons[file.type]" class="size-8 text-muted-foreground" />
            <Button variant="ghost" size="icon" :aria-label="t('more')">
              <MoreHorizontal class="size-4" />
            </Button>
          </div>
          <p class="truncate font-medium">{{ file.name }}</p>
          <p class="text-xs text-muted-foreground">{{ sizeLabel(file) }} · {{ file.updated }}</p>
        </CardContent>
      </Card>
    </div>

    <Card v-else>
      <CardContent class="p-0">
        <div
          v-for="file in filtered"
          :key="file.id"
          class="flex items-center gap-4 border-b p-4 last:border-0"
        >
          <component :is="typeIcons[file.type]" class="size-5 shrink-0 text-muted-foreground" />
          <p class="min-w-0 flex-1 truncate text-sm font-medium">{{ file.name }}</p>
          <p class="hidden text-xs text-muted-foreground sm:block">{{ file.owner }}</p>
          <p class="text-xs text-muted-foreground">{{ sizeLabel(file) }}</p>
          <p class="hidden text-xs text-muted-foreground md:block">{{ file.updated }}</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
