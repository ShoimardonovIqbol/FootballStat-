import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

const RANK_COLOR = ['#f59e0b', '#94a3b8', '#b45309']

export default function PlayerCard({ item, rank, stat = 'goals' }) {
  const { player, statistics } = item
  const stats = statistics?.[0]
  const value = stat === 'goals' ? stats?.goals?.total : stats?.goals?.assists

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
    >
      <Link to={`/players/${player.id}`} style={{ textDecoration: 'none' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 14px',
            cursor: 'pointer',
            borderBottom: '1px solid var(--border)',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          {/* Rank */}
          <span style={{
            width: 20,
            textAlign: 'center',
            fontSize: 12,
            fontWeight: 700,
            color: rank <= 3 ? RANK_COLOR[rank - 1] : '#475569',
            flexShrink: 0,
          }}>
            {rank}
          </span>

          {/* Photo */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={player.photo}
              alt={player.name}
              style={{
                width: 38, height: 38, borderRadius: '50%', objectFit: 'cover',
                border: '2px solid var(--border)',
                display: 'block',
              }}
              onError={e => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=333336&color=fff&size=38`
              }}
            />
            {rank <= 3 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                fontSize: 10, lineHeight: 1,
              }}>
                {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
              </span>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
              {player.name}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              {stats?.team?.logo && (
                <img src={stats.team.logo} alt="" style={{ width: 13, height: 13, objectFit: 'contain' }} />
              )}
              <span style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {stats?.team?.name}
              </span>
            </div>
          </div>

          {/* Value badge */}
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 800, color: '#fff',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid var(--border)',
          }}>
            {value ?? 0}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
