/*
 * Create-App MS shapes, proxied by the Gateway (`specs/numoni.json`).
 * Generated from the spec's schemas — regenerate rather than hand-edit shapes.
 */

/** Request body of `POST /create-app/apps`. */
export interface CreateAppCreateAppBody {
  name: string
  websiteUrl: string
  alias: string
  description: string
  /** Optional; for admins. Merchants use their own ID from token. */
  merchantId?: string
}

/** Request body of `PUT /create-app/apps/{id}`. */
export interface CreateAppUpdateAppBody {
  name?: string
  websiteUrl?: string
  alias?: string
  description?: string
  status?: "draft" | "submitted" | "approved" | "rejected" | "incomplete"
  rejectionReason?: string
  productKeys?: string[]
}

/** Request body of `POST /create-app/apps/{id}/reject`. */
export interface CreateAppRejectAppBody {
  rejectionReason?: string
}

/** Request body of `POST /create-app/apps/{id}/product-key`. */
export interface CreateAppAddProductKeyBody {
  productKey?: string
}

/** Query parameters of `GET /create-app/apps/{id}/transactions`. */
export interface CreateAppListAppTransactionsParams {
  page?: number
  limit?: number
  type?: "credit" | "debit"
  status?: "pending" | "completed" | "failed" | "cancelled"
}

/** Request body of `POST /create-app/apps/{id}/drive/documents`. */
export interface CreateAppUploadDriveDocumentBody {
  file?: Blob
}

/** Query parameters of `GET /create-app/apps/{id}/drive/documents`. */
export interface CreateAppListDriveDocumentsParams {
  page?: number
  limit?: number
}

/** Request body of `PUT /create-app/apps/{id}/drive/documents/{documentId}`. */
export type CreateAppUpdateDriveDocumentBody = Record<string, unknown>

/** Request body of `PUT /create-app/apps/special/bulk`. */
export type CreateAppBulkUpdateAppsBody = Record<string, unknown>
