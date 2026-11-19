import { NUMONI_ENDPOINTS } from './endpoints'
import { apiGet } from './request'
import { orgCardOrders, orgIssuedCards, orgs } from './mocks/org'
import type { OrgCardOrder, OrgComplianceUsage, OrgId, OrgIssuedCard, OrgProfile, OrgTeamMember, OrgUnit } from './types/org'

const E = NUMONI_ENDPOINTS.org

export interface OrgSettings {
  profile: OrgProfile
  units: OrgUnit[]
  team: OrgTeamMember[]
}

/**
 * Business profile, the units staff can be scoped to, and the team.
 * @endpoint GET /orgs/{orgId}/settings
 */
export function getOrgSettings(orgId: OrgId): Promise<OrgSettings> {
  return apiGet(E.settings(orgId), () => ({ profile: orgs[orgId].profile, units: orgs[orgId].units, team: orgs[orgId].team }))
}

export interface OrgCompliance {
  entityName: string
  usage: OrgComplianceUsage
}

/**
 * KYB status inputs: the organisation's name and its usage against tier limits.
 * @endpoint GET /orgs/{orgId}/compliance
 */
export function getOrgCompliance(orgId: OrgId): Promise<OrgCompliance> {
  return apiGet(E.compliance(orgId), () => ({ entityName: orgs[orgId].displayName, usage: orgs[orgId].usage }))
}

export interface OrgRewardCards {
  brandName: string
  orders: OrgCardOrder[]
  cards: OrgIssuedCard[]
}

/**
 * Physical reward-card print orders and the cards issued to customers.
 * @endpoint GET /orgs/{orgId}/reward-cards
 */
export function getOrgRewardCards(orgId: OrgId): Promise<OrgRewardCards> {
  const brandName = orgs[orgId].displayName
  return apiGet(E.rewardCards(orgId), () => ({ brandName, orders: orgCardOrders(brandName), cards: orgIssuedCards('CRD') }))
}
