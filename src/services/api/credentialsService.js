import { credentialsApi } from '@/services/api/credentialsApi'
import {
  mockFetchCredentials, mockFetchCredentialsOverview, mockFetchCredentialFacets,
  mockCreateCredential, mockRevealCredential, mockCopyCredential,
} from '@/mocks/credentialsMock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'

/**
 * @typedef {Object} CredentialRow  — metadata ONLY. The secret value is never part of a row.
 * @property {string|number} id
 * @property {string} name
 * @property {'hosting_cloud'|'registrar_dns'|'database'|'payment_gateway'|'cms_app'|'api_key'} category
 * @property {{ id: string|number, name: string }} client
 * @property {'production'|'staging'|'infrastructure'} environment
 * @property {string|null} identifier        non-secret display hint (role ARN, key prefix, app id…). Must never contain the secret.
 * @property {string|null} lastRotatedAt     ISO datetime
 * @property {string|null} lastRotatedBy     display name
 * @property {'ops_lead'|'restricted'|'team'} accessTier
 */

/**
 * @typedef {Object} CredentialsOverview
 * @property {{ version: string, encryptionLabel: string, encryptionNote: string,
 *              securityMessage?: string, complianceLabel?: string|null }} vault
 * @property {{ totalKeys: { value: number, syncedPercent: number },
 *              pendingRotations: { value: number, staleDays: number },
 *              accessAudits: { value: number, sessions: number },
 *              integrity: { percent: number, status: 'optimal'|'degraded' } }} stats
 */

// The UI uses 'all' / '' to mean "no filter" — never send those to the API.
// TODO: same helper lives in projectsService — hoist to utils once approved.
const cleanParams = (params) =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== '' && v !== 'all'))

/** Contract: params → { items: CredentialRow[], meta: { total, page, perPage } }
 *  params: page, perPage, search, category, env, client (+ optional sort/order). Search matches name, client, environment, identifier.
 *  Stable module-level function (required by useResourceList). */
export async function fetchCredentials(params) {
  if (USE_MOCK) return mockFetchCredentials(params)
  const { data } = await credentialsApi.getAll(cleanParams(params))
  return { items: data.items, meta: data.meta }
}

/** Contract: () → CredentialsOverview */
export async function fetchCredentialsOverview() {
  if (USE_MOCK) return mockFetchCredentialsOverview()
  const { data } = await credentialsApi.getOverview()
  return data
}

/** Contract: () → { total, clients: [{value,label}] }  (clients that have credentials) */
export async function fetchCredentialFacets() {
  if (USE_MOCK) return mockFetchCredentialFacets()
  const { data } = await credentialsApi.getFacets()
  return data
}

/**
 * Form values → API payload. The secret travels once, over HTTPS, and is encrypted server-side.
 * Never log this payload.
 */
export async function createCredential(values) {
  const payload = {
    name: values.name.trim(),
    clientId: values.clientId,
    category: values.category,
    environment: values.environment,
    identifier: values.identifier.trim() || null,
    secret: values.secret,
  }
  if (USE_MOCK) return mockCreateCredential(payload)
  const { data } = await credentialsApi.create(payload)
  return data // metadata row, no secret
}

/** Contract: id → { value: string, expiresInSec?: number }. Audited server-side. Caller must not persist `value`. */
export async function revealCredential(id) {
  if (USE_MOCK) return mockRevealCredential(id)
  const { data } = await credentialsApi.reveal(id)
  return data
}

/** Contract: id → { value: string }. Audited server-side as a *copy* event (distinct from reveal). */
export async function copyCredential(id) {
  if (USE_MOCK) return mockCopyCredential(id)
  const { data } = await credentialsApi.copy(id)
  return data
}