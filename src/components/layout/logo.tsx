import { cn } from '@/lib/utils'

export function Logo({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <span className={cn('font-display font-bold tracking-tight leading-none select-none', className)}>
      <span className="text-brand">nu</span>
      <span className={dark ? 'text-white' : 'text-foreground'}>Moni</span>
    </span>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-xl bg-black font-display font-bold text-white select-none',
        className,
      )}
    >
      <span className="text-brand">nu</span>M
    </span>
  )
}
