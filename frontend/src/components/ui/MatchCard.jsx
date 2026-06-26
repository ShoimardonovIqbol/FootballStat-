import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const STATUS_LIVE = ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'INT']
const STATUS_FT   = ['FT', 'AET', 'PEN']

export default function MatchCard({ fixture, index = 0 }) {
  const { fixture: f, teams, goals } = fixture
  if (!teams?.home || !teams?.away) return null

  const isLive = STATUS_LIVE.includes(f.status.short)
  const isFT   = STATUS_FT.includes(f.status.short)
  const isNS   = f.status.short === 'NS'

  const kickoff = isNS
    ? new Date(f.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.018, y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={`/matches/${f.id}`} style={{ textDecoration: 'none' }}>
        <motion.div
          animate={isLive ? { boxShadow: ['0 0 0px rgba(124,58,237,0)', '0 0 18px rgba(124,58,237,0.35)', '0 0 0px rgba(124,58,237,0)'] } : {}}
          transition={isLive ? { duration: 2.5, repeat: Infinity } : {}}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            borderRadius: 12,
            background: isLive ? 'rgba(124,58,237,0.1)' : 'rgba(16,16,42,0.55)',
            border: '1px solid ' + (isLive ? 'rgba(124,58,237,0.35)' : 'rgba(124,58,237,0.1)'),
          }}
        >
          {/* HOME TEAM */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
            {teams.home.logo && (
              <img
                src={teams.home.logo}
                alt={teams.home.name}
                style={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0 }}
                onError={e => { e.target.style.opacity = 0 }}
              />
            )}
            <span style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {teams.home.name}
            </span>
          </div>

          {/* SCORE / TIME */}
          <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 68 }}>
            {isNS ? (
              <div style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(100,116,139,0.15)', border: '1px solid rgba(100,116,139,0.2)' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8' }}>{kickoff}</span>
              </div>
            ) : (
              <motion.div
                animate={isLive ? { scale: [1, 1.05, 1] } : {}}
                transition={isLive ? { duration: 2, repeat: Infinity } : {}}
                style={{
                  padding: '6px 10px', borderRadius: 8,
                  background: isLive ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'rgba(124,58,237,0.2)',
                  border: '1px solid ' + (isLive ? 'transparent' : 'rgba(124,58,237,0.35)'),
                  boxShadow: isLive ? '0 0 16px rgba(124,58,237,0.5)' : 'none',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: 1 }}>
                  {goals.home ?? 0} : {goals.away ?? 0}
                </span>
                {isLive && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 2 }}>
                    <div className="live-dot" style={{ width: 5, height: 5 }} />
                    <span style={{ fontSize: 10, color: '#86efac' }}>{f.status.elapsed}'</span>
                  </div>
                )}
                {isFT && <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>FT</div>}
              </motion.div>
            )}
          </div>

          {/* AWAY TEAM */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, overflow: 'hidden' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>
              {teams.away.name}
            </span>
            {teams.away.logo && (
              <img
                src={teams.away.logo}
                alt={teams.away.name}
                style={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0 }}
                onError={e => { e.target.style.opacity = 0 }}
              />
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
