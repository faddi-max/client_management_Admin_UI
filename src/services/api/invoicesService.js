import { invoicesApi } from './invoicesApi'
import {
  mockCreateInvoice,
  mockFetchInvoiceDetail,
  mockFetchInvoiceFacets,
  mockFetchInvoices,
  mockFetchInvoiceStats,
} from '@/mocks/invoicesMock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'
const cleanParams = (params) => Object.fromEntries(Object.entries(params).filter(([, value]) => value != null && value !== '' && value !== 'all'))

/** API contract: params -> { items: InvoiceRow[], meta: { total, page, perPage } }. */
export async function fetchInvoices(params) {
  if (USE_MOCK) return mockFetchInvoices(params)
  const { data } = await invoicesApi.getAll(cleanParams(params))
  return { items: data.items, meta: data.meta }
}

/** API contract: () -> { total, statuses: [{ value, count }], clients, dateRanges }. */
export async function fetchInvoiceFacets() {
  if (USE_MOCK) return mockFetchInvoiceFacets()
  const { data } = await invoicesApi.getFacets()
  return data
}

/** API contract: () -> { total, outstanding, paidThisMonth, overdue }. Amounts are numbers, not strings. */
export async function fetchInvoiceStats() {
  if (USE_MOCK) return mockFetchInvoiceStats()
  const { data } = await invoicesApi.getStats()
  return data
}

/** Form values -> API payload. The API recomputes totals and returns the newly-created InvoiceRow. */
export async function createInvoice(values) {
  const payload = {
    status: values.status,
    currency: values.currency,
    issueDate: values.issueDate,
    dueDate: values.dueDate,
    client: {
      name: values.clientName.trim(),
      company: values.company.trim() || null,
      email: values.email.trim(),
      address: values.address.trim() || null,
    },
    lineItems: values.items.map((i) => ({
      description: i.description.trim(),
      quantity: Number(i.quantity),
      unitPrice: Number(i.unitPrice),
    })),
    discountPercent: Number(values.discount || 0),
    taxPercent: Number(values.tax || 0),
    paymentMethod: values.paymentMethod,
    paymentTerms: values.paymentTerms,
    paymentInstructions: values.instructions.trim() || null,
    notes: values.notes.trim() || null,
  }
  if (USE_MOCK) return mockCreateInvoice(payload)
  const { data } = await invoicesApi.create(payload)
  return data
}

/**
 * Contract: id -> {
 *   lineItems: [{ description, quantity, unitPrice }],
 *   totals: { subtotal, discount, tax, total },
 *   address: string|null, paymentMethod: string, paymentTerms: string|null,
 *   instructions: string|null, notes: string|null
 * } | null. The backend computes totals; the UI only displays them.
 */
export async function fetchInvoiceDetail(id) {
  if (USE_MOCK) return mockFetchInvoiceDetail(id)
  const { data } = await invoicesApi.getById(id)
  return data
}