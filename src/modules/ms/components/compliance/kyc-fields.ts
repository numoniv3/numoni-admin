import type { Field } from '@/modules/ms/components/shared/ActionForm'

/*
 * Default KYC form fields. The Compliance MS spec documents no request
 * bodies, so these are the standard Nigerian KYC fields; `fieldsFrom` adds any
 * other field the service returns for the account.
 */

const STATES = ['Lagos', 'Abuja (FCT)', 'Rivers', 'Kano', 'Oyo', 'Ogun', 'Kaduna', 'Enugu', 'Delta', 'Edo', 'Anambra', 'Other']

export const BUSINESS_INFO: Field[] = [
  { key: 'businessName', label: 'Registered business name', required: true },
  { key: 'registrationNumber', label: 'CAC registration (RC/BN) number', required: true },
  { key: 'tin', label: 'Tax ID (TIN)' },
  { key: 'businessType', label: 'Business type', kind: 'select', options: ['SOLE_PROPRIETORSHIP', 'PARTNERSHIP', 'LIMITED_LIABILITY', 'PUBLIC_COMPANY', 'NON_PROFIT', 'GOVERNMENT'] },
  { key: 'industry', label: 'Industry' },
  { key: 'incorporationDate', label: 'Date of incorporation', kind: 'date' },
  { key: 'address', label: 'Registered address', wide: true },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State', kind: 'select', options: STATES.map((s) => ({ value: s, label: s })) },
  { key: 'country', label: 'Country', placeholder: 'Nigeria' },
  { key: 'website', label: 'Website' },
  { key: 'email', label: 'Business email' },
  { key: 'phone', label: 'Business phone', kind: 'phone' },
]

export const BUSINESS_SURVEY: Field[] = [
  { key: 'annualTurnover', label: 'Annual turnover (₦)', kind: 'number' },
  { key: 'expectedMonthlyVolume', label: 'Expected monthly volume (₦)', kind: 'number' },
  { key: 'employeeCount', label: 'Employees', kind: 'number' },
  { key: 'sourceOfFunds', label: 'Source of funds', kind: 'select', options: ['SALES_REVENUE', 'INVESTMENT', 'LOANS', 'GRANTS', 'DONATIONS', 'OTHER'] },
  { key: 'purposeOfAccount', label: 'Purpose of account', wide: true },
  { key: 'operatesInternationally', label: 'Operates outside Nigeria', kind: 'switch' },
  { key: 'isPoliticallyExposed', label: 'Any owner is a PEP', kind: 'switch' },
]

export const BENEFICIAL_OWNER: Field[] = [
  { key: 'fullName', label: 'Full name', required: true },
  { key: 'ownershipPercentage', label: 'Ownership (%)', kind: 'number', required: true },
  { key: 'nationality', label: 'Nationality' },
  { key: 'dateOfBirth', label: 'Date of birth', kind: 'date' },
  { key: 'idType', label: 'ID type', kind: 'select', options: ['NIN', 'BVN', 'PASSPORT', 'DRIVERS_LICENSE', 'VOTERS_CARD'] },
  { key: 'idNumber', label: 'ID number' },
  { key: 'address', label: 'Residential address', wide: true },
  { key: 'isPoliticallyExposed', label: 'Politically exposed person', kind: 'switch' },
]

export const SHAREHOLDER: Field[] = [
  { key: 'firstName', label: 'First name', required: true },
  { key: 'lastName', label: 'Last name', required: true },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone', kind: 'phone' },
  { key: 'ownershipPercentage', label: 'Shareholding (%)', kind: 'number' },
  { key: 'role', label: 'Role', kind: 'select', options: ['DIRECTOR', 'SHAREHOLDER', 'DIRECTOR_AND_SHAREHOLDER', 'SIGNATORY'] },
]

export const PERSONAL_INFO: Field[] = [
  { key: 'firstName', label: 'First name', required: true },
  { key: 'lastName', label: 'Last name', required: true },
  { key: 'middleName', label: 'Middle name' },
  { key: 'dateOfBirth', label: 'Date of birth', kind: 'date' },
  { key: 'gender', label: 'Gender', kind: 'select', options: ['MALE', 'FEMALE'] },
  { key: 'nationality', label: 'Nationality', placeholder: 'Nigerian' },
  { key: 'bvn', label: 'BVN' },
  { key: 'nin', label: 'NIN' },
  { key: 'occupation', label: 'Occupation' },
  { key: 'address', label: 'Home address', wide: true },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State', kind: 'select', options: STATES.map((s) => ({ value: s, label: s })) },
]

export const SUBMIT_DOCUMENTS: Field[] = [
  { key: 'documentType', label: 'Document type', kind: 'select', options: ['CAC_CERTIFICATE', 'MEMART', 'UTILITY_BILL', 'ID_CARD', 'PASSPORT', 'TIN_CERTIFICATE', 'BANK_STATEMENT', 'SELFIE', 'OTHER'] },
  { key: 'documentUrls', label: 'Document links', kind: 'list', wide: true, hint: 'Comma separated — upload files first to get their links.' },
  { key: 'notes', label: 'Notes for the reviewer', kind: 'textarea' },
]
