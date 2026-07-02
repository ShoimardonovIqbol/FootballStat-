import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { standingsAPI } from '../services/api'
import { Skeleton } from '../components/ui/Skeleton'
import Topbar from '../components/layout/Topbar'

const LEAGUES = [
  { id: 39,  name: 'Premier League', country: 'England', season: 2024 },
  { id: 140, name: 'La Liga',        country: 'Spain',   season: 2024 },
  { id: 135, name: 'Serie A',        country: 'Italy',   season: 2024 },
  { id: 61,  name: 'Ligue 1',        country: 'France',  season: 2024 },
  { id: 2,   name: 'UCL',            country: 'Europe',  season: 2024 },
  { id: 1,   name: 'World Cup 2022', country: 'Qatar',   season: 2022 },
]

const FORM_COLOR = {
  W: { bg: 'rgba(34,212,122,0.15)',  text: '#16a34a', border: 'rgba(34,212,122,0.3)' },
  D: { bg: 'rgba(245,158,11,0.15)', text: '#d97706', border: 'rgba(245,158,11,0.3)' },
  L: { bg: 'rgba(244,63,94,0.15)',  text: '#dc2626', border: 'rgba(244,63,94,0.3)'  },
}

const zoneColor = rank => {
  if (rank <= 4) return '#3fca7a'
  if (rank <= 6) return '#f59e0b'
  return 'transparent'
}

const gdColor = gd => gd > 0 ? '#16a34a' : gd < 0 ? '#dc2626' : 'var(--text-3)'

function FormBadge({ result }) {
  const c = FORM_COLOR[result]
  if (!c) return null
  return (
    <div style={{
      width: 20, height: 20, borderRadius: 4, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 10, fontWeight: 800,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>
      {result}
    </div>
  )
}

const rowVariants = {
  hidden: { opacity: 0, x: -16 },
  show:   { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
}
const listVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.04 } },
}

const COLS = '2.4rem 2.4rem 1fr 2.4rem 2.4rem 2.4rem 2.4rem 2.4rem 2.6rem 6rem 3.2rem'

export default function Standings() {
  const [leagueId, setLeagueId] = useState(39)
  const current = LEAGUES.find(l => l.id === leagueId)
  const { data, loading, error } = useApi(() => standingsAPI.get(leagueId, current?.season ?? 2024), [leagueId])

  const table  = data?.response?.[0]?.league?.standings?.[0] ?? []
  const lgInfo = data?.response?.[0]?.league

  return (
    <div>
      <Topbar title="Standings" />

      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── League tabs ── */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {LEAGUES.map(l => {
            const active = leagueId === l.id
            return (
              <button
                key={l.id}
                onClick={() => setLeagueId(l.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px', borderRadius: 12,
                  fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', border: active ? 'none' : '1px solid var(--border)',
                  background: active ? 'rgba(255,255,255,0.1)' : 'var(--surface)',
                  color: active ? '#fff' : 'var(--text-2)',
                  border: active ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--border)',
                  transition: 'all 0.18s',
                }}
              >
                <img
                  src={`https://media.api-sports.io/football/leagues/${l.id}.png`}
                  alt="" style={{ width: 18, height: 18, objectFit: 'contain' }}
                  onError={e => { e.target.style.display = 'none' }}
                />
                {l.name}
              </button>
            )
          })}
        </div>

        {/* ── League banner ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={'banner-' + leagueId}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '16px 24px', borderRadius: 16,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--surface)', border: '1px solid var(--border)', padding: 8,
            }}>
              <img src={`https://media.api-sports.io/football/leagues/${leagueId}.png`}
                alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={e => { e.target.style.opacity = 0.2 }} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>
                {lgInfo?.name ?? current?.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{current?.country}</span>
                <span style={{
                  fontSize: 11, fontWeight: 600, color: 'var(--text-2)',
                  background: 'rgba(255,255,255,0.07)',
                  padding: '2px 10px', borderRadius: 999,
                  border: '1px solid var(--border)',
                }}>2024/25</span>
                {!loading && table.length > 0 && (
                  <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{table.length} clubs</span>
                )}
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end' }}>
              {[{ color: '#3fca7a', label: 'UCL' }, { color: '#f59e0b', label: 'Europa' }].map(z => (
                <div key={z.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: z.color }} />
                  <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{z.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Table ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={'table-' + leagueId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16, overflow: 'hidden',
            }}
          >
            {/* Header row */}
            <div style={{
              display: 'grid', gridTemplateColumns: COLS,
              padding: '10px 16px 10px 20px',
              fontSize: 11, fontWeight: 700, color: 'var(--text-3)',
              borderBottom: '1px solid var(--border)',
              background: 'var(--surface2)',
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              <span style={{ textAlign: 'center' }}>#</span>
              <span />
              <span>Club</span>
              <span style={{ textAlign: 'center' }}>P</span>
              <span style={{ textAlign: 'center', color: '#16a34a' }}>W</span>
              <span style={{ textAlign: 'center', color: '#d97706' }}>D</span>
              <span style={{ textAlign: 'center', color: '#dc2626' }}>L</span>
              <span style={{ textAlign: 'center' }}>GF</span>
              <span style={{ textAlign: 'center' }}>GD</span>
              <span style={{ textAlign: 'center' }}>Form</span>
              <span style={{ textAlign: 'center', color: 'var(--text-2)' }}>Pts</span>
            </div>

            {/* Loading */}
            {loading && Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 20px', borderBottom: '1px solid var(--border)',
              }}>
                <Skeleton style={{ width: 20, height: 11, borderRadius: 3 }} />
                <Skeleton style={{ width: 26, height: 26, borderRadius: '50%' }} />
                <Skeleton style={{ height: 11, flex: 1 }} />
                <Skeleton style={{ height: 11, width: 110 }} />
              </div>
            ))}

            {/* Error */}
            {!loading && error && (
              <div style={{ padding: '52px 0', textAlign: 'center' }}>
                <p style={{ color: '#dc2626', fontSize: 14, fontWeight: 600, margin: '0 0 6px' }}>API limit reached</p>
                <p style={{ color: 'var(--text-3)', fontSize: 12, margin: 0 }}>Please try again tomorrow</p>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && table.length === 0 && (
              <div style={{ padding: '52px 0', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-3)', fontSize: 13, margin: 0 }}>No standings data available</p>
              </div>
            )}

            {/* Rows */}
            {!loading && !error && table.length > 0 && (
              <motion.div variants={listVariants} initial="hidden" animate="show">
                {table.map(row => {
                  const zc      = zoneColor(row.rank)
                  const isPromo = row.rank <= 4

                  return (
                    <motion.div
                      key={row.team.id}
                      variants={rowVariants}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: COLS,
                        alignItems: 'center',
                        padding: '10px 16px 10px 17px',
                        borderBottom: '1px solid var(--border)',
                        borderLeft: `3px solid ${zc}`,
                        background: isPromo ? 'rgba(63,202,122,0.04)' : 'transparent',
                        transition: 'background 0.14s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = isPromo ? 'rgba(63,202,122,0.04)' : 'transparent' }}
                    >
                      {/* Rank */}
                      <span style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: isPromo ? '#3fca7a' : 'var(--text-3)' }}>
                        {row.rank}
                      </span>

                      {/* Logo */}
                      <Link to={`/teams/${row.team.id}`} onClick={e => e.stopPropagation()}>
                        <img src={row.team.logo} alt="" style={{ width: 24, height: 24, objectFit: 'contain', display: 'block' }}
                          onError={e => { e.target.style.opacity = 0.2 }} />
                      </Link>

                      {/* Name */}
                      <Link to={`/teams/${row.team.id}`} style={{ textDecoration: 'none', overflow: 'hidden' }}>
                        <span style={{
                          fontSize: 13, fontWeight: isPromo ? 700 : 500,
                          color: 'var(--text-1)',
                          overflow: 'hidden', textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap', display: 'block',
                        }}>
                          {row.team.name}
                        </span>
                      </Link>

                      {/* Stats */}
                      <span style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-2)' }}>{row.all.played}</span>
                      <span style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#16a34a' }}>{row.all.win}</span>
                      <span style={{ textAlign: 'center', fontSize: 12, color: '#d97706' }}>{row.all.draw}</span>
                      <span style={{ textAlign: 'center', fontSize: 12, color: '#dc2626' }}>{row.all.lose}</span>
                      <span style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-2)' }}>{row.all.goals.for}</span>
                      <span style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: gdColor(row.goalsDiff) }}>
                        {row.goalsDiff > 0 ? '+' : ''}{row.goalsDiff}
                      </span>

                      {/* Form */}
                      <div style={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                        {(row.form ?? '').split('').slice(-5).map((r, j) => <FormBadge key={j} result={r} />)}
                      </div>

                      {/* Points */}
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{
                          minWidth: 34, height: 28, borderRadius: 8, padding: '0 8px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 800,
                          color: isPromo ? '#fff' : 'var(--text-1)',
                          background: isPromo ? 'rgba(63,202,122,0.18)' : 'var(--surface2)',
                          border: isPromo ? 'none' : '1px solid var(--border)',
                        }}>
                          {row.points}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
