import { cn } from '@/lib/utils'

/**
 * The spinner every experience shows while its data resolves — the same one
 * the Vite build showed while a lazy route chunk loaded.
 */
export function PageLoader({ fullScreen = false, className }: { fullScreen?: boolean; className?: string }) {
  return (
    <div className={cn('flex items-center justify-center bg-background', fullScreen ? 'min-h-dvh' : 'min-h-[50vh]', className)}>
      <div className="h-10 w-10 rounded-full border-4 border-muted border-t-brand animate-spin" />
    </div>
  )
}
