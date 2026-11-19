import { NUMONI_ENDPOINTS } from './endpoints'
import { apiGet } from './request'
import { brandAppAccount, brandAppActivity, brandAppCoupons, brandAppNotices } from './mocks/brand-app'
import type { BrandAppWorkspace } from './types/brand-app'

/**
 * The signed-in customer's brand wallet: balance, points, activity, coupons and notifications.
 * @endpoint GET /brand-app/account
 */
export function getBrandAppAccount(): Promise<BrandAppWorkspace> {
  return apiGet(NUMONI_ENDPOINTS.brandApp.account, () => ({
    ...brandAppAccount,
    activity: brandAppActivity,
    coupons: brandAppCoupons,
    notices: brandAppNotices,
  }))
}
