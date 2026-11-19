'use client'

import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

export function CountUp({
  value,
  format = (n: number) => Math.round(n).toLocaleString('en-NG'),
  className,
  duration = 1.4,
}: {
  value: number
  format?: (n: number) => string
  className?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 })
  const inView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    if (inView) motionValue.set(value)
  }, [inView, value, motionValue])

  useEffect(() => {
    const unsub = spring.on('change', (latest) => {
      if (ref.current) ref.current.textContent = format(latest)
    })
    return unsub
  }, [spring, format])

  return (
    <span ref={ref} className={className}>
      {format(0)}
    </span>
  )
}
