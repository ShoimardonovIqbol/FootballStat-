import { useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Shield, MapPin, Calendar, Star } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { teamsAPI } from '../services/api'
import { useFavorites } from '../context/FavoritesContext'
import Topbar from '../components/layout/Topbar'

const LEAGUES = [
  { id: 39,  name: 'Premier League' },
  { id: 140, name: 'La Liga'        },
  { id: 135, name: 'Serie A'        },
  { id: 61,  name: 'Ligue 1'        },
  { id: 2,   name: 'UCL'            },
]

const BLOB_SETS = [
  ['#1d4ed8','#0ea5e9','#2563eb'],
  ['#0ea5e9','#14b8a6','#3b82f6'],
  ['#0891b2','#ec4899','#6366f1'],
  ['#14b8a6','#0ea5e9','#06b6d4'],
]

function TeamCard({ team, venue, leagueName, index }) {
  const blobs = BLOB_SETS[index % BLOB_SETS.length]
  const { isTeamFav, toggleTeam } = useFavorites()
  const fav = isTeamFav(team.id)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035, type: 'spring', stiffness: 260, damping: 22 }}
      className="team-flip-wrap"
      style={{ position: 'relative' }}
    >
      <button
        onClick={e => { e.preventDefault(); e.stopPropagation(); toggleTeam({ id: team.id, name: team.name, logo: team.logo }) }}
        title={fav ? 'Remove from favorites' : 'Add to favorites'}
        style={{
          position: 'absolute', top: 8, right: 8, zIndex: 5,
          width: 28, height: 28, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.15)',
          cursor: 'pointer',
        }}
      >
        <Star size={14} color={fav ? '#f59e0b' : '#fff'} fill={fav ? '#f59e0b' : 'none'} />
      </button>
      <Link to={`/teams/${team.id}`} style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none' }}>
        <div className="team-flip-inner">

          {/* ── BACK (shown by default) ── */}
          <div className="team-flip-back">
            <div className="team-flip-back-inner">
              <div style={{
                width: 72, height: 72, borderRadius: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                padding: 12,
              }}>
                <img src={team.logo} alt={team.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={e => { e.target.style.opacity = 0.3 }} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', textAlign: 'center', padding: '0 10px' }}>
                {team.name}
              </p>
              <p style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.05em' }}>
                HOVER TO SEE MORE
              </p>
            </div>
          </div>

          {/* ── FRONT (shown on hover) ── */}
          <div className="team-flip-front">
            {/* Blobs */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <div className="team-blob" style={{
                width: 100, height: 100,
                background: blobs[0],
                top: -10, left: -20,
                animationDelay: '0ms',
              }} />
              <div className="team-blob" style={{
                width: 120, height: 120,
                background: blobs[1],
                top: 30, left: 60,
                animationDelay: '-800ms',
              }} />
              <div className="team-blob" style={{
                width: 60, height: 60,
                background: blobs[2],
                top: -30, left: 130,
                animationDelay: '-1600ms',
              }} />
            </div>

            {/* Front content */}
            <div style={{
              position: 'absolute', inset: 0,
              padding: 12,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              {/* Badge */}
              <span style={{
                background: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(4px)',
                padding: '3px 10px', borderRadius: 20,
                fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.75)',
                width: 'fit-content',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                {leagueName}
              </span>

              {/* Logo center */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 16, padding: 10,
                  background: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <img src={team.logo} alt={team.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={e => { e.target.style.opacity = 0.3 }} />
                </div>
              </div>

              {/* Info bottom */}
              <div style={{
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(6px)',
                borderRadius: 8, padding: '8px 10px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', flex: 1 }}>{team.name}</p>
                  <svg fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" viewBox="0 0 24 24"
                    style={{ width: 14, height: 14, flexShrink: 0, marginLeft: 4 }}>
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {team.founded && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={9} color="#64748b" />
                      <span style={{ fontSize: 9, color: '#64748b' }}>{team.founded}</span>
                    </div>
                  )}
                  {venue?.name && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden' }}>
                      <MapPin size={9} color="rgba(255,255,255,0.4)" />
                      <span style={{
                        fontSize: 9, color: 'rgba(255,255,255,0.5)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        maxWidth: 110,
                      }}>{venue.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  )
}

function SkeletonCard() {
  return (
    <div className="team-flip-wrap">
      <div style={{
        width: '100%', height: '100%',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--surface2)' }} className="shimmer" />
        <div style={{ width: 90, height: 10, borderRadius: 5 }} className="shimmer" />
        <div style={{ width: 60, height: 8, borderRadius: 5 }} className="shimmer" />
      </div>
    </div>
  )
}

export default function Teams() {
  const [league, setLeague] = useState(39)
  const { data, loading }   = useApi(() => teamsAPI.getList({ league, season: 2024 }), [league])
  const teams = data?.response ?? []
  const currentLeague = LEAGUES.find(l => l.id === league)

  return (
    <div style={{ minHeight: '100vh' }}>
      <Topbar title="Teams" />

      <div style={{ padding: '24px 32px' }}>
        {/* League filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          {LEAGUES.map(l => {
            const active = league === l.id
            return (
              <motion.button
                key={l.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setLeague(l.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '8px 16px', borderRadius: 12,
                  fontSize: 13, fontWeight: 600,
                  cursor: 'pointer',
                  border: active ? 'none' : '1px solid var(--border)',
                  outline: 'none',
                  background: active ? 'rgba(255,255,255,0.1)' : 'var(--surface)',
                  color: active ? '#fff' : 'var(--text-2)',
                  border: active ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--border)',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                <Shield size={13} strokeWidth={active ? 2.5 : 1.8} />
                {l.name}
              </motion.button>
            )
          })}
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 16,
        }}>
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : teams.map(({ team, venue }, i) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  venue={venue}
                  leagueName={currentLeague?.name ?? ''}
                  index={i}
                />
              ))
          }
        </div>
      </div>
    </div>
  )
}
