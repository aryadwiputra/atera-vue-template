import type { Deal, DealStage } from '@/lib/data/types'
import { createDeal, getDeal, listDeals, moveDeal, stages } from '@/lib/data/crm'

export interface CrmService {
  listDeals(): Deal[]
  getDeal(id: string): Deal | undefined
  createDeal(input: Omit<Deal, 'id'>): Deal
  moveDeal(id: string, stage: DealStage): void
  stages: { id: DealStage; label: string }[]
}

export const crmService: CrmService = {
  listDeals,
  getDeal,
  createDeal,
  moveDeal,
  stages,
}
