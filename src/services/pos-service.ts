import type { PosCartLine, PosItem, PosPaymentMethod } from '@/lib/data/pos'
import { createOrderFromCart, getPosItem, listCategories, listPosItems } from '@/lib/data/pos'

export type PosOrder = ReturnType<typeof createOrderFromCart>

export interface PosService {
  listItems(): PosItem[]
  getItem(id: string): PosItem | undefined
  listCategories(): string[]
  createOrder(
    cartLines: PosCartLine[],
    total: number,
    paymentMethod: PosPaymentMethod,
    customer: string,
    customerEmail: string,
  ): PosOrder
}

export const posService: PosService = {
  listItems: listPosItems,
  getItem: getPosItem,
  listCategories,
  createOrder: createOrderFromCart,
}
