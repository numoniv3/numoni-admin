import * as A from '@/lib/api/numoni/create-app.api'
import { numoniKeys } from '@/lib/api/numoni/query-keys'
import type {
  CreateAppCreateAppBody, CreateAppListAppTransactionsParams, CreateAppUpdateAppBody, CreateAppUpdateDriveDocumentBody,
} from '@/lib/api/numoni/types/create-app'
import { useMsAction, useMsQuery } from './ms-hooks'

/*
 * Create-App MS (white-label apps) through the Gateway. `special/*` (partner
 * API with an API key) isn't for browsers — the Gateway guide lists it as not exposed.
 */

const K = numoniKeys.createApp
const opt = { optIn: 'create-app' as const }
const all = [K.all]

/** `merchantId` set: that merchant's apps; otherwise every app (admin). */
export const useApps = (merchantId?: string) =>
  useMsQuery(merchantId ? K.listMerchantApps(merchantId) : K.listApps(), () => (merchantId ? A.listMerchantApps(merchantId) : A.listApps()), opt)
export const useApp = (id: string) => useMsQuery(K.getApp(id), () => A.getApp(id), { ...opt, enabled: !!id })
export const useProductKeys = (id: string) => useMsQuery(K.listProductKeys(id), () => A.listProductKeys(id))
export const useAppTransactions = (id: string, params: CreateAppListAppTransactionsParams) => useMsQuery(K.listAppTransactions(id, params), () => A.listAppTransactions(id, params))
export const useAppTransactionStats = (id: string) => useMsQuery(K.getAppTransactionStats(id), () => A.getAppTransactionStats(id))
export const useDriveDocuments = (id: string, page: number) => useMsQuery(K.listDriveDocuments(id, { page }), () => A.listDriveDocuments(id, { page, limit: 20 }))
export const useDriveDocument = (id: string, docId: string | null) => useMsQuery(K.getDriveDocument(id, docId ?? ''), () => A.getDriveDocument(id, docId!), { enabled: !!docId })
export const useDriveStats = (id: string) => useMsQuery(K.getDriveDocumentStats(id), () => A.getDriveDocumentStats(id))

export const useCreateApp = () => useMsAction((b: CreateAppCreateAppBody) => A.createApp(b), { ...opt, success: 'App created', error: 'Couldn’t create the app', invalidate: all })
export const useUpdateApp = () => useMsAction(({ id, body }: { id: string; body: CreateAppUpdateAppBody }) => A.updateApp(id, body), { success: 'App updated', error: 'Couldn’t update the app', invalidate: all })
export const useDeleteApp = () => useMsAction((id: string) => A.deleteApp(id), { success: 'App deleted', error: 'Couldn’t delete the app', invalidate: all })
export const useSubmitApp = () => useMsAction((id: string) => A.submitApp(id), { success: 'Submitted for review', error: 'Couldn’t submit the app', invalidate: all })
export const useApproveApp = () => useMsAction((id: string) => A.approveApp(id), { success: 'App approved', error: 'Couldn’t approve the app', invalidate: all })
export const useRejectApp = () => useMsAction(({ id, reason }: { id: string; reason?: string }) => A.rejectApp(id, { rejectionReason: reason }), { success: 'App rejected', error: 'Couldn’t reject the app', invalidate: all })
export const useAddProductKey = () => useMsAction(({ id, key }: { id: string; key: string }) => A.addProductKey(id, { productKey: key }), { success: 'Product key added', error: 'Couldn’t add the key', invalidate: all })
export const useUploadDriveDocument = () => useMsAction(({ id, file }: { id: string; file: File }) => A.uploadDriveDocument(id, { file }), { success: 'Document uploaded', error: 'Couldn’t upload the document', invalidate: all })
export const useUpdateDriveDocument = () => useMsAction(({ id, docId, body }: { id: string; docId: string; body: CreateAppUpdateDriveDocumentBody }) => A.updateDriveDocument(id, docId, body), { success: 'Document updated', error: 'Couldn’t update the document', invalidate: all })
export const useDeleteDriveDocument = () => useMsAction(({ id, docId }: { id: string; docId: string }) => A.deleteDriveDocument(id, docId), { success: 'Document deleted', error: 'Couldn’t delete the document', invalidate: all })
