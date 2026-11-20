import { NUMONI_ENDPOINTS } from './endpoints'
import { apiGet, apiSend, identity } from './request'
import type { UntypedBody } from './types/compliance'

/*
 * Compliance MS (KYC) through the Gateway (`/compliance/*`). Exported from the barrel as
 * `complianceApi`: `complianceApi.submitBusinessKyc(…)`.
 * Reads go through `apiGet` (fixture while mocked); writes through `apiSend`.
 */

const E = NUMONI_ENDPOINTS.compliance

/**
 * Submit business KYC
 * Submit business KYC. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint POST /compliance/kyc/business/submit
 */
export function submitBusinessKyc(body: UntypedBody = {}): Promise<unknown> {
  return apiSend('POST', E.businessSubmit, body, identity, () => ({}))
}

/**
 * Get business KYC status
 * Get business KYC status. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/business/status
 */
export function getBusinessKycStatus(): Promise<unknown> {
  return apiGet<unknown>(E.businessStatus, () => ({}))
}

/**
 * Get business KYC documents
 * Get business KYC documents. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/business/documents
 */
export function listBusinessDocuments(): Promise<unknown> {
  return apiGet<unknown>(E.businessDocuments, () => ({}))
}

/**
 * Get document by ID
 * Get document by ID. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/business/document/{documentId}
 */
export function getBusinessDocument(documentId: string): Promise<unknown> {
  return apiGet<unknown>(E.businessDocument(documentId), () => ({}))
}

/**
 * Get business info
 * Get business info. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/business/business-info
 */
export function getBusinessInfo(): Promise<unknown> {
  return apiGet<unknown>(E.businessBusinessInfo, () => ({}))
}

/**
 * Update business info
 * Update business info. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint PUT /compliance/kyc/business/business-info
 */
export function updateBusinessInfo(body: UntypedBody = {}): Promise<unknown> {
  return apiSend('PUT', E.businessBusinessInfo, body, identity, () => ({}))
}

/**
 * Get business survey
 * Get business survey. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/business/business-survey
 */
export function getBusinessSurvey(): Promise<unknown> {
  return apiGet<unknown>(E.businessBusinessSurvey, () => ({}))
}

/**
 * Update business survey
 * Update business survey. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint PUT /compliance/kyc/business/business-survey
 */
export function updateBusinessSurvey(body: UntypedBody = {}): Promise<unknown> {
  return apiSend('PUT', E.businessBusinessSurvey, body, identity, () => ({}))
}

/**
 * Get beneficial owners
 * Get beneficial owners. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/business/beneficial-owners
 */
export function getBeneficialOwners(): Promise<unknown> {
  return apiGet<unknown>(E.businessBeneficialOwners, () => ({}))
}

/**
 * Update beneficial owners
 * Update beneficial owners. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint PUT /compliance/kyc/business/beneficial-owners
 */
export function updateBeneficialOwners(body: UntypedBody = {}): Promise<unknown> {
  return apiSend('PUT', E.businessBeneficialOwners, body, identity, () => ({}))
}

/**
 * Get business risk assessment
 * Get business risk assessment. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/business/risk-assessment
 */
export function getBusinessRiskAssessment(): Promise<unknown> {
  return apiGet<unknown>(E.businessRiskAssessment, () => ({}))
}

/**
 * Get enhanced due diligence (high-risk)
 * Get enhanced due diligence (high-risk). Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/business/enhanced-due-diligence
 */
export function getEnhancedDueDiligence(): Promise<unknown> {
  return apiGet<unknown>(E.businessEnhancedDueDiligence, () => ({}))
}

/**
 * Get corporate structure
 * Get corporate structure. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/business/corporate-structure
 */
export function getCorporateStructure(): Promise<unknown> {
  return apiGet<unknown>(E.businessCorporateStructure, () => ({}))
}

/**
 * Get non-profit verification
 * Get non-profit verification. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/business/non-profit-verification
 */
export function getNonProfitVerification(): Promise<unknown> {
  return apiGet<unknown>(E.businessNonProfitVerification, () => ({}))
}

/**
 * Get government verification
 * Get government verification. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/business/government-verification
 */
export function getGovernmentVerification(): Promise<unknown> {
  return apiGet<unknown>(E.businessGovernmentVerification, () => ({}))
}

/**
 * Search KYC profiles
 * Search KYC profiles. Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/admin/profiles
 */
export function searchProfiles(): Promise<unknown> {
  return apiGet<unknown>(E.adminProfiles, () => ({}))
}

/**
 * Get pending reviews
 * Get pending reviews. Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/admin/profiles/pending-review
 */
export function listPendingReviews(): Promise<unknown> {
  return apiGet<unknown>(E.adminProfilesPendingReview, () => ({}))
}

/**
 * Get high-risk profiles
 * Get high-risk profiles. Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/admin/profiles/high-risk
 */
export function listHighRiskProfiles(): Promise<unknown> {
  return apiGet<unknown>(E.adminProfilesHighRisk, () => ({}))
}

/**
 * Check sanctions
 * Check sanctions. Admin only.
 * The spec leaves the response untyped.
 * @endpoint POST /compliance/kyc/admin/check-sanctions
 */
export function checkSanctions(body: UntypedBody = {}): Promise<unknown> {
  return apiSend('POST', E.adminCheckSanctions, body, identity, () => ({}))
}

/**
 * Get individual profile
 * Get individual profile. Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/admin/individuals/{userId}
 */
export function getIndividualProfile(userId: string): Promise<unknown> {
  return apiGet<unknown>(E.adminIndividual(userId), () => ({}))
}

/**
 * Get business profile
 * Get business profile. Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/admin/businesses/{userId}
 */
export function getBusinessProfile(userId: string): Promise<unknown> {
  return apiGet<unknown>(E.adminBusiness(userId), () => ({}))
}

/**
 * Update document status
 * Update document status. Admin only.
 * The spec leaves the response untyped.
 * @endpoint PUT /compliance/kyc/admin/document/{documentId}/status
 */
export function setDocumentStatus(documentId: string, body: UntypedBody = {}): Promise<unknown> {
  return apiSend('PUT', E.adminDocumentStatus(documentId), body, identity, () => ({}))
}

/**
 * Verify document via AML
 * Verify document via AML. Admin only.
 * The spec leaves the response untyped.
 * @endpoint POST /compliance/kyc/admin/document/{documentId}/verify-aml
 */
export function verifyDocumentAml(documentId: string, body: UntypedBody = {}): Promise<unknown> {
  return apiSend('POST', E.adminDocumentVerifyAml(documentId), body, identity, () => ({}))
}

/**
 * Get risk summary report
 * Get risk summary report. Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/admin/reports/risk-summary
 */
export function getRiskSummary(): Promise<unknown> {
  return apiGet<unknown>(E.adminReportsRiskSummary, () => ({}))
}

/**
 * Get compliance metrics
 * Get compliance metrics. Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/admin/reports/compliance-metrics
 */
export function getComplianceMetrics(): Promise<unknown> {
  return apiGet<unknown>(E.adminReportsComplianceMetrics, () => ({}))
}

/**
 * Submit individual KYC
 * Submit individual KYC. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint POST /compliance/kyc/individual/submit
 */
export function submitIndividualKyc(body: UntypedBody = {}): Promise<unknown> {
  return apiSend('POST', E.individualSubmit, body, identity, () => ({}))
}

/**
 * Get individual KYC status
 * Get individual KYC status. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/individual/status
 */
export function getIndividualKycStatus(): Promise<unknown> {
  return apiGet<unknown>(E.individualStatus, () => ({}))
}

/**
 * Get individual KYC documents
 * Get individual KYC documents. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/individual/documents
 */
export function listIndividualDocuments(): Promise<unknown> {
  return apiGet<unknown>(E.individualDocuments, () => ({}))
}

/**
 * Get document by ID
 * Get document by ID. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/individual/document/{documentId}
 */
export function getIndividualDocument(documentId: string): Promise<unknown> {
  return apiGet<unknown>(E.individualDocument(documentId), () => ({}))
}

/**
 * Get individual risk assessment
 * Get individual risk assessment. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/individual/risk-assessment
 */
export function getIndividualRiskAssessment(): Promise<unknown> {
  return apiGet<unknown>(E.individualRiskAssessment, () => ({}))
}

/**
 * Update personal info
 * Update personal info. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint PUT /compliance/kyc/individual/personal-info
 */
export function updatePersonalInfo(body: UntypedBody = {}): Promise<unknown> {
  return apiSend('PUT', E.individualPersonalInfo, body, identity, () => ({}))
}

/**
 * Get enhanced verification status (high-risk)
 * Get enhanced verification status (high-risk). Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/individual/enhanced-verification
 */
export function getIndividualEnhancedVerification(): Promise<unknown> {
  return apiGet<unknown>(E.individualEnhancedVerification, () => ({}))
}

/**
 * Submit KYC (legacy)
 * Submit KYC (legacy). Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint POST /compliance/kyc/submit
 */
export function submitKycLegacy(body: UntypedBody = {}): Promise<unknown> {
  return apiSend('POST', E.submit, body, identity, () => ({}))
}

/**
 * Get KYC status by user
 * Get KYC status by user. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/status/{userId}
 */
export function getKycStatus(userId: string): Promise<unknown> {
  return apiGet<unknown>(E.statu(userId), () => ({}))
}

/**
 * Create minimal KYC profile
 * Create minimal KYC profile. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint POST /compliance/kyc/profile/{userId}
 */
export function createKycProfile(userId: string, body: UntypedBody = {}): Promise<unknown> {
  return apiSend('POST', E.profile(userId), body, identity, () => ({}))
}

/**
 * Get all KYC documents for user
 * Get all KYC documents for user. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/documents/{userId}
 */
export function listUserDocuments(userId: string): Promise<unknown> {
  return apiGet<unknown>(E.document(userId), () => ({}))
}

/**
 * Get KYC document by ID
 * Get KYC document by ID. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/document/{documentId}
 */
export function getDocument(documentId: string): Promise<unknown> {
  return apiGet<unknown>(E.documentByDocumentId(documentId), () => ({}))
}

/**
 * Update document status
 * Update document status. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint PUT /compliance/kyc/document/{documentId}
 */
export function updateDocumentStatus(documentId: string, body: UntypedBody = {}): Promise<unknown> {
  return apiSend('PUT', E.documentByDocumentId(documentId), body, identity, () => ({}))
}

/**
 * Review KYC submission
 * Review KYC submission. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint POST /compliance/kyc/review/{kycId}
 */
export function reviewKyc(kycId: string, body: UntypedBody = {}): Promise<unknown> {
  return apiSend('POST', E.review(kycId), body, identity, () => ({}))
}

/**
 * Search KYC profiles
 * Search KYC profiles. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/search
 */
export function searchKyc(): Promise<unknown> {
  return apiGet<unknown>(E.search, () => ({}))
}

/**
 * Create shareholder data
 * Create shareholder data.
 * The spec leaves the response untyped.
 * @endpoint POST /compliance/kyc/business/{merchantId}/shareholders/create
 */
export function createShareholders(merchantId: string, body: UntypedBody = {}): Promise<unknown> {
  return apiSend('POST', E.businessShareholdersCreate(merchantId), body, identity, () => ({}))
}

/**
 * Get shareholder data
 * Get shareholder data.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/business/{merchantId}/shareholders
 */
export function getShareholders(merchantId: string): Promise<unknown> {
  return apiGet<unknown>(E.businessShareholders(merchantId), () => ({}))
}

/**
 * Update shareholder data
 * Update shareholder data.
 * The spec leaves the response untyped.
 * @endpoint PUT /compliance/kyc/business/{merchantId}/shareholders
 */
export function updateShareholders(merchantId: string, body: UntypedBody = {}): Promise<unknown> {
  return apiSend('PUT', E.businessShareholders(merchantId), body, identity, () => ({}))
}

/**
 * Check liveness test status
 * Check liveness test status.
 * The spec leaves the response untyped.
 * @endpoint GET /compliance/kyc/liveness/status/{providerReference}
 */
export function getLivenessStatus(providerReference: string): Promise<unknown> {
  return apiGet<unknown>(E.livenessStatu(providerReference), () => ({}))
}

/**
 * Generate liveness test URL for shareholder
 * Generate liveness test URL for shareholder.
 * The spec leaves the response untyped.
 * @endpoint POST /compliance/kyc/liveness/generate/{shareholderId}
 */
export function generateLivenessUrl(shareholderId: string, body: UntypedBody = {}): Promise<unknown> {
  return apiSend('POST', E.livenessGenerate(shareholderId), body, identity, () => ({}))
}

/**
 * Compliance MS opt-in
 * Creates or refreshes the Compliance MS user row for the signed-in user. Call it once before using this service.
 * The spec leaves the response untyped.
 * @endpoint POST /compliance/opt-in
 */
export function optIn(body: UntypedBody = {}): Promise<unknown> {
  return apiSend('POST', E.optIn, body, identity, () => ({}))
}
