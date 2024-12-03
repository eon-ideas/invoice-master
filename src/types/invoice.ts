export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  price: number
}

export interface Invoice {
  id: string
  customerId: string
  number: string
  date: string
  items: InvoiceItem[]
  total: number
  paid: boolean
}

export type InvoiceFormData = Omit<Invoice, 'id' | 'total' | 'paid'>
export type InvoiceItemFormData = Omit<InvoiceItem, 'id'>