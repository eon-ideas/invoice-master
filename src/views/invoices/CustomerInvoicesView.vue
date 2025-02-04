<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCustomersStore } from '@/stores/customers'
import { useInvoicesStore } from '@/stores/invoices'
import InvoiceList from '@/components/invoices/InvoiceList.vue'
import Breadcrumb from '@/components/ui/Breadcrumb.vue'
import type { Customer } from '@/types/customer'

const router = useRouter()
const route = useRoute()
const customersStore = useCustomersStore()
const invoicesStore = useInvoicesStore()
const searchQuery = ref('')
const customer = ref<Customer | null>(null)

const customerId = route.params.customerId as string

onMounted(async () => {
  customer.value = await customersStore.getCustomerById(customerId)
  if (!customer.value) {
    router.push('/customers')
    return
  }
  await invoicesStore.fetchInvoices(customerId)
})

const breadcrumbItems = computed(() => [
  { name: 'Customers', to: '/customers' },
  { name: customer.value?.name || '', to: `/customers/${customerId}` },
  { name: 'Invoices' }
])

const handleAddNew = () => {
  router.push(`/customers/${customerId}/invoices/new`)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <main class="py-6 px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <Breadcrumb :items="breadcrumbItems" />

      <!-- Header -->
      <div class="mb-8">
        <div class="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Customer Invoices
            </h1>
            <p class="mt-1 text-sm text-gray-500">
              Manage invoices for {{ customer?.name }} ({{ customer?.currency }})
            </p>
          </div>
          <div class="mt-4 sm:mt-0">
            <button
              @click="handleAddNew"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Invoice
            </button>
          </div>
        </div>

        <!-- Search -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="search"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search invoices..."
            >
          </div>
        </div>
      </div>

      <!-- Invoice List -->
      <div class="bg-white shadow-sm rounded-lg border border-gray-200">
        <InvoiceList 
          :customer-id="customerId" 
          :search-query="searchQuery"
        />
      </div>
    </main>
  </div>
</template>