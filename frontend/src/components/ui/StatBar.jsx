import { motion } from 'motion/react'

export default function StatBar({ label, home, away, homeColor = '#7c3aed', awayColor = '#4f46e5' }) {
  const total = (home ?? 0) + (away ?? 0)
  const homePct = total === 0 ? 50 : Math.round(((home ?? 0) / total) * 100)
  const awayPct = 100 - homePct

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-white">{home ?? 0}</span>
        <span className="text-slate-400">{label}</span>
        <span className="text-white">{away ?? 0}</span>
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${homePct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: homeColor }}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${awayPct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: awayColor }}
        />
      </div>
    </div>
  )
}
