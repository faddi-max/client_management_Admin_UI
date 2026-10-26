const cents = (n) => Math.round((Number(n) || 0) * 100)

/** Discount applies to the subtotal first, then tax applies to the discounted amount. Returns dollars. */
export function calculateInvoiceTotals({ lineItems = [], discountPercent = 0, taxPercent = 0 }) {
  const subtotal = lineItems.reduce((t, i) => t + cents(Number(i.quantity) * Number(i.unitPrice)), 0)
  const discount = Math.round((subtotal * (Number(discountPercent) || 0)) / 100)
  const taxable = subtotal - discount
  const tax = Math.round((taxable * (Number(taxPercent) || 0)) / 100)
  return {
    subtotal: subtotal / 100,
    discount: discount / 100,
    tax: tax / 100,
    total: (taxable + tax) / 100,
  }
}