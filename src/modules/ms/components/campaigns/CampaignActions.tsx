'use client'

import { Pause, Play, Square } from 'lucide-react'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import type { CampaignResponseDto } from '@/lib/api/numoni/types/rewards'
import { fmtNaira } from '@/lib/format'
import { useCampaignAction } from '@/modules/ms/api/useCampaignQueries'
import { actionsFor } from './campaign-meta'

/** Pause / resume / stop for a campaign, as icon buttons (table) or labelled (`labels`). */
export function CampaignActions({ campaign: c, labels }: { campaign: CampaignResponseDto; labels?: boolean }) {
  const act = useCampaignAction()
  const busy = act.isPending && act.variables?.campaignId === c.id
  const actions = actionsFor(c.status)
  const size = labels ? 'default' : 'sm'
  const cls = labels ? 'rounded-full' : 'h-8'

  return (
    <div className="flex items-center gap-1 justify-end">
      {actions.includes('pause') && (
        <Button size={size} variant="ghost" className={cls} title="Pause" disabled={busy} onClick={() => act.mutate({ campaignId: c.id, action: 'pause' })}>
          <Pause className="h-3.5 w-3.5" />{labels && <span className="ml-1.5">Pause</span>}
        </Button>
      )}
      {actions.includes('resume') && (
        <Button size={size} variant="ghost" className={cls} title="Resume" disabled={busy} onClick={() => act.mutate({ campaignId: c.id, action: 'resume' })}>
          <Play className="h-3.5 w-3.5" />{labels && <span className="ml-1.5">Resume</span>}
        </Button>
      )}
      {actions.includes('stop') && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size={size} variant="ghost" className={`${cls} text-muted-foreground hover:text-red-500`} title="Stop" disabled={busy}>
              <Square className="h-3.5 w-3.5" />{labels && <span className="ml-1.5">Stop</span>}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Stop “{c.name}”?</AlertDialogTitle>
              <AlertDialogDescription>
                The campaign ends for good and stops rewarding customers.
                {c.remainingBudget > 0 ? ` The unspent ${fmtNaira(c.remainingBudget, 0)} in escrow goes back to you.` : ''} Campaigns can’t be restarted or deleted — pause it instead if you may want it back.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep it</AlertDialogCancel>
              <AlertDialogAction className="bg-red-500 text-white hover:bg-red-500/90" onClick={() => act.mutate({ campaignId: c.id, action: 'stop' })}>
                Stop campaign
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
