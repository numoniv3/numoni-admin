import { NUMONI_ENDPOINTS } from './endpoints'
import { apiGet } from './request'
import { resellerBusinesses, resellerSettlementBatches, resellerWalletTxns } from './mocks/reseller'
import type { ResellerWorkspace } from './types/reseller'

const E = NUMONI_ENDPOINTS.reseller

/**
 * The reseller's onboarded businesses, commission wallet and settlement batches.
 * @endpoint GET /reseller/workspace
 */
export function getResellerWorkspace(): Promise<ResellerWorkspace> {
  return apiGet(E.workspace, () => ({ businesses: resellerBusinesses, wallet: resellerWalletTxns, batches: resellerSettlementBatches }))
}
