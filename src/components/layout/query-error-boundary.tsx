'use client'

import { Component, type ReactNode } from 'react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { apiErrorMessage } from '@/lib/api/numoni/errors'
import { cn } from '@/lib/utils'

interface BoundaryProps {
  onReset: () => void
  className?: string
  children: ReactNode
}

class Boundary extends Component<BoundaryProps, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  retry = () => {
    this.props.onReset()
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    return (
      <div role="alert" className={cn('flex flex-col items-center justify-center gap-3 px-6 text-center bg-background min-h-[50vh]', this.props.className)}>
        <p className="font-display text-lg font-bold">Couldn&apos;t load this</p>
        <p className="text-sm text-muted-foreground max-w-sm">{apiErrorMessage(error)}</p>
        <Button variant="outline" onClick={this.retry} className="rounded-full">
          <RotateCw className="h-4 w-4 mr-1.5" /> Try again
        </Button>
      </div>
    )
  }
}

/**
 * Catches a failed `useSuspenseQuery` below it and offers a retry, which
 * refetches the failed queries instead of leaving the screen broken.
 */
export function QueryErrorBoundary({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <Boundary onReset={reset} className={className}>
          {children}
        </Boundary>
      )}
    </QueryErrorResetBoundary>
  )
}
