import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Radio, CalendarDays, List, Zap } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { matchesAPI } from '../services/api'
import MatchCard from '../components/ui/MatchCard'
import { MatchCardSkeleton } from '../components/ui/Skeleton'
import Topbar from '../components/layout/Topbar'

const TABS = [
  { key: 'Today', label: 'Today',   icon: CalendarDays },
  { key: 'Live',  label: 'Live',    icon: Radio        },
  { key: 'All',   label: 'All',     icon: List         },
]

function StatPill({ icon: Icon, label, value, accent }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 20px', borderRadius: 14,
      background: 'var(--surface)', border: '1px solid var(--border)',
      flex: 1,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: accent + '18',
      }}>
        <Icon size={17} color={accent} />
      </div>
      <div>
        <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)', lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 3 }}>{label}</p>
      </div>
    </div>
  )
}

export default function Matches() {
  const [tab, setTab] = useState('Today')

  const today = useApi(() => matchesAPI.getToday(), [])
  const live  = useApi(() => matchesAPI.getLive(), [])
  const all   = useApi(() => matchesAPI.getList({ league: 39, season: 2024 }), [])

  const source = tab === 'Today' ? today : tab === 'Live' ? live : all

  const grouped = (() => {
    if (tab === 'Today' && today.data?.leagues) return today.data.leagues
    const fixtures = (tab === 'Live' ? live.data?.response : all.data?.response) ?? []
    const g = {}
    fixtures.forEach(f => {
      const id = f.league.id
      if (!g[id]) g[id] = { league: f.league, fixtures: [] }
      g[id].fixtures.push(f)
    })
    return Object.values(g)
  })()

  const totalToday  = (today.data?.leagues ?? []).reduce((s, l) => s + l.fixtures.length, 0)
  const totalLive   = live.data?.results ?? 0
  const totalLeagues = grouped.length

  return (
    <div style={{ minHeight: '100vh' }}>
      <Topbar title="Matches" />

      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12 }}>
          <StatPill icon={CalendarDays} label="Matches today"   value={today.loading ? '—' : totalToday}  accent="#7c3aed" />
          <StatPill icon={Radio}        label="Live right now"  value={live.loading  ? '—' : totalLive}   accent="#22d47a" />
          <StatPill icon={Zap}          label="Leagues"         value={source.loading ? '—' : totalLeagues} accent="#f59e0b" />
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 6,
          background: 'var(--surface2)',
          padding: 4, borderRadius: 14,
          width: 'fit-content',
          border: '1px solid var(--border)',
        }}>
          {TABS.map(({ key, label, icon: Icon }) => {
            const active = tab === key
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  position: 'relative',
                  padding: '8px 18px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: active ? '#fff' : 'var(--text-2)',
                  background: active ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  transition: 'all 0.2s',
                  outline: 'none',
                  boxShadow: active ? '0 2px 12px rgba(124,58,237,0.35)' : 'none',
                }}
              >
                <Icon size={13} />
                {label}
                {key === 'Live' && !live.loading && live.data?.results > 0 && (
                  <span style={{
                    fontSize: 10,
                    background: active ? 'rgba(255,255,255,0.25)' : 'rgba(34,212,122,0.15)',
                    color: active ? '#fff' : '#22d47a',
                    padding: '1px 6px',
                    borderRadius: 999,
                    fontWeight: 800,
                  }}>
                    {live.data.results}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            {source.loading
              ? [0,1,2].map(i => (
                <div key={i} style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  overflow: 'hidden',
                }}>
                  {/* Skeleton league header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--surface2)',
                  }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(124,58,237,0.1)' }} className="shimmer" />
                    <div style={{ width: 120, height: 11, borderRadius: 4 }} className="shimmer" />
                    <div style={{ marginLeft: 'auto', width: 60, height: 11, borderRadius: 4 }} className="shimmer" />
                  </div>
                  <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[0,1,2].map(j => <MatchCardSkeleton key={j} />)}
                  </div>
                </div>
              ))
              : grouped.length === 0
              ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 16,
                    padding: '72px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: 'rgba(124,58,237,0.08)',
                    border: '1px solid rgba(124,58,237,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 4,
                  }}>
                    <CalendarDays size={24} color="#7c3aed" />
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>No matches found</p>
                  <p style={{ fontSize: 12, color: 'var(--text-2)' }}>
                    {tab === 'Live' ? 'No live matches right now' : 'Check back later'}
                  </p>
                </motion.div>
              )
              : grouped.map(({ league, fixtures }, gi) => (
                <motion.div
                  key={league.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gi * 0.05, type: 'spring', stiffness: 280, damping: 26 }}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 16,
                    overflow: 'hidden',
                  }}
                >
                  {/* League header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 16px',
                    background: 'var(--surface2)',
                    borderBottom: '1px solid var(--border)',
                    borderLeft: '3px solid #7c3aed',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--surface)', border: '1px solid var(--border)',
                      padding: 5,
                    }}>
                      <img
                        src={league.logo || league.flag}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={e => { e.target.style.opacity = 0.3 }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {league.name}
                      </p>
                      <p style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 1 }}>
                        {league.country}{league.round ? ' · ' + league.round : ''}
                      </p>
                    </div>
                    <div style={{
                      padding: '3px 10px', borderRadius: 999,
                      background: 'rgba(124,58,237,0.1)',
                      border: '1px solid rgba(124,58,237,0.2)',
                      fontSize: 11, fontWeight: 700, color: '#7c3aed',
                      flexShrink: 0,
                    }}>
                      {fixtures.length} {fixtures.length === 1 ? 'match' : 'matches'}
                    </div>
                  </div>

                  {/* Fixtures */}
                  <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {fixtures.map((m, i) => (
                      <MatchCard key={m.fixture.id} fixture={m} index={i} />
                    ))}
                  </div>
                </motion.div>
              ))
            }
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  )
}
