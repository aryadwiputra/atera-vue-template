export interface EditorDocument {
  id: string
  title: string
  content: string
  updatedAt: string
}

const documents: EditorDocument[] = [
  {
    id: 'DOC-001',
    title: 'Welcome to the editor',
    updatedAt: '2026-11-10T09:20:00.000Z',
    content: `## Welcome to the editor

This is a plain text editor. It supports the writing you would expect, and the toolbar inserts simple markers for bold, italic, headings, lists, quotes and links.

Use the toolbar above the canvas to wrap a selection or prefix the current line. Everything updates live and saves to the document list on the left.

### Highlights
- Keyboard-friendly plain text editing
- Debounced autosave with manual save
- Fully themeable with CSS variables

1. Pick a document
2. Write and format
3. Save, or keep typing

> The best way to predict the future is to write it down.`,
  },
  {
    id: 'DOC-002',
    title: 'Q4 product launch notes',
    updatedAt: '2026-11-08T14:05:00.000Z',
    content: `## Launch scope

The Q4 release focuses on retention and clarity. We ship the editor as the flagship authoring surface, then fold in analytics for every published piece.

### Checklist
- Document store and list sidebar
- Toolbar parity with desktop app
- Saved state feedback

### Risks
Draft migration is the only open item. Coordinate with platform before the freeze.`,
  },
  {
    id: 'DOC-003',
    title: 'Editor roadmap',
    updatedAt: '2026-11-02T10:40:00.000Z',
    content: `## Roadmap

Planned additions, in order. Each item should land behind a flag first.

1. Images and tables
2. Slash commands
3. Markdown import/export
4. Version history`,
  },
]

let sequence = documents.length

export const listEditorDocuments = () => [...documents].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

export const getEditorDocument = (id: string) => documents.find((document) => document.id === id) ?? null

export const createEditorDocument = (input: Partial<Pick<EditorDocument, 'title' | 'content'>> = {}) => {
  sequence += 1
  const document: EditorDocument = {
    id: `DOC-${String(sequence).padStart(3, '0')}`,
    title: input.title?.trim() || 'Untitled document',
    content: input.content ?? '',
    updatedAt: new Date().toISOString(),
  }
  documents.unshift(document)
  return document
}

export const updateEditorDocument = (id: string, changes: Partial<Pick<EditorDocument, 'title' | 'content'>>) => {
  const document = documents.find((item) => item.id === id)
  if (!document) return null
  if (changes.title !== undefined) document.title = changes.title
  if (changes.content !== undefined) document.content = changes.content
  document.updatedAt = new Date().toISOString()
  return document
}

export const removeEditorDocument = (id: string) => {
  const index = documents.findIndex((item) => item.id === id)
  if (index === -1) return false
  documents.splice(index, 1)
  return true
}
