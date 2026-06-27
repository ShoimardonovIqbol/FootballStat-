import { useState } from 'react'
import { Tv, Radio, ExternalLink, Play } from 'lucide-react'
import Topbar from '../components/layout/Topbar'

const CHANNELS = [
  { id: 1, name: 'beIN SPORTS',           country: 'International', embedId: 'Gb6_PDlwNQo', live: true  },
  { id: 2, name: 'Sky Sports Football',   country: 'England',       embedId: 'NpFKVGsC_pw', live: true  },
  { id: 3, name: 'Eurosport',             country: 'Europe',        embedId: 'a3ICNMQW7Ok', live: false },
  { id: 4, name: 'Sport TV Тоҷикистон',  country: 'Tajikistan',    embedId: 'E7ixDlfG0IE', live: true  },
  { id: 5, name: 'TNT Sports',            country: 'England',       embedId: 'nVU8NTLAWUM', live: false },
  { id: 6, name: 'DAZN Football',         country: 'International', embedId: 'tdi5HMpE21k', live: false },
]

export default function WatchLive() {
  const [active, setActive] = useState(CHANNELS[0])

  return (
    <div>
      <Topbar title="Watch Live" />

      <div style={{ padding: '24px 32px' }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg,#ef4444,#b91c1c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Tv size={18} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', margin: 0 }}>Live Football TV</h2>
            <p style={{ fontSize: 12, color: 'var(--text-2)', margin: 0 }}>Бозиҳоро онлайн тамошо кунед</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="live-dot" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444' }}>ON AIR</span>
          </div>
        </div>

        {/* Layout: player + channel list */}
        <div style={{ display: 'flex', gap: 24 }}>

          {/* Left: YouTube player */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingTop: '56.25%',
              borderRadius: 16,
              overflow: 'hidden',
              background: '#000',
              border: '2px solid rgba(239,68,68,0.3)',
            }}>
              <iframe
                key={active.embedId}
                src={`https://www.youtube.com/embed/${active.embedId}?autoplay=1&rel=0`}
                title={active.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                style={{
                  position: 'absolute', top: 0, left: 0,
                  width: '100%', height: '100%',
                  border: 'none',
                }}
              />
            </div>

            {/* Now playing bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 18px', marginTop: 12,
              background: 'var(--surface)', borderRadius: 12,
              border: '1px solid var(--border)',
            }}>
              <Radio size={16} color="#ef4444" />
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', margin: 0 }}>{active.name}</p>
                <p style={{ fontSize: 11, color: 'var(--text-2)', margin: 0 }}>{active.country}</p>
              </div>
              {active.live && (
                <span style={{
                  marginLeft: 'auto',
                  padding: '3px 10px', borderRadius: 99,
                  background: '#ef4444',
                  fontSize: 10, fontWeight: 800, color: '#fff',
                }}>● LIVE</span>
              )}
              <a
                href={`https://www.youtube.com/watch?v=${active.embedId}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-2)', fontSize: 12,
                  textDecoration: 'none',
                  marginLeft: active.live ? 8 : 'auto',
                }}
              >
                <ExternalLink size={12} />
                YouTube
              </a>
            </div>
          </div>

          {/* Right: channel list */}
          <div style={{ width: 260, flexShrink: 0 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.08em', marginBottom: 8 }}>
              КАНАЛҲО
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {CHANNELS.map(ch => {
                const isActive = ch.id === active.id
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActive(ch)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px', borderRadius: 12,
                      border: isActive ? '1px solid rgba(239,68,68,0.5)' : '1px solid var(--border)',
                      background: isActive ? 'rgba(239,68,68,0.12)' : 'var(--surface)',
                      cursor: 'pointer', textAlign: 'left', width: '100%',
                      transition: 'all 0.15s',
                    }}
                  >
                    {/* Icon */}
                    <div style={{
                      width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                      background: isActive ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: isActive ? '1px solid rgba(239,68,68,0.35)' : '1px solid rgba(255,255,255,0.08)',
                    }}>
                      <Tv size={15} color={isActive ? '#ef4444' : '#64748b'} />
                    </div>

                    {/* Name */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: isActive ? '#fff' : 'var(--text-1)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ch.name}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--text-2)', margin: 0 }}>{ch.country}</p>
                    </div>

                    {/* Live badge */}
                    {ch.live && (
                      <span style={{
                        padding: '2px 7px', borderRadius: 6, flexShrink: 0,
                        background: 'rgba(239,68,68,0.15)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        fontSize: 9, fontWeight: 800, color: '#ef4444',
                      }}>LIVE</span>
                    )}

                    {isActive && <Play size={13} fill="#ef4444" color="#ef4444" style={{ flexShrink: 0 }} />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
