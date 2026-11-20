import type { Field } from '@/modules/ms/components/shared/ActionForm'

/** `CreateAppCreateAppBody` / `CreateAppUpdateAppBody`. */
export const APP_FIELDS: Field[] = [
  { key: 'name', label: 'App name', required: true, placeholder: 'e.g. Charles Store Rewards' },
  { key: 'alias', label: 'Alias', required: true, placeholder: 'e.g. charles-rewards', hint: 'Short handle used in links.' },
  { key: 'websiteUrl', label: 'Website', required: true, placeholder: 'https://…', wide: true },
  { key: 'description', label: 'Description', kind: 'textarea', required: true },
]
