<script setup lang="ts">
import { computed, markRaw, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { Component } from 'vue'
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo,
  Strikethrough,
  Trash2,
  Underline,
  Undo,
} from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import PageHeader from '@/components/shared/PageHeader.vue'
import { editorDocumentService } from '@/services/editor-document-service'
import type { EditorDocument } from '@/lib/data/editor-docs'
import { useTranslations } from '@/i18n'
import { useToast } from '@/composables/use-toast'

interface ToolbarItem {
  key: string
  icon: Component
  label: string
  run: () => void
}

const t = useTranslations()
const { toast } = useToast()

const docs = ref<EditorDocument[]>(editorDocumentService.list())
const activeId = ref<string | null>(null)
const titleDraft = ref('')
const contentDraft = ref('')
const dirty = ref(false)
const savedAt = ref<Date | null>(null)
const pendingDelete = ref<EditorDocument | null>(null)
const linkOpen = ref(false)
const linkUrl = ref('')
const textarea = ref<HTMLTextAreaElement | null>(null)

let hydrating = false
let saveTimer: number | undefined

const activeDoc = computed(() => docs.value.find((doc) => doc.id === activeId.value) ?? null)

const wordCount = computed(() => {
  const text = contentDraft.value.trim()
  return text ? text.split(/\s+/).length : 0
})

const charCount = computed(() => contentDraft.value.length)

function loadDoc(id: string | null) {
  hydrating = true
  activeId.value = id
  if (!id) {
    titleDraft.value = ''
    contentDraft.value = ''
  } else {
    const doc = editorDocumentService.get(id)
    titleDraft.value = doc?.title ?? ''
    contentDraft.value = doc?.content ?? ''
  }
  dirty.value = false
  savedAt.value = null
  nextTick(() => {
    hydrating = false
  })
}

function persist() {
  if (!activeId.value) return
  if (saveTimer) {
    window.clearTimeout(saveTimer)
    saveTimer = undefined
  }
  editorDocumentService.update(activeId.value, {
    title: titleDraft.value.trim() || t('untitledDocument'),
    content: contentDraft.value,
  })
  docs.value = editorDocumentService.list()
  dirty.value = false
  savedAt.value = new Date()
}

function scheduleSave() {
  if (saveTimer) window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => {
    persist()
  }, 600)
}

watch([titleDraft, contentDraft], () => {
  if (hydrating || !activeId.value) return
  dirty.value = true
  scheduleSave()
})

function createDoc() {
  const doc = editorDocumentService.create({ title: t('untitledDocument') })
  docs.value = editorDocumentService.list()
  loadDoc(doc.id)
}

function selectDoc(id: string) {
  if (id === activeId.value) return
  if (activeId.value && dirty.value) persist()
  loadDoc(id)
}

function deleteDoc(id: string) {
  editorDocumentService.remove(id)
  docs.value = editorDocumentService.list()
  if (id === activeId.value) loadDoc(docs.value[0]?.id ?? null)
  pendingDelete.value = null
  toast({ title: t('documentDeleted'), variant: 'success' })
}

function confirmDelete() {
  if (!pendingDelete.value) return
  deleteDoc(pendingDelete.value.id)
}

function saveNow() {
  if (!activeId.value) return
  persist()
  toast({ title: t('documentSaved'), variant: 'success' })
}

function focusEditor() {
  textarea.value?.focus()
}

function wrapSelection(before: string, after = before, placeholder = 'text') {
  const el = textarea.value
  const source = contentDraft.value
  const start = el ? el.selectionStart : source.length
  const end = el ? el.selectionEnd : source.length
  const selected = source.slice(start, end) || placeholder
  contentDraft.value = source.slice(0, start) + before + selected + after + source.slice(end)
  requestAnimationFrame(() => {
    if (!el) return
    el.focus()
    el.setSelectionRange(start + before.length, start + before.length + selected.length)
  })
}

function prefixLine(prefix: string) {
  const el = textarea.value
  const source = contentDraft.value
  const pos = el ? el.selectionStart : source.length
  const lineStart = source.lastIndexOf('\n', pos - 1) + 1
  let lineEnd = source.indexOf('\n', pos)
  if (lineEnd === -1) lineEnd = source.length
  const line = source.slice(lineStart, lineEnd)
  const cleaned = line.replace(/^(#{1,6}\s+|[-*]\s+|\d+\.\s+|>\s+)/, '')
  contentDraft.value = source.slice(0, lineStart) + prefix + cleaned + source.slice(lineEnd)
  const caret = lineStart + prefix.length + Math.max(0, pos - lineStart - (line.length - cleaned.length))
  requestAnimationFrame(() => {
    if (!el) return
    el.focus()
    el.setSelectionRange(caret, caret)
  })
}

function openLinkDialog() {
  linkUrl.value = ''
  linkOpen.value = true
  focusEditor()
}

function applyLink() {
  if (!linkUrl.value.trim()) {
    linkOpen.value = false
    return
  }
  const value = linkUrl.value.trim()
  const href = value.startsWith('http') ? value : `https://${value}`
  wrapSelection('[', `](${href})`, 'link')
  linkOpen.value = false
  linkUrl.value = ''
}

function removeLink() {
  const el = textarea.value
  const source = contentDraft.value
  const start = el ? el.selectionStart : 0
  const end = el ? el.selectionEnd : source.length
  const selected = source.slice(start, end)
  contentDraft.value = source.slice(0, start) + selected.replace(/\[([^\]]*)\]\(([^)]*)\)/g, '$1') + source.slice(end)
  linkOpen.value = false
}

function undo() {
  focusEditor()
  document.execCommand('undo')
}

function redo() {
  focusEditor()
  document.execCommand('redo')
}

const toolbarGroups = computed<ToolbarItem[][]>(() => [
  [
    { key: 'bold', icon: markRaw(Bold), label: t('bold'), run: () => wrapSelection('**') },
    { key: 'italic', icon: markRaw(Italic), label: t('italic'), run: () => wrapSelection('*') },
    { key: 'underline', icon: markRaw(Underline), label: t('underline'), run: () => wrapSelection('<u>', '</u>') },
    { key: 'strikethrough', icon: markRaw(Strikethrough), label: t('strikethrough'), run: () => wrapSelection('~~') },
  ],
  [
    { key: 'heading1', icon: markRaw(Heading1), label: t('heading1'), run: () => prefixLine('# ') },
    { key: 'heading2', icon: markRaw(Heading2), label: t('heading2'), run: () => prefixLine('## ') },
    { key: 'heading3', icon: markRaw(Heading3), label: t('heading3'), run: () => prefixLine('### ') },
    { key: 'paragraph', icon: markRaw(Pilcrow), label: t('paragraph'), run: () => prefixLine('') },
  ],
  [
    { key: 'bulletList', icon: markRaw(List), label: t('bulletList'), run: () => prefixLine('- ') },
    { key: 'orderedList', icon: markRaw(ListOrdered), label: t('orderedList'), run: () => prefixLine('1. ') },
    { key: 'blockquote', icon: markRaw(Quote), label: t('blockquote'), run: () => prefixLine('> ') },
    { key: 'link', icon: markRaw(LinkIcon), label: t('link'), run: openLinkDialog },
  ],
  [
    { key: 'undo', icon: markRaw(Undo), label: t('undo'), run: undo },
    { key: 'redo', icon: markRaw(Redo), label: t('redo'), run: redo },
  ],
])

onBeforeUnmount(() => {
  if (saveTimer) window.clearTimeout(saveTimer)
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      :title="t('editor')"
      :description="t('editorDescription')"
      :breadcrumbs="[{ title: t('editor'), href: '/editor' }]"
    >
      <template #actions>
        <Button size="sm" :disabled="!activeId" @click="saveNow">
          {{ t('save') }}
        </Button>
      </template>
    </PageHeader>

    <div class="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <Card class="h-fit">
        <CardHeader>
          <CardTitle>{{ t('documents') }}</CardTitle>
          <CardDescription>{{ t('docListDescription') }}</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-3">
          <Button size="sm" variant="outline" @click="createDoc">
            {{ t('newDocument') }}
          </Button>
          <ul class="flex flex-col gap-1">
            <li v-for="doc in docs" :key="doc.id" class="group relative">
              <button
                type="button"
                class="w-full rounded-md border px-3 py-2 text-left text-sm transition-colors"
                :class="
                  doc.id === activeId
                    ? 'border-primary/40 bg-primary/5 text-foreground'
                    : 'border-transparent text-muted-foreground hover:bg-muted'
                "
                @click="selectDoc(doc.id)"
              >
                <span class="block truncate pr-6 font-medium">{{ doc.title }}</span>
                <span class="mt-0.5 block text-xs opacity-70">{{ new Date(doc.updatedAt).toLocaleDateString() }}</span>
              </button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                :title="t('deleteDocument')"
                :aria-label="t('deleteDocument')"
                class="absolute top-1/2 right-1 size-7 -translate-y-1/2 text-muted-foreground opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                @click.stop="pendingDelete = doc"
              >
                <Trash2 class="size-3.5" />
              </Button>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0 flex-1">
              <Input
                v-model="titleDraft"
                :placeholder="t('untitledDocument')"
                :disabled="!activeId"
                class="h-7 border-0 bg-transparent px-0 font-medium shadow-none focus-visible:ring-0"
              />
              <CardDescription class="mt-1">
                {{
                  dirty
                    ? t('saving')
                    : savedAt
                      ? `${t('saved')} · ${savedAt.toLocaleTimeString()}`
                      : t('editorPlaceholder')
                }}
              </CardDescription>
            </div>
            <span v-if="activeDoc" class="shrink-0 text-xs text-muted-foreground">{{ activeDoc.id }}</span>
          </div>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <div class="flex flex-wrap items-center gap-1 rounded-lg border p-1">
            <template v-for="(group, groupIndex) in toolbarGroups" :key="groupIndex">
              <Separator v-if="groupIndex > 0" orientation="vertical" class="mx-1 h-6" />
              <Button
                v-for="item in group"
                :key="item.key"
                type="button"
                variant="ghost"
                size="icon"
                :title="item.label"
                :aria-label="item.label"
                :disabled="!activeId"
                class="size-8"
                @click="item.run"
              >
                <component :is="item.icon" class="size-4" />
              </Button>
            </template>
          </div>
          <div class="min-h-[360px] rounded-lg border bg-background p-3">
            <textarea
              ref="textarea"
              v-model="contentDraft"
              :disabled="!activeId"
              :placeholder="t('editorPlaceholder')"
              class="min-h-[336px] w-full resize-none border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            />
          </div>
          <div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>
              {{ t('wordCount') }}: <strong class="text-foreground">{{ wordCount }}</strong>
            </span>
            <span>
              {{ t('characters') }}: <strong class="text-foreground">{{ charCount }}</strong>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>

    <Dialog :open="pendingDelete !== null" @update:open="(value) => !value && (pendingDelete = null)">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ t('deleteDocument') }}</DialogTitle>
          <DialogDescription>{{ t('deleteDocumentDescription') }}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="pendingDelete = null">{{ t('cancel') }}</Button>
          <Button variant="destructive" @click="confirmDelete">{{ t('deleteDocument') }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="linkOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ t('insertLink') }}</DialogTitle>
          <DialogDescription>{{ t('linkUrl') }}</DialogDescription>
        </DialogHeader>
        <Input
          v-model="linkUrl"
          autofocus
          placeholder="https://lucif.ai"
          @keydown.enter.prevent="applyLink"
        />
        <DialogFooter>
          <Button variant="outline" @click="linkOpen = false">{{ t('cancel') }}</Button>
          <Button variant="destructive" @click="removeLink">{{ t('removeLink') }}</Button>
          <Button @click="applyLink">{{ t('insertLink') }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
