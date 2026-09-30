import { createProjectRecord } from './projectsListMock'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// Shape = the contract the backend `GET /projects/stats` should return.
const STATS = {
  activeTracks: { value: 19, accounts: 12 },
  onTrack: { value: 14, velocityPercent: 73.6 },
  clientReview: { value: 3, avgResponseDays: 2.4 },
  blocked: { value: 2, urgent: true },
  pipeline: { value: 384000, billed: 298000, billedPercent: 77.6 },
}

export async function mockFetchProjectStats() {
  await delay(250)
  return structuredClone(STATS) // deep copy: callers must never share the mock's internal objects
}

export async function mockCreateProject(payload) {
  await delay(300)
  const record = await createProjectRecord(payload)
  // Mock only: the real backend recomputes stats itself
  STATS.activeTracks.value += 1
  STATS.onTrack.value += 1
  STATS.pipeline.value += payload.budget ?? 0
  return record
}