import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Radio, CalendarDays, RefreshCw, Trophy } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { matchesAPI } from '../services/api'
import MatchCard from '../components/ui/MatchCard'
import { MatchCardSkeleton } from '../components/ui/Skeleton'
import Topbar from '../components/layout/Topbar'

const TABS = [
  { key: 'Today',     label: 'Today',     icon: CalendarDays },
  { key: 'Live',      label: 'Live',      icon: Radio        },
  { key: 'WorldCup',  label: 'World Cup', icon: Trophy       },
]

const LIVE_STATUS = ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'INT']

const flag = code => `https://flagcdn.com/w40/${code}.png`
const wc = (name, code) => ({ name, flag: flag(code) })

// FIFA World Cup 2026 — Round of 32 schedule
const WC2026_FIXTURES = [
  { round: 'Round of 32', when: 'Today, 22:00',        home: wc('Côte d’Ivoire', 'ci'), away: wc('Norway', 'no') },
  { round: 'Round of 32', when: 'Tomorrow, 02:00',      home: wc('France', 'fr'),            away: wc('Sweden', 'se') },
  { round: 'Round of 32', when: 'Tomorrow, 06:00',      home: wc('Mexico', 'mx'),            away: wc('Ecuador', 'ec') },
  { round: 'Round of 32', when: 'Tomorrow, 21:00',      home: wc('England', 'gb'),           away: wc('DR Congo', 'cd') },
  { round: 'Round of 32', when: 'Thu, Jul 2 · 01:00',   home: wc('Belgium', 'be'),           away: wc('Senegal', 'sn') },
  { round: 'Round of 32', when: 'Thu, Jul 2 · 05:00',   home: wc('USA', 'us'),                away: wc('Bosnia & Herz.', 'ba') },
  { round: 'Round of 32', when: 'Fri, Jul 3 · 00:00',   home: wc('Spain', 'es'),             away: wc('Austria', 'at') },
  { round: 'Round of 32', when: 'Fri, Jul 3 · 04:00',   home: wc('Portugal', 'pt'),          away: wc('Croatia', 'hr') },
  { round: 'Round of 32', when: 'Fri, Jul 3 · 19:00',   home: wc('Germany', 'de'),           away: wc('Paraguay', 'py') },
  { round: 'Round of 32', when: 'Fri, Jul 3 · 23:00',   home: wc('South Africa', 'za'),      away: wc('Canada', 'ca') },
  { round: 'Round of 32', when: 'Sat, Jul 4 · 03:00',   home: wc('Netherlands', 'nl'),       away: wc('Morocco', 'ma') },
  { round: 'Round of 32', when: 'Sat, Jul 4 · 07:00',   home: wc('Brazil', 'br'),            away: wc('Japan', 'jp') },
  { round: 'Round of 32', when: 'Sat, Jul 4 · 20:00',   home: wc('Argentina', 'ar'),         away: wc('Curaçao', 'cw') },
  { round: 'Round of 32', when: 'Sun, Jul 5 · 00:00',   home: wc('Australia', 'au'),         away: wc('Egypt', 'eg') },
  { round: 'Round of 32', when: 'Sun, Jul 5 · 04:00',   home: wc('Switzerland', 'ch'),       away: wc('Algeria', 'dz') },
  { round: 'Round of 32', when: 'Sun, Jul 5 · 08:00',   home: wc('Colombia', 'co'),          away: wc('Ghana', 'gh') },
]

function WCFixtureRow({ m }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 130px 1fr', alignItems: 'center',
      gap: 12, padding: '14px 16px', borderRadius: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end', overflow: 'hidden' }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {m.home.name}
        </span>
        <img src={m.home.flag} alt="" style={{ width: 26, height: 18, objectFit: 'cover', borderRadius: 3, flexShrink: 0 }} onError={e => e.target.style.opacity = 0.2} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{m.when}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
        <img src={m.away.flag} alt="" style={{ width: 26, height: 18, objectFit: 'cover', borderRadius: 3, flexShrink: 0 }} onError={e => e.target.style.opacity = 0.2} />
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {m.away.name}
        </span>
      </div>
    </div>
  )
}

function WorldCupTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
        background: 'var(--surface2)', borderBottom: '1px solid var(--border)',
        borderLeft: '3px solid var(--border)',
      }}>
        <Trophy size={24} color="var(--text-2)" />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>FIFA World Cup 2026</p>
          <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Round of 32 · USA · Canada · Mexico</p>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600 }}>{WC2026_FIXTURES.length} matches</span>
      </div>
      <div style={{ padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {WC2026_FIXTURES.map((m, i) => <WCFixtureRow key={i} m={m} />)}
      </div>
    </motion.div>
  )
}

function StatPill({ icon: Icon, label, value, accent, loading }) {
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
        {loading
          ? <div style={{ width: 28, height: 18, borderRadius: 4, background: 'var(--surface2)' }} className="shimmer" />
          : <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)', lineHeight: 1 }}>{value}</p>
        }
        <p style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 3 }}>{label}</p>
      </div>
    </div>
  )
}

function LeagueGroup({ league, fixtures, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
        background: 'var(--surface2)', borderBottom: '1px solid var(--border)',
        borderLeft: '3px solid var(--border)',
      }}>
        <img
          src={league.logo || league.flag} alt=""
          style={{ width: 28, height: 28, objectFit: 'contain' }}
          onError={e => { e.target.style.opacity = 0.3 }}
        />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{league.name}</p>
          <p style={{ fontSize: 10, color: 'var(--text-3)' }}>{league.country}</p>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>
          {fixtures.length} {fixtures.length === 1 ? 'match' : 'matches'}
        </span>
      </div>
      <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {fixtures.map((m, i) => <MatchCard key={m.fixture.id} fixture={m} index={i} />)}
      </div>
    </motion.div>
  )
}

function LeagueGroupSkeleton({ i }) {
  return (
    <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--surface2)' }} className="shimmer" />
        <div style={{ width: 120, height: 11, borderRadius: 4, background: 'var(--surface2)' }} className="shimmer" />
      </div>
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[0, 1, 2].map(j => <MatchCardSkeleton key={j} />)}
      </div>
    </div>
  )
}

function EmptyState({ tab }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16,
      padding: '72px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
    }}>
      {tab === 'Live'
        ? <Radio size={24} color="var(--text-2)" />
        : <CalendarDays size={24} color="var(--text-2)" />
      }
      <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>
        {tab === 'Live' ? 'No live matches right now' : 'No matches scheduled today'}
      </p>
      <p style={{ fontSize: 12, color: 'var(--text-2)' }}>
        {tab === 'Live' ? 'Check back once a match kicks off' : 'Try the Live tab or check back later'}
      </p>
    </div>
  )
}

export default function Matches() {
  const [tab, setTab] = useState('Today')

  const today = useApi(() => matchesAPI.getToday(), [])
  const live  = useApi(() => matchesAPI.getLive(), [])

  const source = tab === 'Today' ? today : tab === 'Live' ? live : null

  const grouped = useMemo(() => {
    if (tab === 'Today') return today.data?.leagues ?? []
    const fixtures = live.data?.response ?? []
    const g = {}
    fixtures.forEach(f => {
      const id = f.league.id
      if (!g[id]) g[id] = { league: f.league, fixtures: [] }
      g[id].fixtures.push(f)
    })
    return Object.values(g)
  }, [tab, today.data, live.data])

  const todayCount = today.data?.leagues?.reduce((sum, g) => sum + g.fixtures.length, 0) ?? 0
  const liveCount = live.data?.response?.length ?? 0

  return (
    <div style={{ minHeight: '100vh' }}>
      <Topbar title="Matches" />

      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Header */}
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>Matches</h2>
          <p style={{ fontSize: 12, color: 'var(--text-2)', margin: '2px 0 0' }}>
            Real-time fixtures and live scores
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12 }}>
          <StatPill icon={CalendarDays} label="Today" value={todayCount} accent="var(--text-2)" loading={today.loading} />
          <StatPill icon={Radio}        label="Live right now" value={liveCount} accent="#22d47a" loading={live.loading} />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
                    background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: active ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    transition: 'all 0.2s',
                    outline: 'none',
                  }}
                >
                  <Icon size={13} />
                  {label}
                  {key === 'Live' && liveCount > 0 && (
                    <span style={{
                      fontSize: 10,
                      background: active ? 'rgba(255,255,255,0.25)' : 'rgba(34,212,122,0.15)',
                      color: active ? '#fff' : '#22d47a',
                      padding: '1px 6px',
                      borderRadius: 999,
                      fontWeight: 800,
                    }}>
                      {liveCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {source && (
            <button
              onClick={() => source.refetch()}
              disabled={source.loading}
              title="Refresh"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 36, height: 36, borderRadius: 10,
                border: '1px solid var(--border)', background: 'var(--surface2)',
                cursor: source.loading ? 'default' : 'pointer', color: 'var(--text-2)',
              }}
            >
              <RefreshCw size={14} className={source.loading ? 'spin' : ''} />
            </button>
          )}
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
            {tab === 'WorldCup'
              ? <WorldCupTab />
              : source.loading
                ? [0, 1, 2].map(i => <LeagueGroupSkeleton key={i} i={i} />)
                : grouped.length === 0
                  ? <EmptyState tab={tab} />
                  : grouped.map(({ league, fixtures }, gi) => (
                    <LeagueGroup key={league.id} league={league} fixtures={fixtures} index={gi} />
                  ))
            }
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        .spin { animation: m-spin 0.8s linear infinite; }
        @keyframes m-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
