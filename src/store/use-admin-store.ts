import { create } from 'zustand'

// ── Admin cut-off simulation ────────────────────────────────────────────────
interface AdminState {
  cutoffPhase: 'idle' | 'freezing' | 'checksum' | 'statement' | 'done'
  reconOk: boolean
  runCutoff: () => void
  resetCutoff: () => void
}

export const useAdmin = create<AdminState>((set) => ({
  cutoffPhase: 'idle',
  reconOk: true,
  runCutoff: () => {
    set({ cutoffPhase: 'freezing' })
    setTimeout(() => set({ cutoffPhase: 'checksum' }), 1400)
    setTimeout(() => set({ cutoffPhase: 'statement' }), 3000)
    setTimeout(() => set({ cutoffPhase: 'done' }), 4400)
  },
  resetCutoff: () => set({ cutoffPhase: 'idle' }),
}))
