'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Lock, Receipt, ShieldCheck } from 'lucide-react'

const phaseCopy = {
  idle: null,
  freezing: { icon: Lock, title: 'Freezing books…', sub: '24:00 cut-off · 10-minute write freeze across all ledgers' },
  checksum: { icon: ShieldCheck, title: 'Running check-sum…', sub: '[NERW + PPL + ΣRCS] − Payonus = 0' },
  statement: { icon: Receipt, title: 'Generating statements…', sub: 'Daily statements for 1,284 merchants + audit pack' },
  done: { icon: CheckCircle2, title: 'Cut-off complete', sub: 'Books closed clean · checksum 0 · statements dispatched' },
} as const

interface CutoffBannerProps {
  cutoffPhase: "idle" | "freezing" | "checksum" | "statement" | "done"
}

export function CutoffBanner({ cutoffPhase }: CutoffBannerProps) {
  const phase = phaseCopy[cutoffPhase]

  return (
    <AnimatePresence>
      {phase && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          className="overflow-hidden"
        >
          <div className={`card-surface p-5 flex items-center gap-4 ${cutoffPhase === 'done' ? 'border-brand/50 glow-brand' : 'border-orangeb/50'}`}>
            <motion.span
              key={cutoffPhase}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${cutoffPhase === 'done' ? 'bg-brand/15 text-brand' : 'bg-orangeb/15 text-orangeb'}`}
            >
              <phase.icon className={`h-5 w-5 ${cutoffPhase !== 'done' ? 'animate-pulse' : ''}`} />
            </motion.span>
            <div className="flex-1">
              <div className="font-display font-bold">{phase.title}</div>
              <div className="text-xs text-muted-foreground tnum">{phase.sub}</div>
            </div>
            <div className="hidden sm:flex gap-1.5">
              {['freezing', 'checksum', 'statement', 'done'].map((p, i) => {
                const order = ['freezing', 'checksum', 'statement', 'done']
                const active = order.indexOf(cutoffPhase) >= i
                return (
                  <motion.span
                    key={p}
                    animate={{ scale: active ? 1 : 0.7, opacity: active ? 1 : 0.3 }}
                    className={`h-2 w-8 rounded-full ${active ? 'bg-brand' : 'bg-muted'}`}
                  />
                )
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
