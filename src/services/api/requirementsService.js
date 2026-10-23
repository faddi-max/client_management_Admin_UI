import { requirementsApi } from '@/services/api/requirementsApi'
import {
  mockFetchRequirements, mockCreateRequirement, mockUpdateRequirement, mockDeleteRequirement,
} from '@/mocks/requirementsMock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'

/**
 * @typedef {Object} RequirementAttachment
 * @property {string} id
 * @property {string} name
 * @property {number} size     bytes
 * @property {string} type     MIME type
 *
 * @typedef {Object} RequirementRow
 * @property {string|number} id
 * @property {string} code                 "REQ-1792738662482"
 * @property {string} title
 * @property {string} description
 * @property {string} clientName           contact person
 * @property {string} companyName
 * @property {string} projectName
 * @property {string} salesperson          TODO(api): replace with a user reference
 * @property {RequirementAttachment[]} attachments
 * @property {string} updatedAt            ISO datetime
 */

/** Contract: params → { items: RequirementRow[], meta: { total, page, perPage } }. Stable module-level fn. */
export async function fetchRequirements(params) {
  if (USE_MOCK) return mockFetchRequirements(params)
  const { data } = await requirementsApi.getAll(params)
  return { items: data.items, meta: data.meta }
}

const fields = (v) => ({
  title: v.title.trim(),
  description: v.description.trim(),
  clientName: v.clientName.trim(),
  companyName: v.companyName.trim(),
  projectName: v.projectName.trim(),
  salesperson: v.salesperson.trim(),
})

const meta = ({ id, name, size, type }) => ({ id, name, size, type })

// Form values → multipart body: new files go in `files`; already-saved attachments to keep go in `keepAttachmentIds`.
function toFormData(v) {
  const fd = new FormData()
  Object.entries(fields(v)).forEach(([k, val]) => fd.append(k, val))
  v.attachments.filter((a) => a.file).forEach((a) => fd.append('files', a.file))
  fd.append('keepAttachmentIds', JSON.stringify(v.attachments.filter((a) => !a.file).map((a) => a.id)))
  return fd
}

export async function createRequirement(values) {
  if (USE_MOCK) return mockCreateRequirement({ ...fields(values), attachments: values.attachments.map(meta) })
  const { data } = await requirementsApi.create(toFormData(values))
  return data
}

export async function updateRequirement(id, values) {
  if (USE_MOCK) return mockUpdateRequirement(id, { ...fields(values), attachments: values.attachments.map(meta) })
  const { data } = await requirementsApi.update(id, toFormData(values))
  return data
}

export async function deleteRequirement(id) {
  if (USE_MOCK) return mockDeleteRequirement(id)
  await requirementsApi.remove(id)
}