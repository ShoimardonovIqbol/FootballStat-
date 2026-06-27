import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { standingsAPI } from '../services/api'
import { Skeleton } from '../components/ui/Skeleton'
import Topbar from '../components/layout/Topbar'

const LEAGUES = [
  { id: 39,  name: 'Premier League', country: 'England' },
  { id: 140, name: 'La Liga',        country: 'Spain'   },
  { id: 135, name: 'Serie A',        country: 'Italy'   },
  { id: 61,  name: 'Ligue 1',        country: 'France'  },
  { id: 2,   name: 'UCL',            country: 'Europe'  },
]

const FORM_COLOR = {
  W: { bg: 'rgba(34,212,122,0.18)', text: '#22d47a', border: 'rgba(34,212,122,0.35)' },
  D: { bg: 'rgba(245,158,11,0.18)', text: '#f59e0b', border: 'rgba(245,158,11,0.35)' },
  L: { bg: 'rgba(244,63,94,0.18)',  text: '#f43f5e', border: 'rgba(244,63,94,0.35)'  },
}

const zoneColor = rank => {
  if (rank <= 4) return '#7c3aed'
  if (rank <= 6) return '#f59e0b'
  return 'transparent'
}

const gdColor = gd => gd > 0 ? '#22d47a' : gd < 0 ? '#f43f5e' : '#64748b'

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
  hidden: { opacity: 0, x: -18 },
  show:   { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
}

const listVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.045 } },
}

const COLS = '2.5rem 2.5rem 1fr 2.5rem 2.5rem 2.5rem 2.5rem 2.5rem 2.5rem 6.5rem 3.5rem'

export default function Standings() {
  const [leagueId, setLeagueId] = useState(39)
  const { data, loading, error } = useApi(() => standingsAPI.get(leagueId, 2024), [leagueId])

  const table   = data?.response?.[0]?.league?.standings?.[0] ?? []
  const lgInfo  = data?.response?.[0]?.league
  const current = LEAGUES.find(l => l.id === leagueId)

  return (
    <div style={{ minHeight: '100vh' }}>
      <Topbar title="Standings" />

      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── League picker ── */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {LEAGUES.map(l => {
            const active = leagueId === l.id
            return (
              <motion.button
                key={l.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setLeagueId(l.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px', borderRadius: 12,
                  fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', border: 'none', outline: 'none',
                  background: active
                    ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
                    : 'rgba(21,21,58,0.8)',
                  color: active ? '#fff' : '#94a3b8',
                  boxShadow: active ? '0 0 18px rgba(124,58,237,0.4)' : 'none',
                  transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
                }}
              >
                <img
                  src={`https://media.api-sports.io/football/leagues/${l.id}.png`}
                  alt=""
                  style={{ width: 18, height: 18, objectFit: 'contain' }}
                  onError={e => { e.target.style.display = 'none' }}
                />
                {l.name}
              </motion.button>
            )
          })}
        </div>

        {/* ── League banner ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={'banner-' + leagueId}
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '16px 24px', borderRadius: 16,
              background: 'linear-gradient(135deg,rgba(124,58,237,0.13),rgba(79,70,229,0.06))',
              border: '1px solid rgba(124,58,237,0.22)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Glow orb */}
            <div style={{
              position: 'absolute', top: -30, right: -30,
              width: 160, height: 160, borderRadius: '50%',
              background: '#7c3aed', opacity: 0.08, filter: 'blur(32px)',
              pointerEvents: 'none',
            }} />

            {/* League logo */}
            <div style={{
              width: 56, height: 56, borderRadius: 14, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              padding: 8,
            }}>
              <img
                src={`https://media.api-sports.io/football/leagues/${leagueId}.png`}
                alt={current?.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={e => { e.target.style.opacity = 0.2 }}
              />
            </div>

            {/* Title */}
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>
                {lgInfo?.name ?? current?.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{current?.country}</span>
                <span style={{
                  fontSize: 11, fontWeight: 600, color: '#a78bfa',
                  background: 'rgba(124,58,237,0.2)',
                  padding: '2px 10px', borderRadius: 999,
                }}>
                  2024/25
                </span>
                {!loading && table.length > 0 && (
                  <span style={{ fontSize: 11, color: '#475569' }}>{table.length} clubs</span>
                )}
              </div>
            </div>

            {/* Zone legend */}
            <div style={{
              marginLeft: 'auto', display: 'flex', flexDirection: 'column',
              gap: 5, alignItems: 'flex-end',
            }}>
              {[
                { color: '#7c3aed', label: 'UCL' },
                { color: '#f59e0b', label: 'Europa' },
              ].map(z => (
                <div key={z.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: z.color }} />
                  <span style={{ fontSize: 11, color: '#64748b' }}>{z.label}</span>
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
              background: 'rgba(16,16,42,0.75)',
              border: '1px solid rgba(124,58,237,0.15)',
              borderRadius: 16, overflow: 'hidden',
            }}
          >
            {/* Column headers */}
            <div style={{
              display: 'grid', gridTemplateColumns: COLS,
              padding: '10px 16px 10px 20px',
              fontSize: 11, fontWeight: 600, color: '#475569',
              borderBottom: '1px solid rgba(124,58,237,0.1)',
              background: 'rgba(124,58,237,0.05)',
            }}>
              <span style={{ textAlign: 'center' }}>#</span>
              <span />
              <span>Club</span>
              <span style={{ textAlign: 'center' }}>P</span>
              <span style={{ textAlign: 'center', color: '#22d47a' }}>W</span>
              <span style={{ textAlign: 'center', color: '#f59e0b' }}>D</span>
              <span style={{ textAlign: 'center', color: '#f43f5e' }}>L</span>
              <span style={{ textAlign: 'center' }}>GF</span>
              <span style={{ textAlign: 'center' }}>GD</span>
              <span style={{ textAlign: 'center' }}>Form</span>
              <span style={{ textAlign: 'center', color: '#a78bfa', fontWeight: 700 }}>Pts</span>
            </div>

            {/* Loading skeletons */}
            {loading && Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 20px',
                borderBottom: '1px solid rgba(124,58,237,0.05)',
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
                <p style={{ color: '#f43f5e', fontSize: 14, fontWeight: 600, margin: '0 0 6px' }}>
                  API limit reached
                </p>
                <p style={{ color: '#475569', fontSize: 12, margin: 0 }}>Please try again tomorrow</p>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && table.length === 0 && (
              <div style={{ padding: '52px 0', textAlign: 'center' }}>
                <p style={{ color: '#475569', fontSize: 13, margin: 0 }}>No standings data</p>
              </div>
            )}

            {/* Table rows */}
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
                        padding: '9px 16px 9px 17px',
                        borderBottom: '1px solid rgba(124,58,237,0.06)',
                        borderLeft: `3px solid ${zc}`,
                        background: isPromo ? 'rgba(124,58,237,0.035)' : 'transparent',
                        transition: 'background 0.14s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = isPromo
                          ? 'rgba(124,58,237,0.035)'
                          : 'transparent'
                      }}
                    >
                      {/* Rank */}
                      <div style={{ textAlign: 'center' }}>
                        <span style={{
                          fontSize: 12, fontWeight: 700,
                          color: isPromo ? '#a78bfa' : '#475569',
                        }}>
                          {row.rank}
                        </span>
                      </div>

                      {/* Team logo */}
                      <Link to={`/teams/${row.team.id}`} onClick={e => e.stopPropagation()}>
                        <motion.img
                          whileHover={{ scale: 1.2 }}
                          src={row.team.logo}
                          alt={row.team.name}
                          style={{ width: 26, height: 26, objectFit: 'contain', display: 'block' }}
                          onError={e => { e.target.style.opacity = 0.25 }}
                        />
                      </Link>

                      {/* Team name */}
                      <Link to={`/teams/${row.team.id}`} style={{ textDecoration: 'none', overflow: 'hidden' }}>
                        <span
                          style={{
                            fontSize: 13, fontWeight: isPromo ? 700 : 500,
                            color: isPromo ? '#e2e8f0' : '#cbd5e1',
                            overflow: 'hidden', textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap', display: 'block',
                            transition: 'color 0.14s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#a78bfa' }}
                          onMouseLeave={e => {
                            e.currentTarget.style.color = isPromo ? '#e2e8f0' : '#cbd5e1'
                          }}
                        >
                          {row.team.name}
                        </span>
                      </Link>

                      {/* P */}
                      <span style={{ textAlign: 'center', fontSize: 12, color: '#64748b' }}>
                        {row.all.played}
                      </span>
                      {/* W */}
                      <span style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#22d47a' }}>
                        {row.all.win}
                      </span>
                      {/* D */}
                      <span style={{ textAlign: 'center', fontSize: 12, color: '#f59e0b' }}>
                        {row.all.draw}
                      </span>
                      {/* L */}
                      <span style={{ textAlign: 'center', fontSize: 12, color: '#f43f5e' }}>
                        {row.all.lose}
                      </span>
                      {/* GF */}
                      <span style={{ textAlign: 'center', fontSize: 12, color: '#64748b' }}>
                        {row.all.goals.for}
                      </span>
                      {/* GD */}
                      <span style={{
                        textAlign: 'center', fontSize: 12, fontWeight: 600,
                        color: gdColor(row.goalsDiff),
                      }}>
                        {row.goalsDiff > 0 ? '+' : ''}{row.goalsDiff}
                      </span>

                      {/* Form last 5 */}
                      <div style={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                        {(row.form ?? '').split('').slice(-5).map((r, j) => (
                          <FormBadge key={j} result={r} />
                        ))}
                      </div>

                      {/* Points */}
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{
                          minWidth: 36, height: 28, borderRadius: 8, padding: '0 8px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 800, color: '#fff',
                          background: isPromo
                            ? 'linear-gradient(135deg,rgba(124,58,237,0.35),rgba(79,70,229,0.35))'
                            : 'rgba(255,255,255,0.05)',
                          border: isPromo
                            ? '1px solid rgba(124,58,237,0.45)'
                            : '1px solid rgba(255,255,255,0.07)',
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
