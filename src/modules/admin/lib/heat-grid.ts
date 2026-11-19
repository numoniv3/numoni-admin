// Activity heat-grid helpers shared by the Overview page and its HeatGrid.

// deterministic pseudo-random so every render is stable
export const rnd = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

export type HeatGran = 'day' | 'week' | 'month'

export type HeatMetric = 'visits' | 'cards' | 'patronage'

export const METRIC_LABEL: Record<HeatMetric, string> = { visits: 'Store visits', cards: 'Card usage', patronage: 'Patronage' }
