'use client'

import { Trash2 } from 'lucide-react'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import type { RewardTemplateResponseDto } from '@/lib/api/numoni/types/rewards'
import { useDeleteReward } from '@/modules/ms/api/useRewardQueries'

/** Deletes an unused reward; one that campaigns already use is archived instead. Asks first. */
export function DeleteRewardButton({ reward }: { reward: RewardTemplateResponseDto }) {
  const remove = useDeleteReward()
  const inUse = reward.linkedRewardCount > 0
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-8 text-muted-foreground hover:text-red-500" title={inUse ? 'Archive' : 'Delete'} disabled={remove.isPending}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{inUse ? 'Archive' : 'Delete'} “{reward.name}”?</AlertDialogTitle>
          <AlertDialogDescription>
            {inUse
              ? `It’s used in ${reward.linkedRewardCount} campaign${reward.linkedRewardCount > 1 ? 's' : ''}, so it’s archived: hidden from your library and can’t be added to new campaigns. Campaigns using it keep their copy.`
              : 'It’s removed from your reward library permanently.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 text-white hover:bg-red-500/90"
            onClick={() => remove.mutate({ templateId: reward.id, name: reward.name })}
          >
            {inUse ? 'Archive reward' : 'Delete reward'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
