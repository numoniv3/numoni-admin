import { EXPLORER_AGE_BANDS as AGE_BANDS, EXPLORER_INDUSTRIES as INDUSTRIES, EXPLORER_LOCATIONS as LOCATIONS, EXPLORER_SEGMENTS as SEGMENTS, EXPLORER_SOURCES as SOURCES } from '@/lib/api/numoni/types/admin'
import type { FieldId } from '@/modules/admin/components/data-explorer/DataExplorerPage'

export const FIELDS: { id: FieldId; label: string; type: 'cat' | 'num'; options?: string[] }[] = [
  { id: 'age', label: 'Age band', type: 'cat', options: AGE_BANDS },
  { id: 'gender', label: 'Gender', type: 'cat', options: ['Female', 'Male'] },
  { id: 'location', label: 'Location', type: 'cat', options: LOCATIONS },
  { id: 'source', label: 'Customer type', type: 'cat', options: [...SOURCES] },
  { id: 'industry', label: 'Industry', type: 'cat', options: INDUSTRIES },
  { id: 'segment', label: 'Segment', type: 'cat', options: SEGMENTS },
  { id: 'kyc', label: 'KYC tier', type: 'cat', options: ['1', '2', '3'] },
  { id: 'lifetime', label: 'Lifetime spend (₦)', type: 'num' },
  { id: 'visits', label: 'Visits (30d)', type: 'num' },
  { id: 'cards', label: 'Cards held', type: 'num' },
]
