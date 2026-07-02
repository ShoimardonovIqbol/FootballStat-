import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { Link } from 'react-router-dom'
import {
  Radio, CalendarDays, Trophy, ChevronRight,
  TrendingUp, Zap, Users, Activity
} from 'lucide-react'
import { matchesAPI, playersAPI, standingsAPI } from '../services/api'
import MatchCard from '../components/ui/MatchCard'
import { MatchCardSkeleton } from '../components/ui/Skeleton'
import Topbar from '../components/layout/Topbar'

const LEAGUE_ID = 39
const SEASON    = 2024

const WC_SCORERS = [
  { name: 'K. Mbappé',   team: 'France',    photo: 'https://media.api-sports.io/football/players/278.png',  goals: 6 },
  { name: 'L. Messi',    team: 'Argentina', photo: 'https://media.api-sports.io/football/players/154.png',  goals: 6 },
  { name: 'E. Haaland',  team: 'Norway',    photo: 'https://media.api-sports.io/football/players/1100.png', goals: 5 },
  { name: 'Vinicius Jr', team: 'Brazil',    photo: 'https://media.api-sports.io/football/players/762.png',  goals: 4 },
  { name: 'O. Dembélé',  team: 'France',    photo: 'https://media.api-sports.io/football/players/283.png',  goals: 4 },
]

const WC_LIVE = []
const WC_REST = [
  { hN: 'Ivory Coast', hF: 'ci',     aN: 'Norway',    aF: 'no', hs: 1, as: 2, time: 'FT',    done: true  },
  { hN: 'France',      hF: 'fr',     aN: 'Sweden',    aF: 'se', hs: 3, as: 0, time: 'FT',    done: true  },
  { hN: 'Mexico',      hF: 'mx',     aN: 'Ecuador',   aF: 'ec', hs: 2, as: 0, time: 'FT',    done: true  },
  { hN: 'England',     hF: 'gb-eng', aN: 'DR Congo',  aF: 'cd', hs: 0, as: 0, time: '21:00', done: false },
  { hN: 'Belgium',     hF: 'be',     aN: 'Senegal',   aF: 'sn', hs: 0, as: 0, time: '01:00', done: false },
  { hN: 'USA',         hF: 'us',     aN: 'Bosnia',    aF: 'ba', hs: 0, as: 0, time: '05:00', done: false },
]

/* ── count-up ── */
function Num({ value, loading }) {
  const mv = useMotionValue(0)
  const sp = useSpring(mv, { damping: 18, stiffness: 90 })
  const d  = useTransform(sp, v => Math.round(v))
  useEffect(() => { if (!loading && value != null) mv.set(value) }, [value, loading, mv])
  if (loading) return <span style={{ display:'inline-block', width:44, height:36, borderRadius:6, verticalAlign:'middle' }} className="shimmer" />
  return <motion.span>{d}</motion.span>
}

/* ── Stat card — minimal FotMob style ── */
function StatCard({ icon: Icon, label, value, loading, link, delay }) {
  return (
    <motion.div
      initial={{ opacity:0, y:10 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay, duration:0.3 }}
      style={{
        flex: 1, minWidth: 0,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '18px 20px',
      }}
    >
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          <Icon size={13} color="var(--text-3)" />
          <span style={{ fontSize:11, color:'var(--text-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</span>
        </div>
        <Link to={link || '/'} style={{ fontSize:11, color:'var(--text-3)', textDecoration:'none', display:'flex', alignItems:'center', gap:2 }}
          onMouseEnter={e => e.currentTarget.style.color='#fff'}
          onMouseLeave={e => e.currentTarget.style.color='var(--text-3)'}
        >
          View All <ChevronRight size={10} />
        </Link>
      </div>
      <p style={{ fontSize:34, fontWeight:800, color:'var(--text-1)', margin:0, lineHeight:1, letterSpacing:'-1px' }}>
        <Num value={value} loading={loading} />
      </p>
    </motion.div>
  )
}

/* ── WC match row ── */
function WCRow({ m, isLive }) {
  const flag = cc => `https://flagcdn.com/w40/${cc}.png`
  const scored = isLive || m?.done
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
      <div style={{ width:36, flexShrink:0, textAlign:'center' }}>
        {isLive
          ? <span style={{ fontSize:10, fontWeight:800, color:'#22d47a', background:'rgba(34,212,122,0.1)', padding:'2px 5px', borderRadius:5 }}>{m.min}</span>
          : <span style={{ fontSize:10, fontWeight:600, color:'var(--text-3)' }}>{m.done ? 'FT' : m.time}</span>
        }
      </div>
      <img src={flag(m.hF)} alt="" style={{ width:20, height:13, objectFit:'cover', borderRadius:2, flexShrink:0 }} />
      <span style={{ fontSize:12, fontWeight:600, color:'var(--text-1)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.hN}</span>
      <span style={{
        fontSize:12, fontWeight:900, flexShrink:0,
        color: isLive ? '#22d47a' : (scored ? 'var(--text-1)' : 'var(--text-3)'),
        minWidth:32, textAlign:'center',
        background: isLive ? 'rgba(34,212,122,0.08)' : 'transparent',
        padding:'2px 6px', borderRadius:6,
      }}>{scored ? `${m.hs}–${m.as}` : 'vs'}</span>
      <span style={{ fontSize:12, fontWeight:600, color:'var(--text-1)', flex:1, textAlign:'right', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.aN}</span>
      <img src={flag(m.aF)} alt="" style={{ width:20, height:13, objectFit:'cover', borderRadius:2, flexShrink:0 }} />
    </div>
  )
}

/* ── WC Scorer row ── */
function WCPlayerRow({ item, rank }) {
  const rc = ['#f59e0b', '#94a3b8', '#cd7f32']
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
      <span style={{ width:18, fontSize:11, fontWeight:800, flexShrink:0, color:rank<=3 ? rc[rank-1] : 'var(--text-3)' }}>{rank}</span>
      <img
        src={item.photo} alt=""
        style={{ width:34, height:34, borderRadius:'50%', objectFit:'cover', flexShrink:0, border:`2px solid ${rank<=3 ? rc[rank-1] : 'rgba(255,255,255,0.08)'}` }}
        onError={e => { e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=222228&color=fff&size=34` }}
      />
      <div style={{ flex:1, overflow:'hidden' }}>
        <p style={{ fontSize:12, fontWeight:600, color:'var(--text-1)', margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.name}</p>
        <p style={{ fontSize:10, color:'var(--text-3)', margin:0 }}>{item.team}</p>
      </div>
      <div style={{
        width:34, height:34, borderRadius:10, flexShrink:0,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:14, fontWeight:900, color:'#fff',
        background:'linear-gradient(135deg,#f59e0b,#d97706)',
      }}>{item.goals}</div>
    </div>
  )
}

/* ── Player row ── */
function PlayerRow({ item, rank, statKey }) {
  const stats = item?.statistics?.[0]
  const val   = statKey === 'goals' ? stats?.goals?.total : stats?.goals?.assists
  const rc    = ['#f59e0b','#94a3b8','#cd7f32']
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
      <span style={{ width:18, fontSize:11, fontWeight:800, flexShrink:0, color:rank<=3 ? rc[rank-1] : 'var(--text-3)' }}>{rank}</span>
      <img
        src={item?.player?.photo} alt=""
        style={{ width:34, height:34, borderRadius:'50%', objectFit:'cover', flexShrink:0, border:`2px solid ${rank<=3 ? rc[rank-1] : 'rgba(255,255,255,0.08)'}` }}
        onError={e => { e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(item?.player?.name||'?')}&background=222228&color=fff&size=34` }}
      />
      <div style={{ flex:1, overflow:'hidden' }}>
        <p style={{ fontSize:12, fontWeight:600, color:'var(--text-1)', margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item?.player?.name}</p>
        <p style={{ fontSize:10, color:'var(--text-3)', margin:0 }}>{stats?.team?.name}</p>
      </div>
      <div style={{
        width:34, height:34, borderRadius:10, flexShrink:0,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:14, fontWeight:900, color:'#fff',
        background: 'rgba(255,255,255,0.1)',
      }}>{val ?? 0}</div>
    </div>
  )
}

export default function Home() {
  const [live,      setLive]      = useState(null)
  const [today,     setToday]     = useState(null)
  const [scorers,   setScorers]   = useState(null)
  const [standings, setStandings] = useState(null)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    const safe = p => p.then(r => r.data).catch(() => null)
    Promise.all([
      safe(matchesAPI.getLive()),
      safe(matchesAPI.getToday()),
      safe(playersAPI.getTopScorers(LEAGUE_ID, SEASON)),
      safe(standingsAPI.get(LEAGUE_ID, SEASON)),
    ]).then(([l, t, s, st]) => {
      setLive(l); setToday(t); setScorers(s); setStandings(st)
    }).finally(() => setLoading(false))
  }, [])

  const liveMatches = live?.response?.slice(0,6)   ?? []
  const todayLeagues= today?.leagues?.slice(0,3)    ?? []
  const topScorers  = scorers?.response?.slice(0,6) ?? []
  const table       = standings?.response?.[0]?.league?.standings?.[0]?.slice(0,6) ?? []
  const liveCount   = live?.results   ?? WC_LIVE.length
  const todayCount  = today?.total    ?? (WC_LIVE.length + WC_REST.length)
  const leagueCount = today?.leagues?.length ?? 8

  return (
    <div>
      <Topbar title="Dashboard" />

      <div style={{ padding:'20px 24px 48px', display:'flex', flexDirection:'column', gap:20 }}>

        {/* ══ STAT CARDS (4 col) ══ */}
        <div style={{ display:'flex', gap:14 }}>
          <StatCard icon={Radio}        label="Live Matches"   value={liveCount}              loading={loading} link="/matches"   delay={0}    />
          <StatCard icon={CalendarDays} label="Today's Games"  value={todayCount}             loading={loading} link="/matches"   delay={0.05} />
          <StatCard icon={Trophy}       label="Active Leagues" value={leagueCount}            loading={loading} link="/leagues"   delay={0.1}  />
          <StatCard icon={Users}        label="PL Top Scorers" value={topScorers.length || 20} loading={loading} link="/players"  delay={0.15} />
        </div>

        {/* ══ MAIN CONTENT (2 col) ══ */}
        <div style={{ display:'flex', gap:16 }}>

          {/* ── LEFT ── */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', gap:16, minWidth:0 }}>

            {/* Live & Today */}
            <motion.div
              initial={{ opacity:0, y:14 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.22, type:'spring', stiffness:260, damping:22 }}
              style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}
            >
              {/* Header */}
              <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:32, height:32, borderRadius:9, background:'rgba(34,212,122,0.12)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Zap size={15} color="#22d47a" />
                  </div>
                  <span style={{ fontSize:14, fontWeight:800, color:'var(--text-1)' }}>Live & Today</span>
                  {liveCount > 0 && (
                    <span style={{ padding:'3px 9px', borderRadius:99, background:'rgba(34,212,122,0.1)', border:'1px solid rgba(34,212,122,0.25)', fontSize:10, fontWeight:800, color:'#22d47a' }}>
                      {liveCount} LIVE
                    </span>
                  )}
                </div>
                <Link to="/matches" style={{ fontSize:11, fontWeight:700, color:'var(--text-2)', textDecoration:'none', display:'flex', alignItems:'center', gap:3 }}>
                  View All <ChevronRight size={11} />
                </Link>
              </div>

              {/* Match list */}
              <div style={{ padding:'4px 8px 8px' }}>
                {loading
                  ? [0,1,2,3,4].map(i => <MatchCardSkeleton key={i} />)
                  : liveMatches.length > 0
                  ? liveMatches.map((m,i) => <MatchCard key={m.fixture.id} fixture={m} index={i} />)
                  : todayLeagues.length > 0
                  ? todayLeagues.map(({ league, fixtures }) => (
                    <div key={league.id}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 8px 6px' }}>
                        <img src={league.logo} alt="" style={{ width:15, height:15, objectFit:'contain' }} />
                        <span style={{ fontSize:11, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{league.name}</span>
                      </div>
                      {fixtures.slice(0,4).map((m,i) => <MatchCard key={m.fixture.id} fixture={m} index={i} />)}
                    </div>
                  ))
                  : (
                    <div style={{ padding:'40px 0', textAlign:'center' }}>
                      <Activity size={28} color="var(--text-4)" style={{ margin:'0 auto 12px', display:'block' }} />
                      <p style={{ color:'var(--text-3)', fontSize:13, margin:0, fontWeight:700 }}>No matches right now</p>
                      <p style={{ color:'var(--text-4)', fontSize:11, margin:'6px 0 0' }}>API resets at 03:00 AM Tajikistan time</p>
                    </div>
                  )
                }
              </div>
            </motion.div>

            {/* PL Standings */}
            <motion.div
              initial={{ opacity:0, y:14 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.3, type:'spring', stiffness:260, damping:22 }}
              style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}
            >
              <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:32, height:32, borderRadius:9, background:'rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Trophy size={15} color="var(--text-2)" />
                  </div>
                  <span style={{ fontSize:14, fontWeight:800, color:'var(--text-1)' }}>Premier League</span>
                </div>
                <Link to="/standings" style={{ fontSize:11, fontWeight:700, color:'var(--text-2)', textDecoration:'none', display:'flex', alignItems:'center', gap:3 }}>
                  Full Table <ChevronRight size={11} />
                </Link>
              </div>
              {/* Table */}
              <div style={{ padding:'0 8px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'24px 28px 1fr 28px 28px 36px', padding:'8px 12px', fontSize:10, color:'var(--text-3)', fontWeight:700, letterSpacing:'0.04em', textTransform:'uppercase', borderBottom:'1px solid var(--border)' }}>
                  <span>#</span><span /><span>Club</span>
                  <span style={{ textAlign:'center' }}>P</span>
                  <span style={{ textAlign:'center' }}>GD</span>
                  <span style={{ textAlign:'center', color:'var(--text-3)' }}>Pts</span>
                </div>
                {loading
                  ? [0,1,2,3,4,5].map(i => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderBottom:'1px solid var(--border)' }}>
                      <div style={{ width:14, height:10, borderRadius:3 }} className="shimmer" />
                      <div style={{ width:24, height:24, borderRadius:'50%' }} className="shimmer" />
                      <div style={{ flex:1, height:11, borderRadius:3 }} className="shimmer" />
                      <div style={{ width:52, height:11, borderRadius:3 }} className="shimmer" />
                    </div>
                  ))
                  : table.length === 0
                  ? <p style={{ padding:'24px', textAlign:'center', color:'var(--text-3)', fontSize:12, margin:0 }}>Resets at 03:00 AM</p>
                  : table.map((row, i) => (
                    <div key={row.team.id}
                      style={{ display:'grid', gridTemplateColumns:'24px 28px 1fr 28px 28px 36px', alignItems:'center', padding:'10px 12px', borderBottom:'1px solid var(--border)', borderLeft:`3px solid ${i<4 ? '#3fca7a' : 'transparent'}`, cursor:'pointer', transition:'background 0.13s' }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.03)' }}
                      onMouseLeave={e => { e.currentTarget.style.background='transparent' }}
                    >
                      <span style={{ fontSize:11, fontWeight:700, color:i<4 ? '#3fca7a' : 'var(--text-3)' }}>{row.rank}</span>
                      <img src={row.team.logo} alt="" style={{ width:22, height:22, objectFit:'contain' }} />
                      <span style={{ fontSize:12, color:'var(--text-1)', fontWeight:i<4 ? 700 : 400, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{row.team.name}</span>
                      <span style={{ fontSize:11, textAlign:'center', color:'var(--text-3)' }}>{row.all.played}</span>
                      <span style={{ fontSize:11, textAlign:'center', fontWeight:600, color:row.goalsDiff>0?'#22d47a':row.goalsDiff<0?'#f43f5e':'var(--text-3)' }}>
                        {row.goalsDiff>0?'+':''}{row.goalsDiff}
                      </span>
                      <span style={{ fontSize:15, textAlign:'center', fontWeight:900, color:'var(--text-1)' }}>{row.points}</span>
                    </div>
                  ))
                }
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT ── */}
          <div style={{ width:340, flexShrink:0, display:'flex', flexDirection:'column', gap:16 }}>

            {/* WC 2026 */}
            <motion.div
              initial={{ opacity:0, x:14 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:0.24, type:'spring', stiffness:260, damping:22 }}
              style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}
            >
              <div style={{ padding:'16px 18px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                  <div style={{ width:32, height:32, borderRadius:9, background:'rgba(245,158,11,0.12)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Trophy size={15} color="#f59e0b" />
                  </div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:800, color:'var(--text-1)', margin:0 }}>World Cup 2026</p>
                    <p style={{ fontSize:10, color:'var(--text-3)', margin:0 }}>{new Date().toLocaleDateString('en-US',{ month:'short', day:'numeric' })}</p>
                  </div>
                </div>
                <Link to="/worldcup" style={{ fontSize:11, fontWeight:700, color:'var(--text-2)', textDecoration:'none', display:'flex', alignItems:'center', gap:2 }}>
                  All <ChevronRight size={11} />
                </Link>
              </div>
              <div style={{ padding:'4px 14px 10px' }}>
                {WC_LIVE.length > 0 && (
                  <>
                    <div style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 0 6px' }}>
                      <span style={{ width:6, height:6, borderRadius:'50%', background:'#22d47a', display:'inline-block' }} />
                      <span style={{ fontSize:10, fontWeight:800, color:'#22d47a', letterSpacing:'0.07em' }}>LIVE NOW</span>
                    </div>
                    {WC_LIVE.map((m,i) => <WCRow key={i} m={m} isLive={true} />)}
                  </>
                )}
                <p style={{ fontSize:10, fontWeight:700, color:'var(--text-3)', letterSpacing:'0.06em', textTransform:'uppercase', margin:'12px 0 4px' }}>1/16 Finals</p>
                {WC_REST.map((m,i) => <WCRow key={i} m={m} isLive={false} />)}
              </div>
            </motion.div>

            {/* Top Goals WC 2026 */}
            <motion.div
              initial={{ opacity:0, x:14 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:0.32, type:'spring', stiffness:260, damping:22 }}
              style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}
            >
              <div style={{ padding:'16px 18px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                  <div style={{ width:32, height:32, borderRadius:9, background:'rgba(245,158,11,0.12)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <TrendingUp size={15} color="#f59e0b" />
                  </div>
                  <span style={{ fontSize:13, fontWeight:800, color:'var(--text-1)' }}>Top Goals · WC 2026</span>
                </div>
                <Link to="/worldcup" style={{ fontSize:11, fontWeight:700, color:'var(--text-2)', textDecoration:'none', display:'flex', alignItems:'center', gap:2 }}>
                  All <ChevronRight size={11} />
                </Link>
              </div>
              <div style={{ padding:'4px 14px 8px' }}>
                {WC_SCORERS.map((item, i) => <WCPlayerRow key={item.name} item={item} rank={i+1} />)}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
}
