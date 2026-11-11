import type { FileItem } from '@/lib/data/types'
import { listFiles } from '@/lib/data/files'

export interface FileService {
  list(): FileItem[]
}

export const fileService: FileService = {
  list: listFiles,
}
