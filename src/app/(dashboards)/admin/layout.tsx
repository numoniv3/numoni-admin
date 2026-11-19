import { AdminShell } from '@/modules/admin'

export const metadata = { title: 'Control Tower · nuMoni Admin' }

export default function Layout({ children }: LayoutProps<'/admin'>) {
  return <AdminShell>{children}</AdminShell>
}
