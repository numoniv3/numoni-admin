'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { slugify, type App } from './app-meta'

export interface AppBody { name: string; alias: string; websiteUrl: string; description: string }

/** Name, alias, website and description — the fields `POST` / `PUT /create-app/apps` take (all required). */
export function AppForm({ app, submitLabel, pending, onSubmit, onCancel }: {
  app?: App; submitLabel: string; pending: boolean; onSubmit: (body: AppBody) => void; onCancel?: () => void
}) {
  const [name, setName] = useState(app?.name ?? '')
  const [alias, setAlias] = useState(app?.alias ?? '')
  // Until the alias is edited by hand, it follows the name.
  const [aliasTouched, setAliasTouched] = useState(!!app?.alias)
  const [websiteUrl, setWebsiteUrl] = useState(app?.websiteUrl ?? '')
  const [description, setDescription] = useState(app?.description ?? '')

  const submit = () => {
    const url = websiteUrl.trim() && !/^https?:\/\//i.test(websiteUrl.trim()) ? `https://${websiteUrl.trim()}` : websiteUrl.trim()
    if (!name.trim()) return toast.error('Name your app')
    if (!alias.trim()) return toast.error('Choose an alias')
    try { new URL(url) } catch { return toast.error('Enter a valid website, e.g. https://mystore.com') }
    if (!description.trim()) return toast.error('Describe what the app is for')
    onSubmit({ name: name.trim(), alias: slugify(alias), websiteUrl: url, description: description.trim() })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground">App name</label>
        <Input className="mt-1.5" value={name} placeholder="e.g. Charles Store Rewards"
          onChange={(e) => { setName(e.target.value); if (!aliasTouched) setAlias(slugify(e.target.value)) }} />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground">Alias</label>
        <Input className="mt-1.5 font-mono" value={alias} placeholder="charles-rewards"
          onChange={(e) => { setAliasTouched(true); setAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')) }} />
        <p className="text-[11px] text-muted-foreground mt-1">A short handle used in links — lowercase letters, numbers and dashes.</p>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground">Website</label>
        <Input className="mt-1.5" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://mystore.com" inputMode="url" />
        <p className="text-[11px] text-muted-foreground mt-1">Where the app will run.</p>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground">Description</label>
        <Textarea className="mt-1.5" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What it does and who it’s for — this helps the review." />
      </div>
      <div className="flex gap-2 pt-1">
        {onCancel && <Button variant="outline" className="flex-1 rounded-full" disabled={pending} onClick={onCancel}>Cancel</Button>}
        <Button className="flex-1 rounded-full bg-brand text-black font-semibold hover:bg-brand/90" disabled={pending} onClick={submit}>{pending ? 'Saving…' : submitLabel}</Button>
      </div>
    </div>
  )
}
