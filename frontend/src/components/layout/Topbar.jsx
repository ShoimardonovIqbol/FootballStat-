import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Search, Radio } from 'lucide-react'
import { searchAPI } from '../../services/api'

const flag = cc => `https://flagcdn.com/w40/${cc}.png`

const MATCHES = [
  { time: '00:00', hf: flag('sn'), af: flag('iq'), hs: 0, as: 0, live: false },
  { time: '05:00', hf: flag('uy'), af: flag('es'), hs: 0, as: 2, live: false },
  { time: '05:00', hf: flag('cv'), af: flag('sa'), hs: 1, as: 1, live: false },
  { time: '08:00', hf: flag('eg'), af: flag('ir'), hs: 2, as: 0, live: false },
  { time: '08:00', hf: flag('au'), af: flag('be'), hs: 0, as: 3, live: false },
  { time: "67'",   hf: flag('pt'), af: flag('uz'), hs: 5, as: 0, live: true  },
  { time: "45'",   hf: flag('fr'), af: flag('de'), hs: 2, as: 1, live: true  },
  { time: "82'",   hf: flag('br'), af: flag('ar'), hs: 1, as: 2, live: true  },
  { time: '14:00', hf: flag('jp'), af: flag('se'), hs: 1, as: 1, live: false },
  { time: '16:00', hf: flag('tr'), af: flag('us'), hs: 3, as: 2, live: false },
  { time: '18:00', hf: flag('it'), af: flag('mx'), hs: 0, as: 0, live: false },
  { time: '20:00', hf: flag('kr'), af: flag('gh'), hs: 2, as: 1, live: false },
]

const DOUBLE = [...MATCHES, ...MATCHES]

function LiveTicker() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      background: 'rgba(8,8,23,0.95)',
      borderBottom: '1px solid rgba(124,58,237,0.15)',
      overflow: 'hidden',
      height: 44,
    }}>
      {/* Label */}
      <div style={{
        flexShrink: 0, zIndex: 2,
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '0 14px', height: '100%',
        background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
        borderRight: '2px solid rgba(124,58,237,0.5)',
      }}>
        <span style={{ fontSize: 14 }}>🏆</span>
        <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
          WORLD CUP
        </span>
      </div>

      {/* Scrolling */}
      <motion.div
        style={{ display: 'flex', alignItems: 'center', width: 'max-content', height: '100%' }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        {DOUBLE.map((m, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '0 18px', height: '100%',
              borderRight: '1px solid rgba(124,58,237,0.1)',
              position: 'relative',
            }}
          >
            {/* Live glow */}
            {m.live && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(34,212,122,0.04)',
                pointerEvents: 'none',
              }} />
            )}

            {/* Time */}
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: m.live ? '#22d47a' : '#475569',
              minWidth: 34, textAlign: 'center',
              letterSpacing: '0.03em',
            }}>
              {m.time}
            </span>

            {/* Home flag */}
            <img src={m.hf} alt="" style={{ width: 24, height: 16, objectFit: 'cover', borderRadius: 2 }} />

            {/* Score */}
            <span style={{
              fontSize: 13, fontWeight: 800, color: '#fff',
              letterSpacing: '0.05em', minWidth: 28, textAlign: 'center',
            }}>
              {m.hs}:{m.as}
            </span>

            {/* Away flag */}
            <img src={m.af} alt="" style={{ width: 24, height: 16, objectFit: 'cover', borderRadius: 2 }} />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function Topbar({ title }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState(null)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async (val) => {
    setQ(val)
    if (val.length < 3) { setResults(null); setOpen(false); return }
    try {
      const res = await searchAPI.search(val)
      setResults(res.data)
      setOpen(true)
    } catch { /* ignore */ }
  }

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 40 }}>
      <LiveTicker />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 32px',
          background: 'rgba(8,8,23,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(124,58,237,0.12)',
        }}
      >
      <h1 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>{title}</h1>

      {/* Search */}
      <div style={{ position: 'relative', width: 288 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
        <input
          value={q}
          onChange={e => handleSearch(e.target.value)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          onFocus={() => { if (results) setOpen(true) }}
          placeholder="Search teams, players…"
          style={{
            width: '100%',
            paddingLeft: 36,
            paddingRight: 16,
            paddingTop: 9,
            paddingBottom: 9,
            borderRadius: 12,
            fontSize: 13,
            color: '#e2e8f0',
            outline: 'none',
            boxSizing: 'border-box',
            background: 'rgba(21,21,58,0.8)',
            border: '1px solid rgba(124,58,237,0.2)',
          }}
        />

        <AnimatePresence>
          {open && results && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              style={{
                position: 'absolute',
                top: '100%',
                marginTop: 8,
                width: '100%',
                borderRadius: 12,
                overflow: 'hidden',
                zIndex: 50,
                background: '#10102a',
                border: '1px solid rgba(124,58,237,0.3)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              }}
            >
              {results.teams?.response?.slice(0, 5).map(t => (
                <button
                  key={t.team.id}
                  onMouseDown={() => { navigate(`/teams/${t.team.id}`); setOpen(false); setQ('') }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                    padding: '10px 16px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <img src={t.team.logo} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
                  <span style={{ fontSize: 13, color: '#e2e8f0' }}>{t.team.name}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: '#64748b' }}>{t.team.country}</span>
                </button>
              ))}
              {results.teams?.response?.length === 0 && (
                <p style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>No results for "{q}"</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Live indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Radio size={14} style={{ color: '#22d47a' }} />
        <span style={{ fontSize: 12, color: '#22d47a', fontWeight: 700 }}>LIVE</span>
      </div>
      </div>
    </header>
  )
}
