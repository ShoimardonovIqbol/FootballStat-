import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Radio, CalendarDays, List } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { matchesAPI } from '../services/api'
import MatchCard from '../components/ui/MatchCard'
import { MatchCardSkeleton } from '../components/ui/Skeleton'
import Topbar from '../components/layout/Topbar'

const TABS = [
  { key: 'Today', label: 'Today',  icon: CalendarDays },
  { key: 'Live',  label: 'Live',   icon: Radio        },
  { key: 'All',   label: 'All',    icon: List         },
]

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

  return (
    <div>
      <Topbar title="Matches" />

      <div style={{ padding: '24px 32px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
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
                color: tab === key ? '#fff' : 'var(--text-2)',
                background: tab === key
                  ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
                  : 'var(--surface)',
                border: '1px solid ' + (tab === key ? 'transparent' : 'var(--border)'),
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s',
                outline: 'none',
              }}
            >
              <Icon size={14} />
              {label}
              {key === 'Live' && live.data && (
                <span style={{
                  fontSize: 11,
                  background: 'rgba(34,212,122,0.15)',
                  color: '#22d47a',
                  padding: '2px 6px',
                  borderRadius: 999,
                  fontWeight: 700,
                }}>
                  {live.data.results}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            {source.loading
              ? [0,1,2].map(i => (
                <div key={i} style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}>
                  {[0,1,2].map(j => <MatchCardSkeleton key={j} />)}
                </div>
              ))
              : grouped.length === 0
              ? (
                <div style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: '64px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                }}>
                  <CalendarDays size={40} style={{ color: 'var(--text-4)' }} />
                  <p style={{ color: 'var(--text-2)', fontWeight: 500 }}>No matches found</p>
                </div>
              )
              : grouped.map(({ league, fixtures }) => (
                <div key={league.id} style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: 16,
                  overflow: 'hidden',
                }}>
                  {/* League header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 14,
                    paddingBottom: 12,
                    borderBottom: '1px solid var(--border)',
                  }}>
                    <img src={league.logo || league.flag} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{league.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 1 }}>{league.country} · {league.round}</p>
                    </div>
                    <span style={{
                      marginLeft: 'auto',
                      fontSize: 11,
                      color: '#a78bfa',
                      fontWeight: 600,
                    }}>
                      {fixtures.length} matches
                    </span>
                  </div>
                  {/* Fixtures */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {fixtures.map((m, i) => (
                      <MatchCard key={m.fixture.id} fixture={m} index={i} />
                    ))}
                  </div>
                </div>
              ))
            }
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
