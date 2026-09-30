// Project domain vocabulary — single source of truth for the UI, the mocks
// and (later) the API contract.
//
// NOT defined in the PRD. Proposed and confirmed in chat on 29 Sep 2026;
// revisit if the PRD is updated.
//
// A project has TWO independent fields:
//   stage  → where it is in the delivery lifecycle (lifecycle tabs)
//   status → its delivery health (status filter + stat cards)

export const STAGES = [
  { value: 'planning', label: 'Planning' },
  { value: 'design', label: 'Design' },
  { value: 'development', label: 'Development' },
  { value: 'testing', label: 'Testing & QA' },
  { value: 'deployment', label: 'Deployment' },
]

export const STATUSES = [
  { value: 'in_progress', label: 'In Progress' },
  { value: 'client_review', label: 'Client Review' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'completed', label: 'Completed' },
]