import { invoicesApi } from './invoicesApi'
import { mockCreateInvoice, mockFetchInvoiceFacets, mockFetchInvoices } from '@/mocks/invoicesMock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'
const cleanParams = (params) => Object.fromEntries(Object.entries(params).filter(([, value]) => value != null && value !== '' && value !== 'all'))

/** API contract: params -> { items: InvoiceRow[], meta: { total, page, perPage } }. */
export async function fetchInvoices(params) {
  if (USE_MOCK) return mockFetchInvoices(params)
  const { data } = await invoicesApi.getAll(cleanParams(params))
  return { items: data.items, meta: data.meta }
}

/** API contract: () -> { total, statuses: [{ value, count }] }. */
export async function fetchInvoiceFacets() {
  if (USE_MOCK) return mockFetchInvoiceFacets()
  const { data } = await invoicesApi.getFacets()
  return data
}

/** Form values -> API payload. The API returns the newly-created InvoiceRow. */
export async function createInvoice(values) {
  const payload = {
    clientId: values.clientId,
    project: values.project.trim(),
    amount: Number(values.amount),
    issueDate: values.issueDate,
    dueDate: values.dueDate,
    paymentTerms: values.paymentTerms,
  }
  if (USE_MOCK) return mockCreateInvoice(payload)
  const { data } = await invoicesApi.create(payload)
  return data
}
