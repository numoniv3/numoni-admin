import { redirect } from 'next/navigation'

/** This project is one nuMoni app; its pages live under `/admin`. */
export default function Page() {
  redirect('/admin')
}
