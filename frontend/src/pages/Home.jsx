import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import {
  Radio, CalendarDays, Trophy, ChevronRight,
  TrendingUp, Layers, Goal, Footprints, Zap, ArrowRight
} from 'lucide-react'
import { matchesAPI, playersAPI, standingsAPI } from '../services/api'
import MatchCard from '../components/ui/MatchCard'
import { MatchCardSkeleton } from '../components/ui/Skeleton'
import Topbar from '../components/layout/Topbar'

const LEAGUE_ID = 39
const SEASON    = 2024
const RANK_C    = ['#f59e0b', '#94a3b8', '#cd7f32']
const MEDALS    = ['🥇', '🥈', '🥉']

const WC_LIVE = [
  { hN: 'Portugal',  hF: 'pt', aN: 'Uzbekistan', aF: 'uz', hs: 5, as: 0, min: "67'", group: 'B' },
  { hN: 'France',    hF: 'fr', aN: 'Germany',    aF: 'de', hs: 2, as: 1, min: "45'", group: 'D' },
  { hN: 'Brazil',    hF: 'br', aN: 'Argentina',  aF: 'ar', hs: 1, as: 2, min: "82'", group: 'G' },
]
const WC_REST = [
  { hN: 'Senegal',  hF: 'sn', aN: 'Iraq',    aF: 'iq', hs: 0, as: 0, time: 'FT',    done: true  },
  { hN: 'Uruguay',  hF: 'uy', aN: 'Spain',   aF: 'es', hs: 0, as: 2, time: 'FT',    done: true  },
  { hN: 'Egypt',    hF: 'eg', aN: 'Iran',    aF: 'ir', hs: 2, as: 0, time: 'FT',    done: true  },
  { hN: 'Turkey',   hF: 'tr', aN: 'USA',     aF: 'us', hs: 0, as: 0, time: '16:00', done: false },
  { hN: 'Italy',    hF: 'it', aN: 'Mexico',  aF: 'mx', hs: 0, as: 0, time: '18:00', done: false },
  { hN: 'S. Korea', hF: 'kr', aN: 'Ghana',   aF: 'gh', hs: 2, as: 1, time: 'FT',    done: true  },
]

/* ── count-up ── */
function AnimatedNumber({ value, loading }) {
  const mv = useMotionValue(0)
  const sp = useSpring(mv, { damping: 18, stiffness: 90 })
  const d  = useTransform(sp, v => Math.round(v))
  useEffect(() => { if (!loading && value != null) mv.set(value) }, [value, loading, mv])
  if (loading) return <span style={{ display:'inline-block', width:28, height:26, borderRadius:5, background:'rgba(255,255,255,0.08)', verticalAlign:'middle' }} className="shimmer" />
  return <motion.span>{d}</motion.span>
}

/* ── WC match card (vertical, SofaScore style) ── */
function WCCard({ m, isLive, index }) {
  const scored = isLive || m?.done
  return (
    <motion.div
      initial={{ opacity:0, y:16 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: index * 0.06, type:'spring', stiffness:260, damping:22 }}
      style={{
        flexShrink: 0,
        width: 162,
        borderRadius: 14,
        overflow: 'hidden',
        background: isLive
          ? 'linear-gradient(160deg,rgba(34,212,122,0.1),rgba(13,13,30,0.98))'
          : 'rgba(16,16,42,0.85)',
        border: `1px solid ${isLive ? 'rgba(34,212,122,0.28)' : 'rgba(124,58,237,0.18)'}`,
        boxShadow: isLive ? '0 0 20px rgba(34,212,122,0.08)' : 'none',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '7px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: isLive ? 'rgba(34,212,122,0.08)' : 'rgba(255,255,255,0.03)',
        borderBottom: `1px solid ${isLive ? 'rgba(34,212,122,0.15)' : 'rgba(255,255,255,0.05)'}`,
      }}>
        {isLive ? (
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <div className="live-dot" style={{ width:6, height:6 }} />
            <span style={{ fontSize:10, fontWeight:800, color:'#22d47a' }}>{m.min}</span>
          </div>
        ) : (
          <span style={{ fontSize:10, fontWeight:700, color: m.done ? '#475569' : '#94a3b8' }}>
            {m.time}
          </span>
        )}
        {m.group && (
          <span style={{ fontSize:9, fontWeight:700, color:'#334155', letterSpacing:'0.05em' }}>
            GRP {m.group}
          </span>
        )}
      </div>

      {/* Teams */}
      <div style={{ padding:'12px 12px 10px' }}>
        {/* Home */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <img src={`https://flagcdn.com/w40/${m.hF}.png`} alt=""
              style={{ width:26, height:17, objectFit:'cover', borderRadius:3, border:'1px solid rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize:12, fontWeight:600, color:'#e2e8f0' }}>{m.hN}</span>
          </div>
          <span style={{ fontSize:22, fontWeight:900, color: scored ? '#fff' : '#1e293b', lineHeight:1 }}>
            {scored ? m.hs : '–'}
          </span>
        </div>

        {/* Divider */}
        <div style={{ height:1, background:'rgba(255,255,255,0.05)', marginBottom:8 }} />

        {/* Away */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <img src={`https://flagcdn.com/w40/${m.aF}.png`} alt=""
              style={{ width:26, height:17, objectFit:'cover', borderRadius:3, border:'1px solid rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize:12, fontWeight:600, color:'#e2e8f0' }}>{m.aN}</span>
          </div>
          <span style={{ fontSize:22, fontWeight:900, color: scored ? '#fff' : '#1e293b', lineHeight:1 }}>
            {scored ? m.as : '–'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Player row ── */
function PlayerRow({ item, rank, statKey, index }) {
  const stats = item?.statistics?.[0]
  const val   = statKey === 'goals' ? stats?.goals?.total : stats?.goals?.assists
  const isTop = rank <= 3
  return (
    <motion.div
      initial={{ opacity:0, x:16 }}
      animate={{ opacity:1, x:0 }}
      transition={{ delay: index * 0.04, type:'spring', stiffness:260, damping:22 }}
      style={{
        display:'flex', alignItems:'center', gap:10,
        padding:'8px 14px',
        borderBottom:'1px solid rgba(124,58,237,0.07)',
        borderLeft: isTop ? `2px solid ${RANK_C[rank-1]}` : '2px solid transparent',
        transition:'background 0.13s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
    >
      <span style={{ fontSize:11, fontWeight:800, width:16, flexShrink:0, color: isTop ? RANK_C[rank-1] : '#334155' }}>
        {rank}
      </span>
      <div style={{ position:'relative', flexShrink:0 }}>
        <img src={item?.player?.photo} alt=""
          style={{ width:32, height:32, borderRadius:'50%', objectFit:'cover', display:'block', border:`2px solid ${isTop ? RANK_C[rank-1] : 'rgba(124,58,237,0.2)'}` }}
          onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item?.player?.name||'?')}&background=7c3aed&color=fff&size=32` }}
        />
        {isTop && <span style={{ position:'absolute', bottom:-3, right:-4, fontSize:9, lineHeight:1 }}>{MEDALS[rank-1]}</span>}
      </div>
      <div style={{ flex:1, overflow:'hidden' }}>
        <p style={{ fontSize:12, fontWeight:600, color:'#e2e8f0', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {item?.player?.name}
        </p>
        <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:1 }}>
          {stats?.team?.logo && <img src={stats.team.logo} alt="" style={{ width:11, height:11, objectFit:'contain' }} />}
          <span style={{ fontSize:10, color:'#475569', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{stats?.team?.name}</span>
        </div>
      </div>
      <div style={{
        width:30, height:30, borderRadius:8, flexShrink:0,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:12, fontWeight:800, color:'#fff',
        background: statKey === 'goals'
          ? 'linear-gradient(135deg,rgba(124,58,237,0.4),rgba(79,70,229,0.4))'
          : 'linear-gradient(135deg,rgba(245,158,11,0.35),rgba(234,88,12,0.35))',
        border: statKey === 'goals' ? '1px solid rgba(124,58,237,0.5)' : '1px solid rgba(245,158,11,0.45)',
      }}>
        {val ?? 0}
      </div>
    </motion.div>
  )
}

function SkeletonRow() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 14px', borderBottom:'1px solid rgba(124,58,237,0.06)' }}>
      <div style={{ width:16, height:12, borderRadius:3, background:'rgba(255,255,255,0.06)' }} />
      <div style={{ width:32, height:32, borderRadius:'50%' }} className="shimmer" />
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:4 }}>
        <div style={{ height:11, width:'65%', borderRadius:4 }} className="shimmer" />
        <div style={{ height:9, width:'40%', borderRadius:4 }} className="shimmer" />
      </div>
      <div style={{ width:30, height:30, borderRadius:8 }} className="shimmer" />
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

  const liveMatches  = live?.response?.slice(0, 5)   ?? []
  const todayLeagues = today?.leagues?.slice(0, 4)    ?? []
  const topScorers   = scorers?.response?.slice(0, 7) ?? []
  const topAssists   = assists?.response?.slice(0, 7) ?? []
  const table        = standings?.response?.[0]?.league?.standings?.[0]?.slice(0, 6) ?? []
  const liveCount    = live?.results   ?? WC_LIVE.length
  const todayCount   = today?.total    ?? (WC_LIVE.length + WC_REST.length)
  const leagueCount  = today?.leagues?.length ?? 1
  const playerData   = playerTab === 'goals' ? topScorers : topAssists

  return (
    <div style={{ minHeight:'100vh' }}>
      <Topbar title="Dashboard" />

      {/* ═══ HERO ═══ */}
      <motion.div
        initial={{ opacity:0, y:-20 }}
        animate={{ opacity:1, y:0 }}
        transition={{ type:'spring', stiffness:180, damping:24 }}
        style={{
          margin:'20px 24px 0',
          borderRadius:22,
          overflow:'hidden',
          position:'relative',
          background:'linear-gradient(135deg,#1a0a3e 0%,#0d0d1e 40%,#0a1a2e 100%)',
          border:'1px solid rgba(124,58,237,0.3)',
        }}
      >
        {/* Pitch lines */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:'repeating-linear-gradient(90deg,rgba(255,255,255,0.018) 0,rgba(255,255,255,0.018) 1px,transparent 1px,transparent 56px)',
        }} />
        {/* Glow orbs */}
        <div style={{ position:'absolute', top:-60, left:-40, width:260, height:260, borderRadius:'50%', background:'#7c3aed', opacity:0.12, filter:'blur(60px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-50, right:60, width:200, height:200, borderRadius:'50%', background:'#22d47a', opacity:0.06, filter:'blur(50px)', pointerEvents:'none' }} />

        <div style={{ position:'relative', padding:'28px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:24 }}>
          {/* Left */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <div style={{
                display:'flex', alignItems:'center', gap:7,
                background:'linear-gradient(135deg,rgba(245,158,11,0.2),rgba(245,158,11,0.08))',
                border:'1px solid rgba(245,158,11,0.3)',
                padding:'4px 12px', borderRadius:99,
              }}>
                <Trophy size={12} color="#f59e0b" />
                <span style={{ fontSize:10, fontWeight:800, color:'#f59e0b', letterSpacing:'0.08em' }}>
                  WORLD CUP 2026 · LIVE
                </span>
              </div>
            </div>
            <h1 style={{ fontSize:28, fontWeight:900, color:'#fff', margin:'0 0 6px', letterSpacing:'-0.02em' }}>
              Football Dashboard
            </h1>
            <p style={{ fontSize:12, color:'#475569', margin:0, fontWeight:500 }}>
              {new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' })}
            </p>
          </div>

          {/* Right: stat pills */}
          <div style={{ display:'flex', gap:10, flexShrink:0 }}>
            {[
              { label:'Live',   value:liveCount,  color:'#22d47a', bg:'rgba(34,212,122,0.1)',  border:'rgba(34,212,122,0.25)', icon:Radio        },
              { label:'Today',  value:todayCount, color:'#a78bfa', bg:'rgba(124,58,237,0.1)', border:'rgba(124,58,237,0.25)', icon:CalendarDays },
              { label:'Leagues',value:leagueCount,color:'#f59e0b', bg:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.25)', icon:Layers       },
            ].map(({ label, value, color, bg, border, icon:Icon }) => (
              <motion.div
                key={label}
                initial={{ opacity:0, scale:0.85 }}
                animate={{ opacity:1, scale:1 }}
                transition={{ type:'spring', stiffness:300, damping:22, delay:0.12 }}
                style={{
                  display:'flex', flexDirection:'column', alignItems:'center',
                  padding:'14px 22px', borderRadius:16, minWidth:88,
                  background:bg, border:`1px solid ${border}`, gap:5,
                }}
              >
                <Icon size={14} style={{ color }} />
                <span style={{ fontSize:26, fontWeight:900, color:'#fff', lineHeight:1 }}>
                  <AnimatedNumber value={value} loading={loading} />
                </span>
                <span style={{ fontSize:10, color:'#64748b', fontWeight:700, letterSpacing:'0.05em' }}>{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <div style={{ padding:'20px 24px 40px', display:'flex', flexDirection:'column', gap:24 }}>

        {/* ═══ WORLD CUP MATCHES (horizontal scroll) ═══ */}
        <section>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(245,158,11,0.15)' }}>
                <Trophy size={13} color="#f59e0b" />
              </div>
              <span style={{ fontSize:14, fontWeight:800, color:'#f1f5f9' }}>World Cup 2026</span>
              <div style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(34,212,122,0.1)', border:'1px solid rgba(34,212,122,0.25)', padding:'2px 9px', borderRadius:99 }}>
                <div className="live-dot" style={{ width:6, height:6 }} />
                <span style={{ fontSize:9, fontWeight:800, color:'#22d47a' }}>{WC_LIVE.length} LIVE</span>
              </div>
            </div>
            <Link to="/worldcup" style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'#7c3aed', fontWeight:700, textDecoration:'none' }}>
              All matches <ArrowRight size={12} />
            </Link>
          </div>

          {/* Horizontal scroll */}
          <div style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:6, msOverflowStyle:'none', scrollbarWidth:'none' }}>
            {/* Live first */}
            {WC_LIVE.map((m, i) => <WCCard key={'l'+i} m={m} isLive={true}  index={i} />)}
            {/* Separator */}
            <div style={{ flexShrink:0, width:1, background:'rgba(124,58,237,0.2)', alignSelf:'stretch', margin:'0 4px' }} />
            {/* Rest */}
            {WC_REST.map((m, i) => <WCCard key={'r'+i} m={m} isLive={false} index={i + WC_LIVE.length} />)}
          </div>
        </section>

        {/* ═══ API live matches ═══ */}
        {(loading || liveMatches.length > 0) && (
          <section>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(34,212,122,0.15)' }}>
                  <Zap size={13} color="#22d47a" />
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:'#f1f5f9' }}>Live Now</span>
              </div>
              <Link to="/matches" style={{ display:'flex', alignItems:'center', gap:3, fontSize:11, color:'#7c3aed', fontWeight:600, textDecoration:'none' }}>
                See all <ChevronRight size={10} />
              </Link>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {loading ? [0,1,2].map(i => <MatchCardSkeleton key={i} />) : liveMatches.map((m,i) => <MatchCard key={m.fixture.id} fixture={m} index={i} />)}
            </div>
          </section>
        )}

        {/* ═══ TWO COLUMN ═══ */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:20 }}>

          {/* LEFT: Today's matches */}
          <section>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(124,58,237,0.15)' }}>
                  <CalendarDays size={13} color="#a78bfa" />
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:'#f1f5f9' }}>Today's Matches</span>
              </div>
              <Link to="/matches" style={{ display:'flex', alignItems:'center', gap:3, fontSize:11, color:'#7c3aed', fontWeight:600, textDecoration:'none' }}>
                See all <ChevronRight size={10} />
              </Link>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {loading
                ? [0,1,2].map(i => (
                  <div key={i} style={{ borderRadius:14, overflow:'hidden', background:'rgba(16,16,42,0.7)', border:'1px solid rgba(124,58,237,0.1)' }}>
                    <div style={{ height:40, background:'rgba(124,58,237,0.06)', padding:'0 16px', display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:20, height:20, borderRadius:'50%' }} className="shimmer" />
                      <div style={{ height:12, width:120, borderRadius:4 }} className="shimmer" />
                    </div>
                    <div style={{ padding:'8px 12px', display:'flex', flexDirection:'column', gap:6 }}>
                      {[0,1].map(j => <MatchCardSkeleton key={j} />)}
                    </div>
                  </div>
                ))
                : todayLeagues.length === 0
                ? (
                  <div style={{ padding:'40px 0', textAlign:'center', borderRadius:14, background:'rgba(16,16,42,0.5)', border:'1px solid rgba(124,58,237,0.1)' }}>
                    <CalendarDays size={28} color="#1e293b" style={{ margin:'0 auto 10px', display:'block' }} />
                    <p style={{ color:'#334155', fontSize:13, margin:0, fontWeight:600 }}>No league data available</p>
                    <p style={{ color:'#1e293b', fontSize:11, margin:'4px 0 0' }}>API resets at 03:00 AM (TJ time)</p>
                  </div>
                )
                : todayLeagues.map(({ league, fixtures }, gi) => (
                  <motion.div
                    key={league.id}
                    initial={{ opacity:0, y:16 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ delay:gi * 0.09, type:'spring', stiffness:240, damping:22 }}
                    style={{ borderRadius:14, overflow:'hidden', background:'rgba(16,16,42,0.7)', border:'1px solid rgba(124,58,237,0.1)' }}
                  >
                    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 14px', background:'rgba(124,58,237,0.06)', borderBottom:'1px solid rgba(124,58,237,0.09)' }}>
                      <img src={league.logo} alt="" style={{ width:18, height:18, objectFit:'contain' }} />
                      <span style={{ fontSize:12, fontWeight:700, color:'#e2e8f0' }}>{league.name}</span>
                      <span style={{ marginLeft:'auto', fontSize:10, fontWeight:700, color:'#7c3aed', background:'rgba(124,58,237,0.12)', padding:'2px 8px', borderRadius:99 }}>{fixtures.length}</span>
                    </div>
                    <div style={{ padding:'8px 10px', display:'flex', flexDirection:'column', gap:6 }}>
                      {fixtures.slice(0,4).map((m,i) => <MatchCard key={m.fixture.id} fixture={m} index={i} />)}
                    </div>
                  </motion.div>
                ))
              }
            </div>
          </section>

          {/* RIGHT: Players + Standings */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

            {/* Players */}
            <section>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(245,158,11,0.15)' }}>
                    <TrendingUp size={13} color="#f59e0b" />
                  </div>
                  <span style={{ fontSize:13, fontWeight:700, color:'#f1f5f9' }}>Top Players · PL</span>
                </div>
                <Link to="/players" style={{ display:'flex', alignItems:'center', gap:3, fontSize:11, color:'#7c3aed', fontWeight:600, textDecoration:'none' }}>
                  See all <ChevronRight size={10} />
                </Link>
              </div>
              <div style={{ borderRadius:14, overflow:'hidden', background:'rgba(16,16,42,0.75)', border:'1px solid rgba(124,58,237,0.15)' }}>
                {/* Tabs */}
                <div style={{ display:'flex', borderBottom:'1px solid rgba(124,58,237,0.1)' }}>
                  {[
                    { key:'goals',   label:'Goals',   icon:Goal       },
                    { key:'assists', label:'Assists',  icon:Footprints },
                  ].map(({ key, label, icon:Icon }) => {
                    const active = playerTab === key
                    return (
                      <motion.button
                        key={key} whileTap={{ scale:0.97 }}
                        onClick={() => setPlayerTab(key)}
                        style={{
                          flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:5,
                          padding:'10px 0', fontSize:12, fontWeight:600,
                          cursor:'pointer', border:'none', outline:'none',
                          background: active ? 'rgba(124,58,237,0.12)' : 'transparent',
                          color: active ? '#a78bfa' : '#475569',
                          borderBottom: active ? '2px solid #7c3aed' : '2px solid transparent',
                          transition:'all 0.15s',
                        }}
                      >
                        <Icon size={12} /> {label}
                      </motion.button>
                    )
                  })}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={playerTab} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.15 }}>
                    {loading
                      ? [0,1,2,3,4,5,6].map(i => <SkeletonRow key={i} />)
                      : playerData.length === 0
                      ? <p style={{ padding:'28px 0', textAlign:'center', color:'#334155', fontSize:12, margin:0, fontWeight:600 }}>Resets at 03:00 AM</p>
                      : playerData.map((item, i) => (
                        <PlayerRow key={item.player.id} item={item} rank={i+1} statKey={playerTab} index={i} />
                      ))
                    }
                  </motion.div>
                </AnimatePresence>
              </div>
            </section>

            {/* Standings */}
            <section>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(124,58,237,0.15)' }}>
                    <Trophy size={13} color="#a78bfa" />
                  </div>
                  <span style={{ fontSize:13, fontWeight:700, color:'#f1f5f9' }}>PL Standings</span>
                </div>
                <Link to="/standings" style={{ display:'flex', alignItems:'center', gap:3, fontSize:11, color:'#7c3aed', fontWeight:600, textDecoration:'none' }}>
                  See all <ChevronRight size={10} />
                </Link>
              </div>
              <div style={{ borderRadius:14, overflow:'hidden', background:'rgba(16,16,42,0.7)', border:'1px solid rgba(124,58,237,0.12)' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1.2rem 1.4rem 1fr 1.6rem 1.8rem 2.4rem', padding:'7px 14px', fontSize:10, color:'#334155', fontWeight:700, borderBottom:'1px solid rgba(124,58,237,0.09)', background:'rgba(124,58,237,0.04)', letterSpacing:'0.03em' }}>
                  <span>#</span><span /><span>Club</span>
                  <span style={{ textAlign:'center' }}>P</span>
                  <span style={{ textAlign:'center' }}>GD</span>
                  <span style={{ textAlign:'center', color:'#a78bfa' }}>Pts</span>
                </div>
                {loading
                  ? [0,1,2,3,4,5].map(i => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 14px' }}>
                      <div style={{ width:14, height:10, borderRadius:3 }} className="shimmer" />
                      <div style={{ width:22, height:22, borderRadius:'50%' }} className="shimmer" />
                      <div style={{ height:10, flex:1, borderRadius:3 }} className="shimmer" />
                      <div style={{ width:44, height:10, borderRadius:3 }} className="shimmer" />
                    </div>
                  ))
                  : table.length === 0
                  ? <p style={{ padding:'20px 0', textAlign:'center', color:'#334155', fontSize:12, margin:0, fontWeight:600 }}>Resets at 03:00 AM</p>
                  : table.map((row, i) => (
                    <motion.div
                      key={row.team.id}
                      initial={{ opacity:0, x:10 }}
                      animate={{ opacity:1, x:0 }}
                      transition={{ delay:i * 0.05, type:'spring', stiffness:260, damping:22 }}
                      style={{
                        display:'grid', gridTemplateColumns:'1.2rem 1.4rem 1fr 1.6rem 1.8rem 2.4rem',
                        alignItems:'center', padding:'9px 14px',
                        borderBottom:'1px solid rgba(124,58,237,0.06)',
                        borderLeft: i < 4 ? '2px solid rgba(124,58,237,0.6)' : '2px solid transparent',
                        transition:'background 0.13s', cursor:'pointer',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <span style={{ fontSize:10, color: i < 4 ? '#a78bfa' : '#475569', fontWeight:700 }}>{row.rank}</span>
                      <img src={row.team.logo} alt="" style={{ width:18, height:18, objectFit:'contain' }} />
                      <span style={{ fontSize:11, color:'#e2e8f0', fontWeight: i < 4 ? 600 : 400, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {row.team.name}
                      </span>
                      <span style={{ fontSize:10, textAlign:'center', color:'#475569' }}>{row.all.played}</span>
                      <span style={{ fontSize:10, textAlign:'center', fontWeight:600, color: row.goalsDiff > 0 ? '#22d47a' : row.goalsDiff < 0 ? '#f43f5e' : '#64748b' }}>
                        {row.goalsDiff > 0 ? '+' : ''}{row.goalsDiff}
                      </span>
                      <span style={{ fontSize:13, textAlign:'center', fontWeight:900, color:'#fff' }}>{row.points}</span>
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
