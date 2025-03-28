<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCustomersStore } from '@/stores/customers'
import { useInvoicesStore } from '@/stores/invoices'
import Breadcrumb from '@/components/ui/Breadcrumb.vue'
import InvoiceForm from '@/components/invoices/InvoiceForm.vue'
import type { InvoiceFormData, Invoice } from '@/types/invoice'
import type { Customer } from '@/types/customer'

const router = useRouter()
const route = useRoute()
const customersStore = useCustomersStore()
const invoicesStore = useInvoicesStore()

const customerId = route.params.customerId as string
const invoiceId = route.params.id as string
const customer = ref<Customer | null>(null)
const invoice = ref<Invoice | null>(null)

onMounted(async () => {
  customer.value = await customersStore.getCustomerById(customerId)
  if (!customer.value) {
    router.push('/customers')
    return
  }
  
  invoice.value = await invoicesStore.getInvoiceById(invoiceId)
  if (!invoice.value) {
    router.push(`/customers/${customerId}/invoices`)
    return
  }
})

const breadcrumbItems = ref([
  { name: 'Customers', to: '/customers' },
  { name: '', to: `/customers/${customerId}` },
  { name: 'Invoices', to: `/customers/${customerId}/invoices` },
  { name: 'Edit Invoice' }
])

const handleSubmit = async (data: InvoiceFormData) => {
  await invoicesStore.updateInvoice(invoiceId, {
    ...data,
    customer_id: customerId
  })
  router.push(`/customers/${customerId}/invoices`)
}

// Update breadcrumb when data is loaded
onMounted(() => {
  const updateBreadcrumb = () => {
    if (customer.value && invoice.value) {
      breadcrumbItems.value[1].name = customer.value.name
      breadcrumbItems.value[3].name = `Edit Invoice #${invoice.value.number}`
    }
  }
  
  const interval = setInterval(() => {
    if (customer.value && invoice.value) {
      updateBreadcrumb()
      clearInterval(interval)
    }
  }, 100)

  // Cleanup
  setTimeout(() => clearInterval(interval), 5000)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <main class="py-6 px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <Breadcrumb :items="breadcrumbItems" />

      <!-- Header -->
      <div class="mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Edit Invoice #{{ invoice?.number }}</h1>
          <p class="mt-1 text-sm text-gray-500">
            Update invoice details for {{ customer?.name }}
          </p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-3xl">
        <div class="bg-white shadow-sm rounded-lg border border-gray-200">
          <div class="p-6">
            <div class="flex items-center space-x-3 pb-6 mb-6 border-b border-gray-200">
              <div class="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-medium text-gray-900">Invoice Details</h2>
                <p class="text-sm text-gray-500">Update the information below to modify this invoice</p>
              </div>
            </div>

            <InvoiceForm
              v-if="invoice"
              :customer-id="customerId"
              :initial-data="invoice"
              @submit="handleSubmit"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>