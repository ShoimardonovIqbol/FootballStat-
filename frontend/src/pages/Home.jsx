import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Radio, CalendarDays, Trophy, ChevronRight, TrendingUp, Layers } from 'lucide-react'
import { matchesAPI, playersAPI, standingsAPI } from '../services/api'
import MatchCard from '../components/ui/MatchCard'
import PlayerCard from '../components/ui/PlayerCard'
import { MatchCardSkeleton, PlayerSkeleton } from '../components/ui/Skeleton'
import Topbar from '../components/layout/Topbar'

const LEAGUE_ID = 39
const SEASON    = 2024

/* Animated number that counts up */
function AnimatedNumber({ value, loading }) {
  const mv      = useMotionValue(0)
  const spring  = useSpring(mv, { damping: 18, stiffness: 90 })
  const display = useTransform(spring, v => Math.round(v))

  useEffect(() => {
    if (!loading && value != null) mv.set(value)
  }, [value, loading, mv])

  if (loading) return (
    <div style={{ height: 36, width: 56, borderRadius: 8, background: 'rgba(255,255,255,0.06)' }}
      className="shimmer" />
  )
  return <motion.span>{display}</motion.span>
}

function SectionTitle({ children, to, icon: Icon, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {Icon && (
          <motion.div
            whileHover={{ scale: 1.15, rotate: 10 }}
            style={{
              width: 28, height: 28, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: (accent || '#7c3aed') + '22',
            }}
          >
            <Icon size={14} style={{ color: accent || '#a78bfa' }} />
          </motion.div>
        )}
        <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.03em', margin: 0 }}>
          {children}
        </h2>
      </div>
      {to && (
        <Link to={to} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#a78bfa', fontWeight: 500, textDecoration: 'none' }}>
          See all <ChevronRight size={11} />
        </Link>
      )}
    </div>
  )
}

const statVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
}
const statItem = {
  hidden: { opacity: 0, y: 32, scale: 0.9 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } }
}

function StatCard({ label, value, icon: Icon, color, loading }) {
  return (
    <motion.div
      variants={statItem}
      whileHover={{ scale: 1.03, y: -3 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      style={{
        position: 'relative', overflow: 'hidden',
        padding: '20px 22px', borderRadius: 16,
        background: 'rgba(16,16,42,0.75)',
        border: '1px solid rgba(124,58,237,0.15)',
        backdropFilter: 'blur(12px)',
        cursor: 'default',
      }}
    >
      <div style={{ position: 'absolute', top: -16, right: -16, width: 80, height: 80, borderRadius: '50%', filter: 'blur(24px)', opacity: 0.25, background: color, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
        <div>
          <p style={{ fontSize: 11, color: '#64748b', marginBottom: 8, fontWeight: 500 }}>{label}</p>
          <p style={{ fontSize: 30, fontWeight: 800, color: '#fff', margin: 0 }}>
            <AnimatedNumber value={value} loading={loading} />
          </p>
        </div>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: Math.random() }}
          style={{
            width: 40, height: 40, borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: color + '22', border: '1px solid ' + color + '44',
          }}
        >
          <Icon size={18} style={{ color }} />
        </motion.div>
      </div>
    </motion.div>
  )
}

const FORM_COLOR = { W: '#22d47a', D: '#f59e0b', L: '#f43f5e' }

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
      setLive(l.data);  setToday(t.data)
      setScorers(s.data); setStandings(st.data)
    }).finally(() => setLoading(false))
  }, [])

  const liveMatches  = live?.response?.slice(0, 6) ?? []
  const todayLeagues = today?.leagues?.slice(0, 4) ?? []
  const topScorers   = scorers?.response?.slice(0, 6) ?? []
  const table        = standings?.response?.[0]?.league?.standings?.[0]?.slice(0, 6) ?? []

  return (
    <div style={{ minHeight: '100vh' }}>
      <Topbar title="Dashboard" />

      <div style={{ padding: '20px 24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Hero stats row with stagger */}
        <motion.div
          variants={statVariants}
          initial="hidden"
          animate="show"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
        >
          <StatCard label="Live Right Now"  value={live?.results}          icon={Radio}        color="#22d47a" loading={loading} />
          <StatCard label="Today's Matches" value={today?.total}           icon={CalendarDays} color="#a78bfa" loading={loading} />
          <StatCard label="Active Leagues"  value={today?.leagues?.length} icon={Layers}       color="#f59e0b" loading={loading} />
        </motion.div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>

          {/* Left col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {(loading || liveMatches.length > 0) && (
              <section>
                <SectionTitle to="/matches" icon={Radio} accent="#22d47a">Live Matches</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {loading
                    ? [0,1,2].map(i => <MatchCardSkeleton key={i} />)
                    : liveMatches.map((m, i) => <MatchCard key={m.fixture.id} fixture={m} index={i} />)
                  }
                </div>
              </section>
            )}

            <section>
              <SectionTitle to="/matches" icon={CalendarDays} accent="#a78bfa">Today's Matches</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {loading
                  ? [0,1].map(i => (
                    <div key={i} style={{ padding: 16, borderRadius: 16, background: 'rgba(16,16,42,0.7)', border: '1px solid rgba(124,58,237,0.12)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ height: 16, width: 140, borderRadius: 6, background: 'rgba(255,255,255,0.06)' }} />
                      {[0,1,2].map(j => <MatchCardSkeleton key={j} />)}
                    </div>
                  ))
                  : todayLeagues.map(({ league, fixtures }, gi) => (
                    <motion.div
                      key={league.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: gi * 0.12, type: 'spring', stiffness: 240, damping: 22 }}
                      style={{ borderRadius: 16, overflow: 'hidden', background: 'rgba(16,16,42,0.7)', border: '1px solid rgba(124,58,237,0.12)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid rgba(124,58,237,0.1)', background: 'rgba(124,58,237,0.06)' }}>
                        <img src={league.logo} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{league.name}</span>
                        <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: '#a78bfa', background: 'rgba(124,58,237,0.12)', padding: '2px 8px', borderRadius: 999 }}>
                          {fixtures.length} matches
                        </span>
                      </div>
                      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {fixtures.slice(0, 4).map((m, i) => <MatchCard key={m.fixture.id} fixture={m} index={i} />)}
                      </div>
                    </motion.div>
                  ))
                }
              </div>
            </section>
          </div>

          {/* Right col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            <section>
              <SectionTitle to="/players" icon={TrendingUp} accent="#f59e0b">Top Scorers · PL</SectionTitle>
              <div style={{ borderRadius: 16, overflow: 'hidden', background: 'rgba(16,16,42,0.7)', border: '1px solid rgba(124,58,237,0.12)' }}>
                {loading
                  ? [0,1,2,3,4,5].map(i => <PlayerSkeleton key={i} />)
                  : topScorers.map((item, i) => <PlayerCard key={item.player.id} item={item} rank={i + 1} stat="goals" />)
                }
              </div>
            </section>

            <section>
              <SectionTitle to="/standings" icon={Trophy} accent="#a78bfa">Premier League</SectionTitle>
              <div style={{ borderRadius: 16, overflow: 'hidden', background: 'rgba(16,16,42,0.7)', border: '1px solid rgba(124,58,237,0.12)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.4rem 1.6rem 1fr 1.8rem 2rem 2.4rem', padding: '10px 16px', fontSize: 11, color: '#64748b', fontWeight: 600, borderBottom: '1px solid rgba(124,58,237,0.1)', background: 'rgba(124,58,237,0.05)' }}>
                  <span>#</span><span /><span>Club</span>
                  <span style={{ textAlign: 'center' }}>P</span>
                  <span style={{ textAlign: 'center' }}>GD</span>
                  <span style={{ textAlign: 'center', color: '#a78bfa', fontWeight: 700 }}>Pts</span>
                </div>

                {loading
                  ? [0,1,2,3,4,5].map(i => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px' }}>
                      <div style={{ height: 12, width: 16, borderRadius: 4 }} className="shimmer" />
                      <div style={{ width: 24, height: 24, borderRadius: '50%' }} className="shimmer" />
                      <div style={{ height: 12, flex: 1, borderRadius: 4 }} className="shimmer" />
                      <div style={{ height: 12, width: 48, borderRadius: 4 }} className="shimmer" />
                    </div>
                  ))
                  : table.map((row, i) => (
                    <motion.div
                      key={row.team.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, type: 'spring', stiffness: 260, damping: 22 }}
                      whileHover={{ background: 'rgba(255,255,255,0.03)' }}
                      style={{
                        display: 'grid', gridTemplateColumns: '1.4rem 1.6rem 1fr 1.8rem 2rem 2.4rem',
                        alignItems: 'center', padding: '10px 16px',
                        borderBottom: '1px solid rgba(124,58,237,0.06)',
                        borderLeft: i < 4 ? '2px solid rgba(124,58,237,0.5)' : '2px solid transparent',
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>{row.rank}</span>
                      <img src={row.team.logo} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
                      <span style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {row.team.name}
                      </span>
                      <span style={{ fontSize: 11, textAlign: 'center', color: '#94a3b8' }}>{row.all.played}</span>
                      <span style={{ fontSize: 11, textAlign: 'center', fontWeight: 600, color: row.goalsDiff > 0 ? '#22d47a' : row.goalsDiff < 0 ? '#f43f5e' : '#64748b' }}>
                        {row.goalsDiff > 0 ? '+' : ''}{row.goalsDiff}
                      </span>
                      <span style={{ fontSize: 12, textAlign: 'center', fontWeight: 800, color: '#fff' }}>{row.points}</span>
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
