import {
  LayoutDashboard, Store, Users, ShieldCheck, Landmark, Megaphone, SlidersHorizontal,
  Network, LifeBuoy, BookOpen, Split, KeyRound, ScrollText, Settings, DatabaseZap, Gift, UserCog, ShoppingBag, AppWindow, Coins } from 'lucide-react'
import type { NavItem } from '@/components/layout/dash-shell'

/** Single source of truth for the Control Tower sidebar and the ⌘K "Pages" group. */
export const ADMIN_BASE = '/admin'

export const ADMIN_NAV: NavItem[] = [
  { to: '', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/explorer', label: 'Data Explorer', icon: DatabaseZap },
  { to: '/merchants', label: 'Merchants', icon: Store },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/accounts', label: 'Accounts', icon: UserCog },
  { to: '/kyc', label: 'KYC & Compliance', icon: ShieldCheck },
  { to: '/treasury', label: 'Treasury & Settlement', icon: Landmark },
  { to: '/money-core', label: 'Money Core', icon: Coins },
  { to: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { to: '/rewards', label: 'Rewards', icon: Gift },
  { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/apps', label: 'White-label Apps', icon: AppWindow },
  { to: '/pricing', label: 'Pricing & Rates', icon: SlidersHorizontal },
  { to: '/resellers', label: 'Resellers', icon: Network },
  { to: '/disputes', label: 'Disputes & Support', icon: LifeBuoy },
  { to: '/accounting', label: 'Accounting', icon: BookOpen },
  { to: '/routing', label: 'Traffic Routing', icon: Split },
  { to: '/admins', label: 'Admins & Roles', icon: KeyRound },
  { to: '/audit', label: 'Audit Log', icon: ScrollText },
  { to: '/settings', label: 'Settings', icon: Settings },
]
