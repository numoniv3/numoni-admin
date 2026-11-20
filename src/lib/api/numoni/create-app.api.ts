import { NUMONI_ENDPOINTS } from './endpoints'
import { apiGet, apiSend, identity, toFormData } from './request'
import type { SendOptions } from './request'
import type { CreateAppAddProductKeyBody, CreateAppBulkUpdateAppsBody, CreateAppCreateAppBody, CreateAppListAppTransactionsParams, CreateAppListDriveDocumentsParams, CreateAppRejectAppBody, CreateAppUpdateAppBody, CreateAppUpdateDriveDocumentBody, CreateAppUploadDriveDocumentBody } from './types/create-app'
import type { UntypedBody } from './types/compliance'

/*
 * Create-App MS through the Gateway (`/create-app/*`). Exported from the barrel as
 * `createAppApi`: `createAppApi.listApps(…)`.
 * Reads go through `apiGet` (fixture while mocked); writes through `apiSend`.
 */

const E = NUMONI_ENDPOINTS.createApp

/**
 * Get all apps
 * Get all apps.
 * The spec leaves the response untyped.
 * @endpoint GET /create-app/apps
 */
export function listApps(): Promise<unknown> {
  return apiGet<unknown>(E.apps, () => ({}))
}

/**
 * Create a new app
 * Create a new app. Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint POST /create-app/apps
 */
export function createApp(body: CreateAppCreateAppBody): Promise<unknown> {
  return apiSend('POST', E.apps, body, identity, () => ({}))
}

/**
 * Get apps by merchant ID
 * Get apps by merchant ID. For the signed-in merchant (store owner).
 * The spec leaves the response untyped.
 * @endpoint GET /create-app/apps/merchant/{merchantId}
 */
export function listMerchantApps(merchantId: string): Promise<unknown> {
  return apiGet<unknown>(E.appsMerchant(merchantId), () => ({}))
}

/**
 * Get app by ID
 * Get app by ID.
 * The spec leaves the response untyped.
 * @endpoint GET /create-app/apps/{id}
 */
export function getApp(id: string): Promise<unknown> {
  return apiGet<unknown>(E.app(id), () => ({}))
}

/**
 * Update app
 * Update app.
 * The spec leaves the response untyped.
 * @endpoint PUT /create-app/apps/{id}
 */
export function updateApp(id: string, body: CreateAppUpdateAppBody): Promise<unknown> {
  return apiSend('PUT', E.app(id), body, identity, () => ({}))
}

/**
 * Delete app
 * Delete app.
 * The spec leaves the response untyped.
 * @endpoint DELETE /create-app/apps/{id}
 */
export function deleteApp(id: string): Promise<unknown> {
  return apiSend('DELETE', E.app(id), undefined, identity, () => ({}))
}

/**
 * Submit app for review
 * Submit app for review.
 * The spec leaves the response untyped.
 * @endpoint POST /create-app/apps/{id}/submit
 */
export function submitApp(id: string, body: UntypedBody = {}): Promise<unknown> {
  return apiSend('POST', E.appSubmit(id), body, identity, () => ({}))
}

/**
 * Approve app
 * Approve app.
 * The spec leaves the response untyped.
 * @endpoint POST /create-app/apps/{id}/approve
 */
export function approveApp(id: string, body: UntypedBody = {}): Promise<unknown> {
  return apiSend('POST', E.appApprove(id), body, identity, () => ({}))
}

/**
 * Reject app
 * Reject app.
 * The spec leaves the response untyped.
 * @endpoint POST /create-app/apps/{id}/reject
 */
export function rejectApp(id: string, body: CreateAppRejectAppBody): Promise<unknown> {
  return apiSend('POST', E.appReject(id), body, identity, () => ({}))
}

/**
 * Add product key to app
 * Add product key to app.
 * The spec leaves the response untyped.
 * @endpoint POST /create-app/apps/{id}/product-key
 */
export function addProductKey(id: string, body: CreateAppAddProductKeyBody): Promise<unknown> {
  return apiSend('POST', E.appProductKey(id), body, identity, () => ({}))
}

/**
 * Get product keys for app
 * Get product keys for app.
 * The spec leaves the response untyped.
 * @endpoint GET /create-app/apps/{id}/product-keys
 */
export function listProductKeys(id: string): Promise<unknown> {
  return apiGet<unknown>(E.appProductKeys(id), () => ({}))
}

/**
 * Get transactions for app
 * Get transactions for app.
 * The spec leaves the response untyped.
 * @endpoint GET /create-app/apps/{id}/transactions
 */
export function listAppTransactions(id: string, params: CreateAppListAppTransactionsParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.appTransactions(id), () => ({}), { ...params })
}

/**
 * Get transaction stats for app
 * Get transaction stats for app.
 * The spec leaves the response untyped.
 * @endpoint GET /create-app/apps/{id}/transaction-stats
 */
export function getAppTransactionStats(id: string): Promise<unknown> {
  return apiGet<unknown>(E.appTransactionStats(id), () => ({}))
}

/**
 * Upload document to app drive
 * Upload document to app drive.
 * The spec leaves the response untyped.
 * @endpoint POST /create-app/apps/{id}/drive/documents
 */
export function uploadDriveDocument(id: string, body: CreateAppUploadDriveDocumentBody, opts: SendOptions = {}): Promise<unknown> {
  return apiSend('POST', E.appDriveDocuments(id), toFormData(body), identity, () => ({}), { multipart: true, ...opts })
}

/**
 * Get documents for app drive
 * Get documents for app drive.
 * The spec leaves the response untyped.
 * @endpoint GET /create-app/apps/{id}/drive/documents
 */
export function listDriveDocuments(id: string, params: CreateAppListDriveDocumentsParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.appDriveDocuments(id), () => ({}), { ...params })
}

/**
 * Get document by ID
 * Get document by ID.
 * The spec leaves the response untyped.
 * @endpoint GET /create-app/apps/{id}/drive/documents/{documentId}
 */
export function getDriveDocument(id: string, documentId: string): Promise<unknown> {
  return apiGet<unknown>(E.appDriveDocument(id, documentId), () => ({}))
}

/**
 * Update document
 * Update document.
 * The spec leaves the response untyped.
 * @endpoint PUT /create-app/apps/{id}/drive/documents/{documentId}
 */
export function updateDriveDocument(id: string, documentId: string, body: CreateAppUpdateDriveDocumentBody): Promise<unknown> {
  return apiSend('PUT', E.appDriveDocument(id, documentId), body, identity, () => ({}))
}

/**
 * Delete document
 * Delete document.
 * The spec leaves the response untyped.
 * @endpoint DELETE /create-app/apps/{id}/drive/documents/{documentId}
 */
export function deleteDriveDocument(id: string, documentId: string): Promise<unknown> {
  return apiSend('DELETE', E.appDriveDocument(id, documentId), undefined, identity, () => ({}))
}

/**
 * Get document stats for app drive
 * Get document stats for app drive.
 * The spec leaves the response untyped.
 * @endpoint GET /create-app/apps/{id}/drive/document-stats
 */
export function getDriveDocumentStats(id: string): Promise<unknown> {
  return apiGet<unknown>(E.appDriveDocumentStats(id), () => ({}))
}

/**
 * Get apps with metadata (API key required)
 * Get apps with metadata (API key required). Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint GET /create-app/apps/special/metadata
 */
export function listAppsWithMetadata(apiKey: string): Promise<unknown> {
  return apiSend('GET', E.appsSpecialMetadata, undefined, identity, () => ({}), { headers: { 'x-api-key': apiKey } })
}

/**
 * Bulk update apps (API key required)
 * Bulk update apps (API key required). Needs a signed-in user token.
 * The spec leaves the response untyped.
 * @endpoint PUT /create-app/apps/special/bulk
 */
export function bulkUpdateApps(body: CreateAppBulkUpdateAppsBody, apiKey: string): Promise<unknown> {
  return apiSend('PUT', E.appsSpecialBulk, body, identity, () => ({}), { headers: { 'x-api-key': apiKey } })
}

/**
 * Create-App MS opt-in
 * Creates or refreshes the Create-App MS user row for the signed-in user. Call it once before using this service.
 * The spec leaves the response untyped.
 * @endpoint POST /create-app/opt-in
 */
export function optIn(body: UntypedBody = {}): Promise<unknown> {
  return apiSend('POST', E.optIn, body, identity, () => ({}))
}
