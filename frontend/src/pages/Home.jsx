import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import {
  Radio, CalendarDays, Trophy, ChevronRight,
  TrendingUp, Goal, Footprints, Zap, Users, Activity
} from 'lucide-react'
import { matchesAPI, playersAPI, standingsAPI } from '../services/api'
import MatchCard from '../components/ui/MatchCard'
import { MatchCardSkeleton } from '../components/ui/Skeleton'
import Topbar from '../components/layout/Topbar'

const LEAGUE_ID = 39
const SEASON    = 2024

const WC_LIVE = [
  { hN: 'Portugal',  hF: 'pt', aN: 'Uzbekistan', aF: 'uz', hs: 5, as: 0, min: "67'" },
  { hN: 'France',    hF: 'fr', aN: 'Germany',    aF: 'de', hs: 2, as: 1, min: "45'" },
  { hN: 'Brazil',    hF: 'br', aN: 'Argentina',  aF: 'ar', hs: 1, as: 2, min: "82'" },
]
const WC_REST = [
  { hN: 'Senegal',   hF: 'sn', aN: 'Iraq',    aF: 'iq', hs: 0, as: 0, time: 'FT',    done: true  },
  { hN: 'Uruguay',   hF: 'uy', aN: 'Spain',   aF: 'es', hs: 0, as: 2, time: 'FT',    done: true  },
  { hN: 'Egypt',     hF: 'eg', aN: 'Iran',    aF: 'ir', hs: 2, as: 0, time: 'FT',    done: true  },
  { hN: 'Turkey',    hF: 'tr', aN: 'USA',     aF: 'us', hs: 0, as: 0, time: '16:00', done: false },
  { hN: 'Italy',     hF: 'it', aN: 'Mexico',  aF: 'mx', hs: 0, as: 0, time: '18:00', done: false },
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

/* ── Stat card (CUBIC style) ── */
function StatCard({ icon: Icon, iconBg, label, value, sub, loading, link, delay }) {
  return (
    <motion.div
      initial={{ opacity:0, y:14 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay, type:'spring', stiffness:300, damping:26 }}
      style={{
        flex: 1,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '20px 20px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        minWidth: 0,
      }}
    >
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div style={{ width:46, height:46, borderRadius:12, background:iconBg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon size={21} color="#fff" />
        </div>
        <Link to={link || '/'} style={{ fontSize:11, fontWeight:700, color:'#7c3aed', textDecoration:'none', display:'flex', alignItems:'center', gap:2 }}>
          View All <ChevronRight size={11} />
        </Link>
      </div>
      <div>
        <p style={{ fontSize:11, color:'var(--text-3)', margin:'0 0 4px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</p>
        <p style={{ fontSize:36, fontWeight:900, color:'var(--text-1)', margin:0, lineHeight:1 }}>
          <Num value={value} loading={loading} />
        </p>
        {sub && <p style={{ fontSize:11, color:'var(--text-3)', margin:'5px 0 0' }}>{sub}</p>}
      </div>
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
        background: statKey==='goals'
          ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
          : 'linear-gradient(135deg,#f59e0b,#ea580c)',
      }}>{val ?? 0}</div>
    </div>
  )
}

export default function Home() {
  const [live,      setLive]      = useState(null)
  const [today,     setToday]     = useState(null)
  const [scorers,   setScorers]   = useState(null)
  const [assists,   setAssists]   = useState(null)
  const [standings, setStandings] = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [playerTab, setPlayerTab] = useState('goals')

  useEffect(() => {
    const safe = p => p.then(r => r.data).catch(() => null)
    Promise.all([
      safe(matchesAPI.getLive()),
      safe(matchesAPI.getToday()),
      safe(playersAPI.getTopScorers(LEAGUE_ID, SEASON)),
      safe(playersAPI.getTopAssists(LEAGUE_ID, SEASON)),
      safe(standingsAPI.get(LEAGUE_ID, SEASON)),
    ]).then(([l, t, s, a, st]) => {
      setLive(l); setToday(t); setScorers(s); setAssists(a); setStandings(st)
    }).finally(() => setLoading(false))
  }, [])

  const liveMatches = live?.response?.slice(0,6)   ?? []
  const todayLeagues= today?.leagues?.slice(0,3)    ?? []
  const topScorers  = scorers?.response?.slice(0,6) ?? []
  const topAssists  = assists?.response?.slice(0,6) ?? []
  const table       = standings?.response?.[0]?.league?.standings?.[0]?.slice(0,6) ?? []
  const liveCount   = live?.results   ?? WC_LIVE.length
  const todayCount  = today?.total    ?? (WC_LIVE.length + WC_REST.length)
  const leagueCount = today?.leagues?.length ?? 8
  const playerData  = playerTab === 'goals' ? topScorers : topAssists

  return (
    <div>
      <Topbar title="Dashboard" />

      <div style={{ padding:'20px 24px 48px', display:'flex', flexDirection:'column', gap:20 }}>

        {/* ══ STAT CARDS (4 col) ══ */}
        <div style={{ display:'flex', gap:14 }}>
          <StatCard icon={Radio}        iconBg="linear-gradient(135deg,#22d47a,#16a34a)" label="Live Matches"   value={liveCount}   loading={loading} link="/matches"   delay={0}    />
          <StatCard icon={CalendarDays} iconBg="linear-gradient(135deg,#7c3aed,#4f46e5)" label="Today's Games"  value={todayCount}  loading={loading} link="/matches"   delay={0.06} />
          <StatCard icon={Trophy}       iconBg="linear-gradient(135deg,#f59e0b,#d97706)" label="Active Leagues" value={leagueCount} loading={loading} link="/leagues"   delay={0.12} />
          <StatCard icon={Users}        iconBg="linear-gradient(135deg,#3b82f6,#1d4ed8)" label="PL Top Scorers" value={topScorers.length || 20} loading={loading} link="/players" delay={0.18} />
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
                <Link to="/matches" style={{ fontSize:11, fontWeight:700, color:'#7c3aed', textDecoration:'none', display:'flex', alignItems:'center', gap:3 }}>
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
                  <div style={{ width:32, height:32, borderRadius:9, background:'rgba(124,58,237,0.12)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Trophy size={15} color="#a78bfa" />
                  </div>
                  <span style={{ fontSize:14, fontWeight:800, color:'var(--text-1)' }}>Premier League</span>
                </div>
                <Link to="/standings" style={{ fontSize:11, fontWeight:700, color:'#7c3aed', textDecoration:'none', display:'flex', alignItems:'center', gap:3 }}>
                  Full Table <ChevronRight size={11} />
                </Link>
              </div>
              {/* Table */}
              <div style={{ padding:'0 8px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'24px 28px 1fr 28px 28px 36px', padding:'8px 12px', fontSize:10, color:'var(--text-3)', fontWeight:700, letterSpacing:'0.04em', textTransform:'uppercase', borderBottom:'1px solid var(--border)' }}>
                  <span>#</span><span /><span>Club</span>
                  <span style={{ textAlign:'center' }}>P</span>
                  <span style={{ textAlign:'center' }}>GD</span>
                  <span style={{ textAlign:'center', color:'#a78bfa' }}>Pts</span>
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
                      style={{ display:'grid', gridTemplateColumns:'24px 28px 1fr 28px 28px 36px', alignItems:'center', padding:'10px 12px', borderBottom:'1px solid var(--border)', borderLeft:`3px solid ${i<4 ? '#7c3aed' : 'transparent'}`, cursor:'pointer', transition:'background 0.13s' }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.03)' }}
                      onMouseLeave={e => { e.currentTarget.style.background='transparent' }}
                    >
                      <span style={{ fontSize:11, fontWeight:700, color:i<4 ? '#a78bfa' : 'var(--text-3)' }}>{row.rank}</span>
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
                <Link to="/worldcup" style={{ fontSize:11, fontWeight:700, color:'#7c3aed', textDecoration:'none', display:'flex', alignItems:'center', gap:2 }}>
                  All <ChevronRight size={11} />
                </Link>
              </div>
              <div style={{ padding:'4px 14px 10px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 0 6px' }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'#22d47a', display:'inline-block' }} />
                  <span style={{ fontSize:10, fontWeight:800, color:'#22d47a', letterSpacing:'0.07em' }}>LIVE NOW</span>
                </div>
                {WC_LIVE.map((m,i) => <WCRow key={i} m={m} isLive={true} />)}
                <p style={{ fontSize:10, fontWeight:700, color:'var(--text-3)', letterSpacing:'0.06em', textTransform:'uppercase', margin:'12px 0 4px' }}>Today</p>
                {WC_REST.map((m,i) => <WCRow key={i} m={m} isLive={false} />)}
              </div>
            </motion.div>

            {/* Top Players */}
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
                  <span style={{ fontSize:13, fontWeight:800, color:'var(--text-1)' }}>Top Players · PL</span>
                </div>
                <Link to="/players" style={{ fontSize:11, fontWeight:700, color:'#7c3aed', textDecoration:'none', display:'flex', alignItems:'center', gap:2 }}>
                  All <ChevronRight size={11} />
                </Link>
              </div>
              {/* Tabs */}
              <div style={{ display:'flex', borderBottom:'1px solid var(--border)' }}>
                {[{key:'goals',label:'Goals',icon:Goal},{key:'assists',label:'Assists',icon:Footprints}].map(({key,label,icon:Icon}) => {
                  const on = playerTab===key
                  return (
                    <button key={key} onClick={()=>setPlayerTab(key)} style={{
                      flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:6,
                      padding:'10px 0',fontSize:12,fontWeight:700,
                      cursor:'pointer',border:'none',outline:'none',
                      background: on ? 'rgba(124,58,237,0.07)' : 'transparent',
                      color: on ? '#7c3aed' : 'var(--text-3)',
                      borderBottom: on ? '2px solid #7c3aed' : '2px solid transparent',
                      transition:'all 0.15s',
                    }}>
                      <Icon size={12} />{label}
                    </button>
                  )
                })}
              </div>
              <div style={{ padding:'4px 14px 8px' }}>
                <AnimatePresence mode="wait">
                  <motion.div key={playerTab} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.15}}>
                    {loading
                      ? [0,1,2,3,4].map(i=>(
                        <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
                          <div style={{width:16,height:12,borderRadius:3}} className="shimmer" />
                          <div style={{width:34,height:34,borderRadius:'50%'}} className="shimmer" />
                          <div style={{flex:1,display:'flex',flexDirection:'column',gap:5}}>
                            <div style={{height:11,width:'65%',borderRadius:4}} className="shimmer" />
                            <div style={{height:9,width:'40%',borderRadius:4}} className="shimmer" />
                          </div>
                          <div style={{width:34,height:34,borderRadius:10}} className="shimmer" />
                        </div>
                      ))
                      : playerData.length===0
                      ? <p style={{padding:'24px 0',textAlign:'center',color:'var(--text-3)',fontSize:12,margin:0,fontWeight:600}}>Resets at 03:00 AM TJ</p>
                      : playerData.map((item,i)=><PlayerRow key={item.player.id} item={item} rank={i+1} statKey={playerTab} />)
                    }
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
}
