'use client'

import { Trash2 } from 'lucide-react'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import type { RewardResponseDto } from '@/lib/api/numoni/types/rewards'
import { useDeleteReward } from '@/modules/ms/api/useRewardQueries'

/** Deleting is permanent on the Reward MS, so it asks first. */
export function DeleteRewardButton({ reward }: { reward: RewardResponseDto }) {
  const remove = useDeleteReward()
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-8 text-muted-foreground hover:text-red-500" title="Delete" disabled={remove.isPending}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{reward.name}”?</AlertDialogTitle>
          <AlertDialogDescription>
            It’s removed from its campaign and stops rewarding customers. To stop it for a while instead, pause it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 text-white hover:bg-red-500/90"
            onClick={() => remove.mutate({ campaignId: reward.campaignId, rewardId: reward.id, name: reward.name })}
          >
            Delete reward
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
