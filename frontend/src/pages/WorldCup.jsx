import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { standingsAPI, matchesAPI } from '../services/api'
import Topbar from '../components/layout/Topbar'
import { Trophy, Globe, Calendar } from 'lucide-react'

const WC_LEAGUE = 1
const WC_SEASON = 2022
const GROUP_LABELS = 'ABCDEFGHIJKL'.split('')
const safe = p => p.then(r => r.data).catch(() => null)

function GroupCard({ group, label, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 260, damping: 22 }}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      <div style={{
        padding: '10px 14px',
        background: 'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(79,70,229,0.06))',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7,
          background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 800, color: '#fff',
        }}>
          {label}
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed' }}>Group {label}</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2rem 2rem 2rem 2rem 2rem 2.2rem',
        padding: '5px 12px',
        fontSize: 10, fontWeight: 600, color: 'var(--text-3)',
        borderBottom: '1px solid var(--border)',
      }}>
        <span>Team</span>
        <span style={{ textAlign: 'center' }}>P</span>
        <span style={{ textAlign: 'center', color: '#22d47a' }}>W</span>
        <span style={{ textAlign: 'center', color: '#f59e0b' }}>D</span>
        <span style={{ textAlign: 'center', color: '#f43f5e' }}>L</span>
        <span style={{ textAlign: 'center' }}>GD</span>
        <span style={{ textAlign: 'center', color: '#7c3aed', fontWeight: 700 }}>Pts</span>
      </div>

      {group.map((row, i) => {
        const isQ = i < 2
        return (
          <div
            key={row.team.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2rem 2rem 2rem 2rem 2rem 2.2rem',
              alignItems: 'center',
              padding: '7px 12px',
              borderBottom: i < group.length - 1 ? '1px solid var(--border)' : 'none',
              borderLeft: '3px solid ' + (isQ ? '#7c3aed' : 'transparent'),
              background: isQ ? 'rgba(124,58,237,0.04)' : 'transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, overflow: 'hidden' }}>
              <img src={row.team.logo} alt="" style={{ width: 18, height: 18, objectFit: 'contain', flexShrink: 0 }}
                onError={e => { e.target.style.opacity = 0.2 }} />
              <span style={{
                fontSize: 12, fontWeight: isQ ? 600 : 400,
                color: isQ ? 'var(--text-1)' : 'var(--text-2)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {row.team.name}
              </span>
            </div>
            <span style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-2)' }}>{row.all.played}</span>
            <span style={{ textAlign: 'center', fontSize: 11, color: '#22d47a' }}>{row.all.win}</span>
            <span style={{ textAlign: 'center', fontSize: 11, color: '#f59e0b' }}>{row.all.draw}</span>
            <span style={{ textAlign: 'center', fontSize: 11, color: '#f43f5e' }}>{row.all.lose}</span>
            <span style={{
              textAlign: 'center', fontSize: 11, fontWeight: 600,
              color: row.goalsDiff > 0 ? '#22d47a' : row.goalsDiff < 0 ? '#f43f5e' : 'var(--text-2)',
            }}>
              {row.goalsDiff > 0 ? '+' : ''}{row.goalsDiff}
            </span>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                minWidth: 22, height: 20, borderRadius: 5, padding: '0 4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800,
                color: isQ ? '#fff' : 'var(--text-1)',
                background: isQ ? 'linear-gradient(135deg,rgba(124,58,237,0.4),rgba(79,70,229,0.4))' : 'var(--surface2)',
                border: isQ ? '1px solid rgba(124,58,237,0.5)' : '1px solid var(--border)',
              }}>
                {row.points}
              </div>
            </div>
          </div>
        )
      })}

      <div style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{ width: 8, height: 2, background: '#7c3aed', borderRadius: 1 }} />
        <span style={{ fontSize: 9, color: 'var(--text-3)' }}>Qualify to Round of 32</span>
      </div>
    </motion.div>
  )
}

function FixtureRow({ match }) {
  const { fixture, teams, goals } = match
  const status = fixture.status.short
  const isLive = ['1H','HT','2H','ET','P'].includes(status)
  const isDone = ['FT','AET','PEN'].includes(status)
  const timeLabel = isLive
    ? fixture.status.elapsed + "'"
    : isDone
      ? 'FT'
      : fixture.date
        ? new Date(fixture.date).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
        : status

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '4.5rem 1fr auto 1fr',
      alignItems: 'center',
      gap: 12,
      padding: '10px 16px',
      borderBottom: '1px solid var(--border)',
      background: isLive ? 'rgba(34,212,122,0.03)' : 'transparent',
    }}>
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: isLive ? '#22d47a' : isDone ? 'var(--text-3)' : 'var(--text-2)' }}>
          {timeLabel}
        </span>
        {isLive && (
          <div style={{ fontSize: 8, fontWeight: 800, color: '#22d47a', letterSpacing: '0.1em' }}>LIVE</div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)', textAlign: 'right' }}>
          {teams.home.name}
        </span>
        <img src={teams.home.logo} alt="" style={{ width: 22, height: 22, objectFit: 'contain' }}
          onError={e => { e.target.style.opacity = 0.2 }} />
      </div>

      <div style={{
        padding: '4px 10px', borderRadius: 8, minWidth: 44, textAlign: 'center',
        background: isDone || isLive ? 'rgba(124,58,237,0.12)' : 'var(--surface2)',
        border: '1px solid ' + (isDone || isLive ? 'rgba(124,58,237,0.35)' : 'var(--border)'),
        fontSize: 13, fontWeight: 800, color: 'var(--text-1)',
      }}>
        {isDone || isLive ? (goals.home ?? 0) + ' : ' + (goals.away ?? 0) : 'vs'}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img src={teams.away.logo} alt="" style={{ width: 22, height: 22, objectFit: 'contain' }}
          onError={e => { e.target.style.opacity = 0.2 }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{teams.away.name}</span>
      </div>
    </div>
  )
}

function GroupSkeleton() {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 14, overflow: 'hidden',
    }}>
      <div style={{ height: 44, background: 'rgba(124,58,237,0.06)', borderBottom: '1px solid var(--border)' }} />
      {[1,2,3,4].map(i => (
        <div key={i} style={{
          height: 36, padding: '0 12px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--surface2)' }} />
          <div style={{ flex: 1, height: 10, borderRadius: 4, background: 'var(--surface2)' }} />
          <div style={{ width: 22, height: 20, borderRadius: 5, background: 'rgba(124,58,237,0.1)' }} />
        </div>
      ))}
    </div>
  )
}

export default function WorldCup() {
  const [tab, setTab] = useState('groups')
  const [groups, setGroups] = useState([])
  const [fixtures, setFixtures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    Promise.all([
      safe(standingsAPI.get(WC_LEAGUE, WC_SEASON)),
      safe(matchesAPI.getList({ league: WC_LEAGUE, season: WC_SEASON, last: 48 })),
    ]).then(([st, fx]) => {
      if (!st) { setError(true); return }
      const raw = st.response?.[0]?.league?.standings ?? []
      setGroups(raw)
      setFixtures((fx?.response ?? []).slice().reverse())
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh' }}>
      <Topbar title="World Cup 2026" />

      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          style={{
            borderRadius: 20, overflow: 'hidden', position: 'relative',
            padding: '28px 32px',
            background: 'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(79,70,229,0.06),rgba(168,85,247,0.04))',
            border: '1px solid rgba(124,58,237,0.2)',
          }}
        >
          <div style={{ position:'absolute',top:-40,left:-20,width:200,height:200,borderRadius:'50%',background:'#7c3aed',opacity:0.08,filter:'blur(48px)',pointerEvents:'none' }} />
          <div style={{ position:'absolute',bottom:-30,right:-20,width:160,height:160,borderRadius:'50%',background:'#a855f7',opacity:0.06,filter:'blur(36px)',pointerEvents:'none' }} />

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
              boxShadow: '0 0 28px rgba(124,58,237,0.4)',
            }}>
              <Trophy size={28} color="#fff" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-1)', margin: 0 }}>
                  FIFA World Cup
                </h1>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: '#f59e0b',
                  background: 'rgba(245,158,11,0.15)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  padding: '2px 10px', borderRadius: 999,
                }}>Qatar 2022</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', margin: 0 }}>
                Qatar &nbsp;|&nbsp; 32 Teams &nbsp;|&nbsp; 8 Groups &nbsp;|&nbsp; November–December 2022
              </p>
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <img src={'https://flagcdn.com/w40/qa.png'} alt="Qatar"
                style={{ width: 34, height: 22, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border)' }} />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[{key:'groups',label:'Groups',Icon:Globe},{key:'fixtures',label:'Fixtures',Icon:Calendar}].map(t => {
            const active = tab === t.key
            return (
              <motion.button
                key={t.key}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setTab(t.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '8px 18px', borderRadius: 12,
                  fontSize: 13, fontWeight: 600,
                  cursor: 'pointer',
                  border: active ? 'none' : '1px solid var(--border)',
                  outline: 'none',
                  background: active ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'var(--surface)',
                  color: active ? '#fff' : 'var(--text-2)',
                  boxShadow: active ? '0 0 18px rgba(124,58,237,0.4)' : 'none',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                <t.Icon size={14} />
                {t.label}
              </motion.button>
            )
          })}
        </div>

        {/* Error state */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '36px 24px', textAlign: 'center',
              background: 'rgba(244,63,94,0.06)',
              border: '1px solid rgba(244,63,94,0.2)',
              borderRadius: 16,
            }}
          >
            <p style={{ fontSize: 16, fontWeight: 700, color: '#f43f5e', margin: '0 0 8px' }}>
              API лимит тамом шуд
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-2)', margin: 0 }}>
              Маълумот фардо дастрас мешавад — соати 03:00 вақти Тоҷикистон
            </p>
          </motion.div>
        )}

        {/* Groups */}
        <AnimatePresence mode="wait">
          {tab === 'groups' && !error && (
            <motion.div
              key="groups"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 14,
              }}
            >
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <GroupSkeleton key={i} />)
                : groups.map((group, i) => (
                    <GroupCard key={i} group={group} label={GROUP_LABELS[i] ?? String(i+1)} index={i} />
                  ))
              }
            </motion.div>
          )}

          {/* Fixtures */}
          {tab === 'fixtures' && !error && (
            <motion.div
              key="fixtures"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 16, overflow: 'hidden',
              }}
            >
              {loading && Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{
                  height: 52, padding: '0 16px',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{ width: 40, height: 10, borderRadius: 4, background: 'var(--surface2)' }} />
                  <div style={{ flex: 1, height: 10, borderRadius: 4, background: 'var(--surface2)' }} />
                  <div style={{ width: 50, height: 24, borderRadius: 8, background: 'rgba(124,58,237,0.1)' }} />
                  <div style={{ flex: 1, height: 10, borderRadius: 4, background: 'var(--surface2)' }} />
                </div>
              ))}
              {!loading && fixtures.length === 0 && (
                <div style={{ padding: '52px 0', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-2)', fontSize: 13 }}>Мусобиқаҳо дастрас нестанд</p>
                </div>
              )}
              {!loading && fixtures.map((m, i) => (
                <FixtureRow key={m.fixture?.id ?? i} match={m} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
