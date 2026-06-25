import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const STATUS_LIVE = ['1H','2H','HT','ET','BT','P','INT']
const STATUS_FT   = ['FT','AET','PEN']

export default function MatchCard({ fixture, index = 0 }) {
  const { fixture: f, teams, goals, league, score } = fixture
  const isLive = STATUS_LIVE.includes(f.status.short)
  const isFT   = STATUS_FT.includes(f.status.short)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
    >
      <Link to={`/matches/${f.id}`} className="block">
        <div
          className="glass hover-card p-4 cursor-pointer"
          style={{ borderRadius: 14 }}
        >
          {/* League + Status */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {league?.logo && (
                <img src={league.logo} alt="" className="w-4 h-4 object-contain" />
              )}
              <span className="text-xs text-slate-500 truncate max-w-[120px]">
                {league?.name}
              </span>
            </div>
            {isLive ? (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(34,212,122,0.12)', border: '1px solid rgba(34,212,122,0.3)' }}>
                <div className="live-dot w-1.5 h-1.5" />
                <span className="text-xs text-green-400 font-bold">{f.status.elapsed}'</span>
              </div>
            ) : isFT ? (
              <span className="text-xs text-slate-400 font-medium">FT</span>
            ) : (
              <span className="text-xs text-slate-500">
                {new Date(f.date).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
              </span>
            )}
          </div>

          {/* Teams + Score */}
          <div className="flex items-center justify-between gap-3">
            {/* Home */}
            <div className="flex-1 flex items-center gap-2.5">
              <img src={teams.home.logo} alt={teams.home.name}
                className="w-8 h-8 object-contain" />
              <span className="text-sm font-semibold text-white truncate">
                {teams.home.name}
              </span>
            </div>

            {/* Score */}
            <div
              className={`px-4 py-1.5 rounded-xl text-center min-w-[70px]
                ${isLive ? 'gradient-purple glow-purple' : 'gradient-purple-soft'}`}
            >
              <span className="text-sm font-bold text-white tabular-nums">
                {goals.home ?? '-'} : {goals.away ?? '-'}
              </span>
            </div>

            {/* Away */}
            <div className="flex-1 flex items-center gap-2.5 justify-end">
              <span className="text-sm font-semibold text-white truncate text-right">
                {teams.away.name}
              </span>
              <img src={teams.away.logo} alt={teams.away.name}
                className="w-8 h-8 object-contain" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
