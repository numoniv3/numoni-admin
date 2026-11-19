import { Merchant360Page } from '@/modules/admin'

export const metadata = { title: 'Merchant 360 · nuMoni Admin' }

export default async function Page({ params }: PageProps<'/admin/merchants/[id]'>) {
  const { id } = await params
  return <Merchant360Page id={id} />
}
