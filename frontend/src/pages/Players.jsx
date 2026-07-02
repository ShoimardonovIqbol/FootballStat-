import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Goal, Footprints, Star } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { playersAPI } from '../services/api'
import { PlayerSkeleton } from '../components/ui/Skeleton'
import { useFavorites } from '../context/FavoritesContext'
import Topbar from '../components/layout/Topbar'

// WC 2026 player data — corrected IDs + updated goals (Jun 29)
const WC2026_SCORERS = [
  { player: { id: 154,  name: 'Lionel Messi',      photo: 'https://media.api-sports.io/football/players/154.png'  }, statistics: [{ team: { id: 26, name: 'Argentina', logo: 'https://media.api-sports.io/football/teams/26.png'  }, goals: { total: 6, assists: 3 } }] },
  { player: { id: 762,  name: 'Vinicius Junior',   photo: 'https://media.api-sports.io/football/players/762.png'  }, statistics: [{ team: { id: 6,  name: 'Brazil',    logo: 'https://media.api-sports.io/football/teams/6.png'   }, goals: { total: 4, assists: 1 } }] },
  { player: { id: 278,  name: 'Kylian Mbappe',     photo: 'https://media.api-sports.io/football/players/278.png'  }, statistics: [{ team: { id: 2,  name: 'France',    logo: 'https://media.api-sports.io/football/teams/2.png'   }, goals: { total: 4, assists: 2 } }] },
  { player: { id: 283,  name: 'Ousmane Dembele',   photo: 'https://media.api-sports.io/football/players/283.png'  }, statistics: [{ team: { id: 2,  name: 'France',    logo: 'https://media.api-sports.io/football/teams/2.png'   }, goals: { total: 4, assists: 1 } }] },
  { player: { id: 1100, name: 'Erling Haaland',    photo: 'https://media.api-sports.io/football/players/1100.png' }, statistics: [{ team: { id: 13, name: 'Norway',    logo: 'https://media.api-sports.io/football/teams/13.png'  }, goals: { total: 4, assists: 0 } }] },
  { player: { id: 184,  name: 'Harry Kane',         photo: 'https://media.api-sports.io/football/players/184.png'  }, statistics: [{ team: { id: 10, name: 'England',   logo: 'https://media.api-sports.io/football/teams/10.png'  }, goals: { total: 3, assists: 1 } }] },
  { player: { id: 36382,name: 'Cristiano Ronaldo',  photo: 'https://media.api-sports.io/football/players/36382.png'}, statistics: [{ team: { id: 27, name: 'Portugal',  logo: 'https://media.api-sports.io/football/teams/27.png'  }, goals: { total: 3, assists: 0 } }] },
  { player: { id: 303,  name: 'Lautaro Martinez',   photo: 'https://media.api-sports.io/football/players/303.png'  }, statistics: [{ team: { id: 26, name: 'Argentina', logo: 'https://media.api-sports.io/football/teams/26.png'  }, goals: { total: 3, assists: 1 } }] },
  { player: { id: 276,  name: 'Neymar Jr',           photo: 'https://media.api-sports.io/football/players/276.png'  }, statistics: [{ team: { id: 6,  name: 'Brazil',    logo: 'https://media.api-sports.io/football/teams/6.png'   }, goals: { total: 3, assists: 2 } }] },
  { player: { id: 8350, name: 'Michael Olise',       photo: 'https://media.api-sports.io/football/players/8350.png' }, statistics: [{ team: { id: 2,  name: 'France',    logo: 'https://media.api-sports.io/football/teams/2.png'   }, goals: { total: 3, assists: 1 } }] },
]

const WC2026_ASSISTS = [
  { player: { id: 2864,  name: 'Alexander Isak',    photo: 'https://media.api-sports.io/football/players/2864.png'  }, statistics: [{ team: { id: 16,  name: 'Sweden',      logo: 'https://media.api-sports.io/football/teams/16.png'   }, goals: { total: 2, assists: 3 } }] },
  { player: { id: 10135, name: 'Bruno Guimaraes',   photo: 'https://media.api-sports.io/football/players/10135.png' }, statistics: [{ team: { id: 6,   name: 'Brazil',      logo: 'https://media.api-sports.io/football/teams/6.png'    }, goals: { total: 1, assists: 3 } }] },
  { player: { id: 19617, name: 'Michael Olise',     photo: 'https://media.api-sports.io/football/players/19617.png' }, statistics: [{ team: { id: 2,   name: 'France',      logo: 'https://media.api-sports.io/football/teams/2.png'    }, goals: { total: 3, assists: 3 } }] },
  { player: { id: 744,   name: 'Brahim Diaz',       photo: 'https://media.api-sports.io/football/players/744.png'   }, statistics: [{ team: { id: 1,   name: 'Morocco',     logo: 'https://media.api-sports.io/football/teams/1.png'    }, goals: { total: 1, assists: 2 } }] },
  { player: { id: 421,   name: 'Brel Embolo',       photo: 'https://media.api-sports.io/football/players/421.png'   }, statistics: [{ team: { id: 15,  name: 'Switzerland', logo: 'https://media.api-sports.io/football/teams/15.png'   }, goals: { total: 2, assists: 2 } }] },
  { player: { id: 1460,  name: 'Bukayo Saka',       photo: 'https://media.api-sports.io/football/players/1460.png'  }, statistics: [{ team: { id: 10,  name: 'England',     logo: 'https://media.api-sports.io/football/teams/10.png'   }, goals: { total: 1, assists: 2 } }] },
  { player: { id: 18979, name: 'Viktor Gyokeres',   photo: 'https://media.api-sports.io/football/players/18979.png' }, statistics: [{ team: { id: 16,  name: 'Sweden',      logo: 'https://media.api-sports.io/football/teams/16.png'   }, goals: { total: 2, assists: 2 } }] },
  { player: { id: 226,   name: 'Denzel Dumfries',   photo: 'https://media.api-sports.io/football/players/226.png'   }, statistics: [{ team: { id: 33,  name: 'Netherlands', logo: 'https://media.api-sports.io/football/teams/33.png'   }, goals: { total: 1, assists: 2 } }] },
  { player: { id: 502,   name: 'Joshua Kimmich',    photo: 'https://media.api-sports.io/football/players/502.png'   }, statistics: [{ team: { id: 25,  name: 'Germany',     logo: 'https://media.api-sports.io/football/teams/25.png'   }, goals: { total: 0, assists: 2 } }] },
]

const TABS = [
  { key: 'scorers', label: 'Top Scorers', icon: Goal,       stat: 'goals'   },
  { key: 'assists', label: 'Top Assists', icon: Footprints, stat: 'assists' },
]

const LEAGUES = [
  { id: 1,   name: '🏆 World Cup 2026', season: 2026 },
  { id: 39,  name: 'Premier League',    season: 2024 },
  { id: 140, name: 'La Liga',           season: 2024 },
  { id: 135, name: 'Serie A',           season: 2024 },
  { id: 61,  name: 'Ligue 1',          season: 2024 },
  { id: 2,   name: 'UCL',              season: 2024 },
]

const PODIUM = [
  { pos: 1, size: 72, barH: 40, medal: '🥈', border: '#94a3b8' },
  { pos: 0, size: 92, barH: 60, medal: '🥇', border: '#f59e0b' },
  { pos: 2, size: 72, barH: 32, medal: '🥉', border: '#b45309' },
]

export default function Players() {
  const [tab,          setTab]          = useState('scorers')
  const [activeLeague, setActiveLeague] = useState(LEAGUES[0])
  const { isPlayerFav, togglePlayer }   = useFavorites()

  const scorers = useApi(() => playersAPI.getTopScorers(activeLeague.id, activeLeague.season), [activeLeague])
  const assists = useApi(() => playersAPI.getTopAssists(activeLeague.id, activeLeague.season), [activeLeague])

  const current     = tab === 'scorers' ? scorers : assists
  const currentStat = TABS.find(t => t.key === tab)?.stat ?? 'goals'
  const isWC        = activeLeague.id === 1
  const players     = isWC
    ? (tab === 'scorers' ? WC2026_SCORERS : WC2026_ASSISTS)
    : (current.data?.response ?? [])
  const isLoading   = isWC ? false : current.loading

  return (
    <div style={{ minHeight: '100vh' }}>
      <Topbar title="Players" />

      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* League filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {LEAGUES.map(l => {
            const isActive = activeLeague.id === l.id
            return (
              <button
                key={l.id}
                onClick={() => setActiveLeague(l)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid ' + (isActive ? 'transparent' : 'var(--border)'),
                  outline: 'none',
                  transition: 'all 0.2s',
                  background: isActive
                    ? 'rgba(255,255,255,0.1)'
                    : 'var(--surface)',
                  color: isActive ? '#fff' : 'var(--text-2)',
                  border: '1px solid ' + (isActive ? 'rgba(255,255,255,0.2)' : 'var(--border)'),
                }}
              >
                {l.name}
              </button>
            )
          })}
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
                border: '1px solid ' + (tab === key ? 'rgba(255,255,255,0.2)' : 'var(--border)'),
                outline: 'none',
                background: tab === key ? 'rgba(255,255,255,0.1)' : 'var(--surface)',
                color: tab === key ? '#fff' : 'var(--text-2)',
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
        {!isLoading && players.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: 24,
              padding: '32px 0 16px',
              background: 'var(--surface)',
              borderRadius: 20,
              border: '1px solid var(--border)',
            }}
          >
            {PODIUM.map(({ pos, size, barH, medal, border }) => {
              const item   = players[pos]
              const stats  = item?.statistics?.[0]
              const val    = currentStat === 'goals'
                ? stats?.goals?.total
                : stats?.goals?.assists
              const fav    = item && isPlayerFav(item.player.id)

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
                  <div style={{ position: 'relative' }}>
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
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item?.player?.name || '?')}&background=333336&color=fff&size=${size}`
                      }}
                    />
                    {item && (
                      <button
                        onClick={() => togglePlayer({ id: item.player.id, name: item.player.name, photo: item.player.photo, team: stats?.team?.name })}
                        title={fav ? 'Remove from favorites' : 'Add to favorites'}
                        style={{
                          position: 'absolute', bottom: -2, right: -2,
                          width: 24, height: 24, borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'var(--surface)', border: '1px solid var(--border)',
                          cursor: 'pointer',
                        }}
                      >
                        <Star size={12} color={fav ? '#f59e0b' : 'var(--text-3)'} fill={fav ? '#f59e0b' : 'none'} />
                      </button>
                    )}
                  </div>
                  <p style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--text-1)',
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
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '10px 10px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2rem 3rem 1fr 4rem 2.5rem',
            padding: '10px 16px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface2)',
          }}>
            {['#', '', 'Player', currentStat === 'goals' ? 'Goals' : 'Assists', ''].map((h, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textAlign: i === 3 ? 'center' : 'left' }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => <PlayerSkeleton key={i} />)
            : players.map((item, i) => {
              const stats = item.statistics?.[0]
              const val   = currentStat === 'goals'
                ? stats?.goals?.total
                : stats?.goals?.assists
              const rankColors = ['#f59e0b', '#94a3b8', '#b45309']
              const fav = isPlayerFav(item.player.id)

              return (
                <motion.div
                  key={item.player.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2rem 3rem 1fr 4rem 2.5rem',
                    alignItems: 'center',
                    padding: '10px 16px',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Rank */}
                  <span style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: i < 3 ? rankColors[i] : 'var(--text-3)',
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
                        border: '2px solid var(--border)',
                      }}
                      onError={e => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.player.name)}&background=333336&color=fff&size=36`
                      }}
                    />
                  </div>

                  {/* Name + Team */}
                  <div style={{ overflow: 'hidden', paddingLeft: 8 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.player.name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      {stats?.team?.logo && (
                        <img src={stats.team.logo} alt="" style={{ width: 13, height: 13, objectFit: 'contain' }} />
                      )}
                      <span style={{ fontSize: 11, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 800,
                      color: 'var(--text-1)',
                    }}>
                      {val ?? 0}
                    </div>
                  </div>

                  {/* Favorite toggle */}
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      togglePlayer({ id: item.player.id, name: item.player.name, photo: item.player.photo, team: stats?.team?.name })
                    }}
                    title={fav ? 'Remove from favorites' : 'Add to favorites'}
                    style={{
                      display: 'flex', justifyContent: 'center', alignItems: 'center',
                      background: 'transparent', border: 'none', cursor: 'pointer', padding: 4,
                    }}
                  >
                    <Star size={16} color={fav ? '#f59e0b' : 'var(--text-3)'} fill={fav ? '#f59e0b' : 'none'} />
                  </button>
                </motion.div>
              )
            })
          }
        </div>

      </div>
    </div>
  )
}
