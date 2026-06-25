import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const STATUS_LIVE = ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'INT']
const STATUS_FT   = ['FT', 'AET', 'PEN']

export default function MatchCard({ fixture, index = 0 }) {
  const { fixture: f, teams, goals, league } = fixture
  const isLive = STATUS_LIVE.includes(f.status.short)
  const isFT   = STATUS_FT.includes(f.status.short)
  const isNS   = f.status.short === 'NS'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.045, duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <Link to={`/matches/${f.id}`} className="block">
        <div
          className="hover-card rounded-xl px-4 py-3 cursor-pointer"
          style={{
            background: isLive
              ? 'rgba(124,58,237,0.1)'
              : 'rgba(16,16,42,0.6)',
            border: '1px solid ' + (isLive
              ? 'rgba(124,58,237,0.35)'
              : 'rgba(124,58,237,0.1)'),
          }}
        >
          <div className="flex items-center gap-3">

            {/* Home team */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <img
                src={teams.home.logo}
                alt={teams.home.name}
                className="w-7 h-7 object-contain shrink-0"
                onError={e => { e.target.style.display = 'none' }}
              />
              <span className="text-sm font-semibold text-white truncate">
                {teams.home.name}
              </span>
            </div>

            {/* Score / Time */}
            <div className="shrink-0">
              {isNS ? (
                <div
                  className="px-3 py-1.5 rounded-lg text-center min-w-[64px]"
                  style={{ background: 'rgba(100,116,139,0.15)', border: '1px solid rgba(100,116,139,0.2)' }}
                >
                  <span className="text-xs font-bold text-slate-400">
                    {new Date(f.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ) : (
                <div
                  className="px-3 py-1.5 rounded-lg text-center min-w-[64px]"
                  style={{
                    background: isLive
                      ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
                      : 'rgba(124,58,237,0.18)',
                    border: '1px solid ' + (isLive ? 'transparent' : 'rgba(124,58,237,0.3)'),
                    boxShadow: isLive ? '0 0 18px rgba(124,58,237,0.4)' : 'none',
                  }}
                >
                  <span className="text-sm font-bold text-white tabular-nums">
                    {goals.home ?? 0} : {goals.away ?? 0}
                  </span>
                  {isLive && (
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      <div className="live-dot w-1 h-1" />
                      <span className="text-xs text-green-300">{f.status.elapsed}'</span>
                    </div>
                  )}
                  {isFT && (
                    <p className="text-xs text-slate-400 mt-0.5">FT</p>
                  )}
                </div>
              )}
            </div>

            {/* Away team */}
            <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
              <span className="text-sm font-semibold text-white truncate text-right">
                {teams.away.name}
              </span>
              <img
                src={teams.away.logo}
                alt={teams.away.name}
                className="w-7 h-7 object-contain shrink-0"
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>

          </div>
        </div>
      </Link>
    </motion.div>
  )
}
