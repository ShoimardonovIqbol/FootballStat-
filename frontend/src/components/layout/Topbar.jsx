import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Search, Sun, Moon, Globe2, CalendarDays, Trophy, Users, Tv, Newspaper, Star, BarChart3, Shield } from 'lucide-react'
import { searchAPI, matchesAPI } from '../../services/api'
import { useTheme } from '../../context/ThemeContext'
import { useFavorites } from '../../context/FavoritesContext'

const NAV = [
  { to: '/worldcup',  label: 'World Cup'  },
  { to: '/matches',   label: 'Matches'    },
  { to: '/leagues',   label: 'Leagues'    },
  { to: '/standings', label: 'Standings'  },
  { to: '/teams',     label: 'Teams'      },
  { to: '/players',   label: 'Players'    },
  { to: '/watch',     label: 'Watch Live' },
  { to: '/news',      label: 'News'       },
]

export default function Topbar({ title }) {
  const [q, setQ]           = useState('')
  const [results, setResults] = useState(null)
  const [open, setOpen]     = useState(false)
  const [liveCount, setLiveCount] = useState(null)
  const navigate   = useNavigate()
  const searchRef  = useRef(null)
  const { light, toggle } = useTheme()
  const { teams, players } = useFavorites()
  const favTotal = teams.length + players.length

  useEffect(() => {
    let cancelled = false
    const fetchLive = () => {
      matchesAPI.getLive()
        .then(r => { if (!cancelled) setLiveCount(r.data?.results ?? 0) })
        .catch(() => { if (!cancelled) setLiveCount(0) })
    }
    fetchLive()
    const id = setInterval(fetchLive, 60000)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  useEffect(() => {
    const h = e => { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); searchRef.current?.focus() } }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const handleSearch = async val => {
    setQ(val)
    if (val.length < 3) { setResults(null); setOpen(false); return }
    try { const r = await searchAPI.search(val); setResults(r.data); setOpen(true) } catch {}
  }

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>

      {/* ── Main nav bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 0,
        background: '#111', borderBottom: '1px solid var(--border)',
        height: 52, padding: '0 20px', boxSizing: 'border-box',
      }}>

        {/* Logo */}
        <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginRight: 28, flexShrink: 0 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: '#111', fontFamily: 'system-ui', letterSpacing: '-1px' }}>FS</span>
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.4px' }}>FootballStat</span>
        </NavLink>

        {/* Search */}
        <div style={{ position: 'relative', width: 220, marginRight: 24, flexShrink: 0 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
          <input
            ref={searchRef}
            value={q}
            onChange={e => handleSearch(e.target.value)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            onFocus={() => { if (results) setOpen(true) }}
            placeholder="Search…"
            style={{
              width: '100%', paddingLeft: 30, paddingRight: 10,
              paddingTop: 7, paddingBottom: 7,
              borderRadius: 20, fontSize: 12, color: '#fff',
              outline: 'none', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          />
          <AnimatePresence>
            {open && results && (
              <motion.div
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  position: 'absolute', top: '100%', marginTop: 6, width: 260,
                  borderRadius: 10, overflow: 'hidden', zIndex: 200,
                  background: '#1a1a1a', border: '1px solid var(--border)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                }}
              >
                {results.teams?.response?.slice(0, 5).map(t => (
                  <button key={t.team.id}
                    onMouseDown={() => { navigate(`/teams/${t.team.id}`); setOpen(false); setQ('') }}
                    style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', background:'transparent', border:'none', cursor:'pointer', textAlign:'left' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <img src={t.team.logo} alt="" style={{ width:20, height:20, objectFit:'contain' }} />
                    <span style={{ fontSize:13, color:'#fff' }}>{t.team.name}</span>
                    <span style={{ marginLeft:'auto', fontSize:11, color:'var(--text-3)' }}>{t.team.country}</span>
                  </button>
                ))}
                {results.teams?.response?.length === 0 && (
                  <p style={{ padding:'12px 14px', fontSize:13, color:'var(--text-3)' }}>No results</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, overflow: 'hidden' }}>
          {NAV.map(({ to, label }) => (
            <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <span style={{
                  display: 'inline-block', padding: '5px 10px', borderRadius: 6,
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#fff' : '#8f9198',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color='#fff'; e.currentTarget.style.background='rgba(255,255,255,0.05)' } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color='#8f9198'; e.currentTarget.style.background='transparent' } }}
                >{label}</span>
              )}
            </NavLink>
          ))}

          {/* Favorites with count */}
          <NavLink to="/favorites" style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '5px 10px', borderRadius: 6, fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#fff' : '#8f9198',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color='#fff'; e.currentTarget.style.background='rgba(255,255,255,0.05)' } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color='#8f9198'; e.currentTarget.style.background='transparent' } }}
              >
                Favorites
                {favTotal > 0 && (
                  <span style={{ fontSize:10, fontWeight:800, padding:'1px 5px', borderRadius:99, background:'rgba(255,255,255,0.12)', color:'#fff' }}>{favTotal}</span>
                )}
              </span>
            )}
          </NavLink>
        </nav>

        {/* Right: LIVE + theme */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, marginLeft: 12 }}>
          <div onClick={() => navigate('/matches')} style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer' }}>
            {liveCount > 0 ? (
              <motion.span animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.4, repeat:Infinity }}
                style={{ width:6, height:6, borderRadius:'50%', background:'#3fca7a', display:'inline-block' }} />
            ) : (
              <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--text-4)', display:'inline-block' }} />
            )}
            <span style={{ fontSize:12, fontWeight:700, color: liveCount > 0 ? '#3fca7a' : 'var(--text-4)' }}>
              {liveCount === null ? 'LIVE' : liveCount > 0 ? `LIVE · ${liveCount}` : 'LIVE'}
            </span>
          </div>

          <button onClick={toggle} style={{
            display:'flex', alignItems:'center', justifyContent:'center',
            width:30, height:30, borderRadius:6,
            border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)',
            cursor:'pointer', color:'#8f9198', flexShrink:0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#8f9198' }}
          >
            {light ? <Moon size={13} /> : <Sun size={13} />}
          </button>
        </div>
      </div>
    </header>
  )
}
