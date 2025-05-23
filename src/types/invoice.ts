export interface InvoiceItem {
  id: string
  created_at?: string
  updated_at?: string
  invoice_id: string
  description: string
  quantity: number
  price: number
}

export interface Invoice {
  id: string
  created_at?: string
  updated_at?: string
  user_id: string
  customer_id: string
  number: string
  date: string
  delivery_date: string | null
  due_date: string | null
  invoice_items?: InvoiceItem[]
  subtotal: number
  vat: number
  total: number
  paid: boolean
  currency_exchange_rate: number | null
}

export type InvoiceFormData = Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'total' | 'paid'>

export type InvoiceItemFormData = Omit<InvoiceItem, 'id' | 'created_at' | 'updated_at' | 'invoice_id'>