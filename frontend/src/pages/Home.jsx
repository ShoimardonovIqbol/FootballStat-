import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { matchesAPI, playersAPI, standingsAPI } from '../services/api'
import MatchCard from '../components/ui/MatchCard'
import PlayerCard from '../components/ui/PlayerCard'
import { MatchCardSkeleton, PlayerSkeleton, Skeleton } from '../components/ui/Skeleton'
import Topbar from '../components/layout/Topbar'

const LEAGUE_ID = 39
const SEASON = 2024

function SectionTitle({ children, to }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-sm font-bold text-white uppercase tracking-widest">{children}</h2>
      {to && (
        <Link to={to} className="text-xs text-purple-400 hover:text-purple-300 transition">
          See all →
        </Link>
      )}
    </div>
  )
}

export default function Home() {
  const [live, setLive]         = useState(null)
  const [today, setToday]       = useState(null)
  const [scorers, setScorers]   = useState(null)
  const [standings, setStandings] = useState(null)
  const [loading, setLoading]   = useState(true)

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

  const liveMatches  = live?.response?.slice(0, 4) ?? []
  const todayLeagues = today?.leagues?.slice(0, 3) ?? []
  const topScorers   = scorers?.response?.slice(0, 5) ?? []
  const table        = standings?.response?.[0]?.league?.standings?.[0]?.slice(0, 5) ?? []

  return (
    <div>
      <Topbar title="Dashboard" />

      {/* Hero stats */}
      <div className="px-8 pt-6 pb-4 grid grid-cols-3 gap-4">
        {[
          { label: 'Live Now',    value: live?.results ?? '—', icon: '🔴', color: '#22d47a' },
          { label: "Today's Matches", value: today?.total ?? '—', icon: '🏟️', color: '#a78bfa' },
          { label: 'Leagues',     value: today?.leagues?.length ?? '—', icon: '🏆', color: '#f59e0b' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{s.icon}</span>
              <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">
              {loading ? <Skeleton className="h-7 w-16" /> : s.value}
            </p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main grid */}
      <div className="px-8 pb-8 grid grid-cols-3 gap-6">

        {/* Left: Live + Today */}
        <div className="col-span-2 space-y-6">

          {/* Live matches */}
          {liveMatches.length > 0 && (
            <section>
              <SectionTitle to="/matches">🔴 Live Matches</SectionTitle>
              <div className="space-y-3">
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
            <SectionTitle to="/matches">📅 Today's Matches</SectionTitle>
            <div className="space-y-5">
              {loading
                ? [0,1].map(i => (
                  <div key={i} className="glass p-4 space-y-3">
                    <Skeleton className="h-4 w-32" />
                    {[0,1].map(j => <MatchCardSkeleton key={j} />)}
                  </div>
                ))
                : todayLeagues.map(({ league, fixtures }) => (
                  <div key={league.id} className="glass p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <img src={league.logo} alt="" className="w-5 h-5 object-contain" />
                      <span className="text-sm font-semibold text-white">{league.name}</span>
                      <span className="text-xs text-slate-500 ml-auto">{league.round}</span>
                    </div>
                    <div className="space-y-2">
                      {fixtures.slice(0, 3).map((m, i) => (
                        <MatchCard key={m.fixture.id} fixture={m} index={i} />
                      ))}
                    </div>
                  </div>
                ))
              }
            </div>
          </section>
        </div>

        {/* Right: Top Scorers + Standings */}
        <div className="space-y-6">

          {/* Top Scorers */}
          <section>
            <SectionTitle to="/players">⚽ Top Scorers</SectionTitle>
            <div className="glass">
              {loading
                ? [0,1,2,3,4].map(i => <PlayerSkeleton key={i} />)
                : topScorers.map((item, i) => (
                  <PlayerCard key={item.player.id} item={item} rank={i + 1} stat="goals" />
                ))
              }
            </div>
          </section>

          {/* Mini Standings */}
          <section>
            <SectionTitle to="/standings">📊 PL Standings</SectionTitle>
            <div className="glass overflow-hidden">
              <div className="flex text-xs text-slate-500 px-4 py-2 border-b"
                style={{ borderColor: 'rgba(124,58,237,0.1)' }}>
                <span className="w-6">#</span>
                <span className="flex-1">Team</span>
                <span className="w-6 text-center">P</span>
                <span className="w-6 text-center">GD</span>
                <span className="w-8 text-center font-bold text-purple-400">Pts</span>
              </div>
              {loading
                ? [0,1,2,3,4].map(i => (
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                    <Skeleton className="h-3 w-4" />
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="h-3 flex-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))
                : table.map((row, i) => (
                  <motion.div
                    key={row.team.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/5 transition"
                    style={{ borderBottom: '1px solid rgba(124,58,237,0.06)' }}
                  >
                    <span className="w-5 text-xs text-slate-500 font-bold">{row.rank}</span>
                    <img src={row.team.logo} alt="" className="w-5 h-5 object-contain" />
                    <span className="flex-1 text-xs text-slate-200 truncate">{row.team.name}</span>
                    <span className="w-6 text-xs text-center text-slate-400">{row.all.played}</span>
                    <span className="w-6 text-xs text-center text-slate-400">{row.goalsDiff > 0 ? '+' : ''}{row.goalsDiff}</span>
                    <span className="w-8 text-xs text-center font-bold text-purple-300">{row.points}</span>
                  </motion.div>
                ))
              }
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
