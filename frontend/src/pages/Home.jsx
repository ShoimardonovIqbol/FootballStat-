import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Radio, CalendarDays, Trophy, ChevronRight, TrendingUp, Layers } from 'lucide-react'
import { matchesAPI, playersAPI, standingsAPI } from '../services/api'
import MatchCard from '../components/ui/MatchCard'
import PlayerCard from '../components/ui/PlayerCard'
import { MatchCardSkeleton, PlayerSkeleton, Skeleton } from '../components/ui/Skeleton'
import Topbar from '../components/layout/Topbar'

const LEAGUE_ID = 39
const SEASON    = 2024

function SectionTitle({ children, to, icon: Icon, accent }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {Icon && (
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: (accent || '#7c3aed') + '22' }}>
            <Icon size={14} style={{ color: accent || '#a78bfa' }} />
          </div>
        )}
        <h2 className="text-sm font-bold text-white tracking-wide">{children}</h2>
      </div>
      {to && (
        <Link to={to} className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition font-medium">
          See all <ChevronRight size={11} />
        </Link>
      )}
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color, delay, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass p-5 relative overflow-hidden"
    >
      {/* Glow blob */}
      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-20"
        style={{ background: color }} />

      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs text-slate-500 mb-2 font-medium">{label}</p>
          {loading
            ? <Skeleton className="h-8 w-14" />
            : <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
          }
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: color + '22', border: '1px solid ' + color + '44' }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const [live,      setLive]      = useState(null)
  const [today,     setToday]     = useState(null)
  const [scorers,   setScorers]   = useState(null)
  const [standings, setStandings] = useState(null)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      matchesAPI.getLive(),
      matchesAPI.getToday(),
      playersAPI.getTopScorers(LEAGUE_ID, SEASON),
      standingsAPI.get(LEAGUE_ID, SEASON),
    ]).then(([l, t, s, st]) => {
      setLive(l.data)
      setToday(t.data)
      setScorers(s.data)
      setStandings(st.data)
    }).finally(() => setLoading(false))
  }, [])

  const liveMatches  = live?.response?.slice(0, 6) ?? []
  const todayLeagues = today?.leagues?.slice(0, 4) ?? []
  const topScorers   = scorers?.response?.slice(0, 6) ?? []
  const table        = standings?.response?.[0]?.league?.standings?.[0]?.slice(0, 6) ?? []

  return (
    <div className="min-h-screen">
      <Topbar title="Dashboard" />

      <div className="px-6 pt-5 pb-8 space-y-6">

        {/* Hero stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <StatCard label="Live Right Now"    value={live?.results}          icon={Radio}        color="#22d47a" delay={0}    loading={loading} />
          <StatCard label="Today's Matches"   value={today?.total}           icon={CalendarDays} color="#a78bfa" delay={0.08} loading={loading} />
          <StatCard label="Active Leagues"    value={today?.leagues?.length} icon={Layers}       color="#f59e0b" delay={0.16} loading={loading} />
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>

          {/* ── Left col ── */}
          <div className="space-y-5">

            {/* Live matches */}
            {(loading || liveMatches.length > 0) && (
              <section>
                <SectionTitle to="/matches" icon={Radio} accent="#22d47a">
                  Live Matches
                </SectionTitle>
                <div className="space-y-2">
                  {loading
                    ? [0,1,2].map(i => <MatchCardSkeleton key={i} />)
                    : liveMatches.map((m, i) => (
                      <MatchCard key={m.fixture.id} fixture={m} index={i} />
                    ))
                  }
                </div>
              </section>
            )}

            {/* Today by league */}
            <section>
              <SectionTitle to="/matches" icon={CalendarDays} accent="#a78bfa">
                Today's Matches
              </SectionTitle>
              <div className="space-y-4">
                {loading
                  ? [0,1].map(i => (
                    <div key={i} className="glass p-4 space-y-3">
                      <Skeleton className="h-4 w-36" />
                      {[0,1,2].map(j => <MatchCardSkeleton key={j} />)}
                    </div>
                  ))
                  : todayLeagues.map(({ league, fixtures }) => (
                    <div
                      key={league.id}
                      className="rounded-2xl overflow-hidden"
                      style={{
                        background: 'rgba(16,16,42,0.7)',
                        border: '1px solid rgba(124,58,237,0.12)',
                      }}
                    >
                      {/* League header */}
                      <div
                        className="flex items-center gap-2.5 px-4 py-3"
                        style={{ borderBottom: '1px solid rgba(124,58,237,0.1)', background: 'rgba(124,58,237,0.06)' }}
                      >
                        <img src={league.logo} alt="" className="w-5 h-5 object-contain" />
                        <span className="text-sm font-bold text-white">{league.name}</span>
                        <span className="ml-auto text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                          {fixtures.length} matches
                        </span>
                      </div>
                      {/* Fixtures */}
                      <div className="p-3 space-y-2">
                        {fixtures.slice(0, 4).map((m, i) => (
                          <MatchCard key={m.fixture.id} fixture={m} index={i} />
                        ))}
                      </div>
                    </div>
                  ))
                }
              </div>
            </section>
          </div>

          {/* ── Right col ── */}
          <div className="space-y-5">

            {/* Top Scorers */}
            <section>
              <SectionTitle to="/players" icon={TrendingUp} accent="#f59e0b">
                Top Scorers · PL
              </SectionTitle>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(16,16,42,0.7)', border: '1px solid rgba(124,58,237,0.12)' }}
              >
                {loading
                  ? [0,1,2,3,4,5].map(i => <PlayerSkeleton key={i} />)
                  : topScorers.map((item, i) => (
                    <PlayerCard key={item.player.id} item={item} rank={i + 1} stat="goals" />
                  ))
                }
              </div>
            </section>

            {/* Standings */}
            <section>
              <SectionTitle to="/standings" icon={Trophy} accent="#a78bfa">
                Premier League
              </SectionTitle>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(16,16,42,0.7)', border: '1px solid rgba(124,58,237,0.12)' }}
              >
                {/* Header */}
                <div
                  className="grid text-xs text-slate-500 px-4 py-2.5 font-medium"
                  style={{
                    gridTemplateColumns: '1.4rem 1.6rem 1fr 1.8rem 2rem 2.4rem',
                    borderBottom: '1px solid rgba(124,58,237,0.1)',
                    background: 'rgba(124,58,237,0.05)',
                  }}
                >
                  <span>#</span>
                  <span />
                  <span>Club</span>
                  <span className="text-center">P</span>
                  <span className="text-center">GD</span>
                  <span className="text-center text-purple-400 font-bold">Pts</span>
                </div>

                {loading
                  ? [0,1,2,3,4,5].map(i => (
                    <div key={i} className="flex items-center gap-2.5 px-4 py-2.5">
                      <Skeleton className="h-3 w-4" />
                      <Skeleton className="w-6 h-6 rounded-full" />
                      <Skeleton className="h-3 flex-1" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  ))
                  : table.map((row, i) => (
                    <motion.div
                      key={row.team.id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="grid items-center px-4 py-2.5 hover:bg-white/5 transition cursor-pointer"
                      style={{
                        gridTemplateColumns: '1.4rem 1.6rem 1fr 1.8rem 2rem 2.4rem',
                        borderBottom: '1px solid rgba(124,58,237,0.06)',
                        borderLeft: i < 4 ? '2px solid rgba(124,58,237,0.5)' : '2px solid transparent',
                      }}
                    >
                      <span className="text-xs text-slate-500 font-bold">{row.rank}</span>
                      <img src={row.team.logo} alt="" className="w-5 h-5 object-contain" />
                      <span className="text-xs text-slate-200 truncate font-medium">{row.team.name}</span>
                      <span className="text-xs text-center text-slate-400">{row.all.played}</span>
                      <span className={`text-xs text-center font-medium ${
                        row.goalsDiff > 0 ? 'text-green-400' : row.goalsDiff < 0 ? 'text-red-400' : 'text-slate-500'
                      }`}>
                        {row.goalsDiff > 0 ? '+' : ''}{row.goalsDiff}
                      </span>
                      <span className="text-xs text-center font-bold text-white">{row.points}</span>
                    </motion.div>
                  ))
                }
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
