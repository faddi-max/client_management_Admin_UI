import { clsx } from 'clsx'

/**
 * Utility for merging Tailwind class names conditionally.
 * Thin wrapper around clsx — swap for tailwind-merge if class conflicts arise.
 *
 * @param {...(string|Object|Array|undefined)} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return clsx(...inputs)
}

/**
 * Format a number as currency.
 * @param {number} amount
 * @param {string} [currency='USD']
 * @param {string} [locale='en-US']
 */
export function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

/**
 * Format an ISO date string to a human-readable date.
 * @param {string|Date} date
 * @param {string} [locale='en-US']
 */
export function formatDate(date, locale = 'en-US') {
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(
    new Date(date)
  )
}

/**
 * Truncate a string to a maximum length.
 * @param {string} str
 * @param {number} maxLength
 */
export function truncate(str, maxLength = 50) {
  if (!str) return ''
  return str.length <= maxLength ? str : str.slice(0, maxLength).trimEnd() + '…'
}

/**
 * Generate initials from a full name.
 * @param {string} name
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}
