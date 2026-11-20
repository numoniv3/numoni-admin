/*
 * Screens for the Gateway's microservices (Reward, Card, Compliance,
 * Create-App, Marketplace). Shared by every nuMoni app — each app's routes
 * pick the ones its users need. Same files in every project.
 */
export { RewardsPage } from './components/rewards/RewardsPage'
export { CampaignsManager } from './components/campaigns/CampaignsManager'
export { RewardCampaignsPage } from './components/campaigns/RewardCampaignsPage'
export { RewardCardsPage } from './components/cards/RewardCardsPage'
export { MyCardsPanel } from './components/cards/MyCardsPanel'
export { TillCardRedeem } from './components/cards/TillCardRedeem'
export { BusinessKycPage } from './components/compliance/BusinessKycPage'
export { IndividualKycPanel } from './components/compliance/IndividualKycPanel'
export { KycAdminPage } from './components/compliance/KycAdminPage'
export { AppStudioPage } from './components/create-app/AppStudioPage'
export { AppReviewPage } from './components/create-app/AppReviewPage'
export { OnlineStorePage } from './components/marketplace/OnlineStorePage'
export { StorefrontPanel } from './components/storefront/StorefrontPanel'
export { MarketplaceAdminPage } from './components/marketplace-admin/MarketplaceAdminPage'
export { RewardsAdminPage } from './components/rewards-admin/RewardsAdminPage'
export { WalletPanel } from './components/wallet/WalletPanel'
export { MoneyCorePage } from './components/wallet/MoneyCorePage'
export { WalletPage } from './components/wallet/WalletPage'
