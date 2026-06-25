import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Goal, Footprints } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { playersAPI } from '../services/api'
import { PlayerSkeleton } from '../components/ui/Skeleton'
import Topbar from '../components/layout/Topbar'

const TABS = [
  { key: 'scorers', label: 'Top Scorers', icon: Goal,       stat: 'goals'   },
  { key: 'assists', label: 'Top Assists', icon: Footprints, stat: 'assists' },
]

const LEAGUES = [
  { id: 39,  name: 'Premier League' },
  { id: 140, name: 'La Liga'        },
  { id: 135, name: 'Serie A'        },
  { id: 78,  name: 'Bundesliga'     },
  { id: 61,  name: 'Ligue 1'        },
]

const PODIUM = [
  { pos: 1, size: 80, barH: 52, medal: '🥇', border: '#f59e0b' },
  { pos: 0, size: 64, barH: 36, medal: '🥈', border: '#94a3b8' },
  { pos: 2, size: 64, barH: 32, medal: '🥉', border: '#b45309' },
]

export default function Players() {
  const [tab,    setTab]    = useState('scorers')
  const [league, setLeague] = useState(39)

  const scorers = useApi(() => playersAPI.getTopScorers(league, 2024), [league])
  const assists = useApi(() => playersAPI.getTopAssists(league, 2024), [league])

  const current     = tab === 'scorers' ? scorers : assists
  const currentStat = TABS.find(t => t.key === tab)?.stat ?? 'goals'
  const players     = current.data?.response ?? []

  return (
    <div style={{ minHeight: '100vh' }}>
      <Topbar title="Players" />

      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* League filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {LEAGUES.map(l => (
            <button
              key={l.id}
              onClick={() => setLeague(l.id)}
              style={{
                padding: '7px 16px',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                outline: 'none',
                transition: 'all 0.2s',
                background: league === l.id
                  ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
                  : 'rgba(21,21,58,0.8)',
                color: league === l.id ? '#fff' : '#94a3b8',
                boxShadow: league === l.id ? '0 0 16px rgba(124,58,237,0.4)' : 'none',
              }}
            >
              {l.name}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8 }}>
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                position: 'relative',
                padding: '9px 20px',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid ' + (tab === key ? 'transparent' : 'rgba(124,58,237,0.2)'),
                outline: 'none',
                background: tab === key
                  ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
                  : 'rgba(21,21,58,0.7)',
                color: tab === key ? '#fff' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s',
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Podium top 3 */}
        {!current.loading && players.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: 24,
              padding: '32px 0 16px',
              background: 'rgba(16,16,42,0.5)',
              borderRadius: 20,
              border: '1px solid rgba(124,58,237,0.12)',
            }}
          >
            {PODIUM.map(({ pos, size, barH, medal, border }) => {
              const item   = players[pos]
              const stats  = item?.statistics?.[0]
              const val    = currentStat === 'goals'
                ? stats?.goals?.total
                : stats?.goals?.assists

              return (
                <motion.div
                  key={item?.player?.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: pos * 0.1 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    minWidth: 100,
                  }}
                >
                  <span style={{ fontSize: 24 }}>{medal}</span>
                  <img
                    src={item?.player?.photo}
                    alt={item?.player?.name}
                    style={{
                      width: size,
                      height: size,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `3px solid ${border}`,
                    }}
                    onError={e => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item?.player?.name || '?')}&background=7c3aed&color=fff&size=${size}`
                    }}
                  />
                  <p style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#f1f5f9',
                    textAlign: 'center',
                    maxWidth: 100,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {item?.player?.name}
                  </p>
                  <div style={{
                    width: '100%',
                    minWidth: 90,
                    height: barH,
                    background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                    borderRadius: '10px 10px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(124,58,237,0.4)',
                  }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{val ?? 0}</span>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Full ranked list */}
        <div style={{
          background: 'rgba(16,16,42,0.75)',
          border: '1px solid rgba(124,58,237,0.15)',
          borderRadius: 16,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2rem 3rem 1fr 4rem',
            padding: '10px 16px',
            borderBottom: '1px solid rgba(124,58,237,0.12)',
            background: 'rgba(124,58,237,0.06)',
          }}>
            {['#', '', 'Player', currentStat === 'goals' ? 'Goals' : 'Assists'].map((h, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textAlign: i === 3 ? 'center' : 'left' }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {current.loading
            ? Array.from({ length: 10 }).map((_, i) => <PlayerSkeleton key={i} />)
            : players.map((item, i) => {
              const stats = item.statistics?.[0]
              const val   = currentStat === 'goals'
                ? stats?.goals?.total
                : stats?.goals?.assists
              const rankColors = ['#f59e0b', '#94a3b8', '#b45309']

              return (
                <motion.div
                  key={item.player.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2rem 3rem 1fr 4rem',
                    alignItems: 'center',
                    padding: '10px 16px',
                    borderBottom: '1px solid rgba(124,58,237,0.07)',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Rank */}
                  <span style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: i < 3 ? rankColors[i] : '#475569',
                  }}>
                    {i + 1}
                  </span>

                  {/* Photo */}
                  <div style={{ position: 'relative', width: 36, height: 36 }}>
                    <img
                      src={item.player.photo}
                      alt={item.player.name}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid rgba(124,58,237,0.35)',
                      }}
                      onError={e => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.player.name)}&background=7c3aed&color=fff&size=36`
                      }}
                    />
                  </div>

                  {/* Name + Team */}
                  <div style={{ overflow: 'hidden', paddingLeft: 8 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.player.name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      {stats?.team?.logo && (
                        <img src={stats.team.logo} alt="" style={{ width: 13, height: 13, objectFit: 'contain' }} />
                      )}
                      <span style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {stats?.team?.name}
                      </span>
                    </div>
                  </div>

                  {/* Value badge */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(79,70,229,0.3))',
                      border: '1px solid rgba(124,58,237,0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 800,
                      color: '#fff',
                    }}>
                      {val ?? 0}
                    </div>
                  </div>
                </motion.div>
              )
            })
          }
        </div>

      </div>
    </div>
  )
}
