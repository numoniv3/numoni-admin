import * as C from '@/lib/api/numoni/compliance.api'
import { numoniKeys } from '@/lib/api/numoni/query-keys'
import type { UntypedBody } from '@/lib/api/numoni/types/compliance'
import { useMsAction, useMsQuery } from './ms-hooks'

/*
 * Compliance MS (KYC) through the Gateway. The spec documents no request or
 * response schemas for this service, so payloads are untyped and screens
 * render what comes back.
 */

const K = numoniKeys.compliance
const opt = { optIn: 'compliance' as const }
const all = [K.all]

// ── business (merchant / brand / enterprise / reseller) ─────────────────────
export const BUSINESS_READS = {
  status: { label: 'KYC status', key: K.getBusinessKycStatus(), fn: C.getBusinessKycStatus },
  info: { label: 'Business info', key: K.getBusinessInfo(), fn: C.getBusinessInfo },
  survey: { label: 'Business survey', key: K.getBusinessSurvey(), fn: C.getBusinessSurvey },
  owners: { label: 'Beneficial owners', key: K.getBeneficialOwners(), fn: C.getBeneficialOwners },
  documents: { label: 'Documents', key: K.listBusinessDocuments(), fn: C.listBusinessDocuments },
  risk: { label: 'Risk assessment', key: K.getBusinessRiskAssessment(), fn: C.getBusinessRiskAssessment },
  edd: { label: 'Enhanced due diligence', key: K.getEnhancedDueDiligence(), fn: C.getEnhancedDueDiligence },
  corporate: { label: 'Corporate structure', key: K.getCorporateStructure(), fn: C.getCorporateStructure },
  nonProfit: { label: 'Non-profit verification', key: K.getNonProfitVerification(), fn: C.getNonProfitVerification },
  government: { label: 'Government verification', key: K.getGovernmentVerification(), fn: C.getGovernmentVerification },
} as const
export const useBusinessRead = (r: keyof typeof BUSINESS_READS) => useMsQuery(BUSINESS_READS[r].key, BUSINESS_READS[r].fn, opt)
export const useBusinessDocument = (id: string | null) => useMsQuery(K.getBusinessDocument(id ?? ''), () => C.getBusinessDocument(id!), { enabled: !!id })

export const useSubmitBusinessKyc = () => useMsAction((b: UntypedBody) => C.submitBusinessKyc(b), { ...opt, success: 'Business KYC submitted for review', error: 'Couldn’t submit KYC', invalidate: all })
export const useUpdateBusinessInfo = () => useMsAction((b: UntypedBody) => C.updateBusinessInfo(b), { ...opt, success: 'Business info saved', error: 'Couldn’t save business info', invalidate: all })
export const useUpdateBusinessSurvey = () => useMsAction((b: UntypedBody) => C.updateBusinessSurvey(b), { ...opt, success: 'Survey saved', error: 'Couldn’t save the survey', invalidate: all })
export const useUpdateBeneficialOwners = () => useMsAction((b: UntypedBody) => C.updateBeneficialOwners(b), { ...opt, success: 'Beneficial owners saved', error: 'Couldn’t save the owners', invalidate: all })

// shareholders + liveness (keyed by the merchant's id)
export const useShareholders = (merchantId: string) => useMsQuery(K.getShareholders(merchantId), () => C.getShareholders(merchantId), opt)
export const useCreateShareholders = () => useMsAction(({ merchantId, body }: { merchantId: string; body: UntypedBody }) => C.createShareholders(merchantId, body), { ...opt, success: 'Shareholder added', error: 'Couldn’t add the shareholder', invalidate: all })
export const useUpdateShareholders = () => useMsAction(({ merchantId, body }: { merchantId: string; body: UntypedBody }) => C.updateShareholders(merchantId, body), { ...opt, success: 'Shareholders updated', error: 'Couldn’t update shareholders', invalidate: all })
export const useGenerateLiveness = () => useMsAction((shareholderId: string) => C.generateLivenessUrl(shareholderId), { ...opt, error: 'Couldn’t create the liveness link' })
export const useLivenessStatus = (ref: string | null) => useMsQuery(K.getLivenessStatus(ref ?? ''), () => C.getLivenessStatus(ref!), { enabled: !!ref })

// ── individual (consumer) ────────────────────────────────────────────────────
export const INDIVIDUAL_READS = {
  status: { label: 'KYC status', key: K.getIndividualKycStatus(), fn: C.getIndividualKycStatus },
  documents: { label: 'Documents', key: K.listIndividualDocuments(), fn: C.listIndividualDocuments },
  risk: { label: 'Risk assessment', key: K.getIndividualRiskAssessment(), fn: C.getIndividualRiskAssessment },
  enhanced: { label: 'Enhanced verification', key: K.getIndividualEnhancedVerification(), fn: C.getIndividualEnhancedVerification },
} as const
export const useIndividualRead = (r: keyof typeof INDIVIDUAL_READS) => useMsQuery(INDIVIDUAL_READS[r].key, INDIVIDUAL_READS[r].fn, opt)
export const useIndividualDocument = (id: string | null) => useMsQuery(K.getIndividualDocument(id ?? ''), () => C.getIndividualDocument(id!), { enabled: !!id })
export const useSubmitIndividualKyc = () => useMsAction((b: UntypedBody) => C.submitIndividualKyc(b), { ...opt, success: 'KYC submitted for review', error: 'Couldn’t submit KYC', invalidate: all })
export const useUpdatePersonalInfo = () => useMsAction((b: UntypedBody) => C.updatePersonalInfo(b), { ...opt, success: 'Personal info saved', error: 'Couldn’t save your details', invalidate: all })

// ── admin review ─────────────────────────────────────────────────────────────
export const ADMIN_LISTS = {
  pending: { label: 'Pending review', key: K.listPendingReviews(), fn: C.listPendingReviews },
  highRisk: { label: 'High risk', key: K.listHighRiskProfiles(), fn: C.listHighRiskProfiles },
  profiles: { label: 'All profiles', key: K.searchProfiles(), fn: C.searchProfiles },
  legacy: { label: 'KYC records', key: K.searchKyc(), fn: C.searchKyc },
} as const
export const useAdminList = (l: keyof typeof ADMIN_LISTS) => useMsQuery(ADMIN_LISTS[l].key, ADMIN_LISTS[l].fn)
export const useRiskSummary = () => useMsQuery(K.getRiskSummary(), C.getRiskSummary)
export const useComplianceMetrics = () => useMsQuery(K.getComplianceMetrics(), C.getComplianceMetrics)

/** Everything about one user: individual + business profile, KYC status, documents. */
export const useUserKyc = (userId: string) => ({
  individual: useMsQuery(K.getIndividualProfile(userId), () => C.getIndividualProfile(userId)),
  business: useMsQuery(K.getBusinessProfile(userId), () => C.getBusinessProfile(userId)),
  status: useMsQuery(K.getKycStatus(userId), () => C.getKycStatus(userId)),
  documents: useMsQuery(K.listUserDocuments(userId), () => C.listUserDocuments(userId)),
})
export const useDocument = (id: string | null) => useMsQuery(K.getDocument(id ?? ''), () => C.getDocument(id!), { enabled: !!id })

export const useCheckSanctions = () => useMsAction((b: UntypedBody) => C.checkSanctions(b), { success: 'Sanctions check complete', error: 'Sanctions check failed' })
export const useSetDocumentStatus = () => useMsAction(({ id, body }: { id: string; body: UntypedBody }) => C.setDocumentStatus(id, body), { success: 'Document status updated', error: 'Couldn’t update the document', invalidate: all })
export const useVerifyDocumentAml = () => useMsAction((id: string) => C.verifyDocumentAml(id), { success: 'AML verification requested', error: 'AML verification failed', invalidate: all })
export const useUpdateDocumentLegacy = () => useMsAction(({ id, body }: { id: string; body: UntypedBody }) => C.updateDocumentStatus(id, body), { success: 'Document updated', error: 'Couldn’t update the document', invalidate: all })
export const useReviewKyc = () => useMsAction(({ kycId, body }: { kycId: string; body: UntypedBody }) => C.reviewKyc(kycId, body), { success: 'Review recorded', error: 'Couldn’t record the review', invalidate: all })
export const useCreateKycProfile = () => useMsAction(({ userId, body }: { userId: string; body: UntypedBody }) => C.createKycProfile(userId, body), { success: 'KYC profile created', error: 'Couldn’t create the profile', invalidate: all })
export const useSubmitKycLegacy = () => useMsAction((b: UntypedBody) => C.submitKycLegacy(b), { success: 'KYC submitted', error: 'Couldn’t submit KYC', invalidate: all })
