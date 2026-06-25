import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function PlayerCard({ item, rank, stat = 'goals' }) {
  const { player, statistics } = item
  const stats = statistics?.[0]
  const value = stat === 'goals'
    ? stats?.goals?.total
    : stats?.goals?.assists

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      whileHover={{ scale: 1.02 }}
    >
      <Link to={`/players/${player.id}`}>
        <div
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
          style={{ borderBottom: '1px solid rgba(124,58,237,0.08)' }}
        >
          {/* Rank */}
          <span
            className={`w-6 text-center text-xs font-bold ${
              rank === 1 ? 'text-yellow-400'
              : rank === 2 ? 'text-slate-300'
              : rank === 3 ? 'text-amber-600'
              : 'text-slate-500'
            }`}
          >
            {rank}
          </span>

          {/* Photo */}
          <div className="relative">
            <img
              src={player.photo}
              alt={player.name}
              className="w-10 h-10 rounded-full object-cover"
              style={{ border: '2px solid rgba(124,58,237,0.4)' }}
              onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${player.name}&background=7c3aed&color=fff&size=40` }}
            />
            {rank <= 3 && (
              <span className="absolute -top-1 -right-1 text-xs">
                {rank===1?'🥇':rank===2?'🥈':'🥉'}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{player.name}</p>
            <div className="flex items-center gap-1.5">
              {stats?.team?.logo && (
                <img src={stats.team.logo} alt="" className="w-3.5 h-3.5 object-contain" />
              )}
              <span className="text-xs text-slate-500 truncate">
                {stats?.team?.name}
              </span>
            </div>
          </div>

          {/* Value */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white gradient-purple-soft"
            style={{ border: '1px solid rgba(124,58,237,0.3)' }}
          >
            {value ?? 0}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
