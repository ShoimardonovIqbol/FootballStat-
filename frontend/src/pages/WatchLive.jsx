import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Tv, Radio, ExternalLink, Play, AlertCircle } from 'lucide-react'
import Topbar from '../components/layout/Topbar'

const CHANNELS = [
  {
    id: 1,
    name: 'FIFA World Cup 2026',
    country: 'Official · Live',
    channelId: 'UCFu-Z1RXKtMX7NrfV5f45BA',
    youtubeUrl: 'https://www.youtube.com/channel/UCFu-Z1RXKtMX7NrfV5f45BA/live',
    live: true,
    accent: '#7c3aed',
  },
  {
    id: 2,
    name: 'FIFA Official',
    country: 'International',
    channelId: 'UCpcTrCXblq78GZrTUTLWeBw',
    youtubeUrl: 'https://www.youtube.com/channel/UCpcTrCXblq78GZrTUTLWeBw/live',
    live: true,
    accent: '#4f46e5',
  },
  {
    id: 3,
    name: 'Varzish TV',
    country: 'Тоҷикистон',
    channelId: null,
    youtubeUrl: 'https://www.youtube.com/@varzishtv/live',
    live: true,
    accent: '#22d47a',
  },
  {
    id: 4,
    name: 'beIN SPORTS Asia',
    country: 'Asia · Arabic',
    channelId: 'UCYtNSrfGdXooZYu_hkq18_w',
    youtubeUrl: 'https://www.youtube.com/channel/UCYtNSrfGdXooZYu_hkq18_w/live',
    live: true,
    accent: '#ef4444',
  },
  {
    id: 5,
    name: 'Setanta Sports',
    country: 'Europe · UPL',
    channelId: 'UC-M4dS7_cd-k5ZGr-8rHi0g',
    youtubeUrl: 'https://www.youtube.com/channel/UC-M4dS7_cd-k5ZGr-8rHi0g/live',
    live: true,
    accent: '#f59e0b',
  },
  {
    id: 6,
    name: 'beIN SPORTS USA',
    country: 'International',
    channelId: 'UC0YatYmg5JRYzXJPxIdRd8g',
    youtubeUrl: 'https://www.youtube.com/channel/UC0YatYmg5JRYzXJPxIdRd8g/live',
    live: true,
    accent: '#f43f5e',
  },
]

function ChannelAvatar({ name, accent, size = 38 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 4, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: accent + '22',
      border: '1px solid ' + accent + '55',
    }}>
      <Tv size={size * 0.4} color={accent} />
    </div>
  )
}

export default function WatchLive() {
  const [active, setActive] = useState(CHANNELS[0])

  const embedSrc = active.channelId
    ? `https://www.youtube.com/embed/live_stream?channel=${active.channelId}&autoplay=1&rel=0&modestbranding=1`
    : null

  return (
    <div style={{ minHeight: '100vh' }}>
      <Topbar title="Watch Live" />

      <div style={{ padding: '24px 32px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'linear-gradient(135deg,#ef4444,#b91c1c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 18px rgba(239,68,68,0.4)',
          }}>
            <Tv size={18} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', margin: 0 }}>
              Live Football TV
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-2)', margin: 0 }}>
              Бозиҳоро онлайн тамошо кунед · YouTube Live
            </p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="live-dot" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444' }}>ON AIR</span>
          </div>
        </div>

        {/* Layout */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

          {/* Player */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Video wrapper */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '56.25%',
                  borderRadius: 18,
                  overflow: 'hidden',
                  background: '#000',
                  border: '2px solid ' + active.accent + '55',
                  boxShadow: '0 0 32px ' + active.accent + '22',
                }}>
                  {embedSrc ? (
                    <iframe
                      src={embedSrc}
                      title={active.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                      style={{
                        position: 'absolute', top: 0, left: 0,
                        width: '100%', height: '100%', border: 'none',
                      }}
                    />
                  ) : (
                    /* Varzish TV — no embed, show link screen */
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', gap: 16,
                      background: 'linear-gradient(135deg,rgba(34,212,122,0.08),rgba(34,212,122,0.02))',
                    }}>
                      <div style={{
                        width: 72, height: 72, borderRadius: 20,
                        background: active.accent + '22',
                        border: '2px solid ' + active.accent + '55',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Tv size={32} color={active.accent} />
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-1)', margin: '0 0 6px' }}>
                          {active.name}
                        </p>
                        <p style={{ fontSize: 13, color: 'var(--text-2)', margin: 0 }}>
                          YouTube-да мустақим тамошо кунед
                        </p>
                      </div>
                      <a
                        href={active.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '12px 24px', borderRadius: 12,
                          background: active.accent,
                          color: '#fff', fontSize: 14, fontWeight: 700,
                          textDecoration: 'none',
                          boxShadow: '0 0 20px ' + active.accent + '66',
                        }}
                      >
                        <ExternalLink size={16} />
                        YouTube-да Кушед
                      </a>
                    </div>
                  )}
                </div>

                {/* Now playing bar */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 18px', marginTop: 12,
                  background: 'var(--surface)', borderRadius: 14,
                  border: '1px solid var(--border)',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: active.live ? '#ef4444' : 'var(--text-3)',
                    boxShadow: active.live ? '0 0 8px #ef4444' : 'none',
                  }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', margin: 0 }}>
                      {active.name}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-3)', margin: 0 }}>
                      {active.country}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {active.live && (
                      <span style={{
                        padding: '3px 10px', borderRadius: 99,
                        background: 'rgba(239,68,68,0.15)',
                        border: '1px solid rgba(239,68,68,0.35)',
                        fontSize: 10, fontWeight: 800, color: '#ef4444',
                      }}>● LIVE</span>
                    )}
                    <a
                      href={active.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 14px', borderRadius: 8,
                        background: 'var(--surface2)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-2)', fontSize: 12,
                        textDecoration: 'none',
                        transition: 'all 0.15s',
                      }}
                    >
                      <ExternalLink size={12} />
                      YouTube
                    </a>
                  </div>
                </div>

                {/* Note about streams */}
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  padding: '10px 14px', marginTop: 8,
                  background: 'rgba(245,158,11,0.06)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  borderRadius: 10,
                }}>
                  <AlertCircle size={13} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 11, color: 'var(--text-2)', margin: 0, lineHeight: 1.5 }}>
                    Агар экран холӣ бошад — канал ҳоло эфир намекунад. Вақти бозӣ YouTube-да мустақим кор мекунад.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Channel list */}
          <div style={{ width: 260, flexShrink: 0 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.08em', marginBottom: 10 }}>
              КАНАЛҲО
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {CHANNELS.map(ch => {
                const isActive = ch.id === active.id
                return (
                  <motion.button
                    key={ch.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActive(ch)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '11px 13px', borderRadius: 12,
                      border: isActive ? '1px solid ' + ch.accent + '66' : '1px solid var(--border)',
                      background: isActive ? ch.accent + '14' : 'var(--surface)',
                      cursor: 'pointer', textAlign: 'left', width: '100%',
                      transition: 'all 0.15s',
                      outline: 'none',
                    }}
                  >
                    <ChannelAvatar name={ch.name} accent={ch.accent} size={36} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 12, fontWeight: 600,
                        color: isActive ? ch.accent : 'var(--text-1)',
                        margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {ch.name}
                      </p>
                      <p style={{ fontSize: 10, color: 'var(--text-3)', margin: 0 }}>{ch.country}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                      {ch.live && (
                        <span style={{
                          padding: '2px 6px', borderRadius: 5,
                          background: 'rgba(239,68,68,0.12)',
                          border: '1px solid rgba(239,68,68,0.25)',
                          fontSize: 8, fontWeight: 800, color: '#ef4444',
                        }}>LIVE</span>
                      )}
                      {isActive && <Play size={11} fill={ch.accent} color={ch.accent} />}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Tip */}
            <div style={{
              marginTop: 16, padding: '12px 14px', borderRadius: 12,
              background: 'var(--surface2)', border: '1px solid var(--border)',
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', marginBottom: 5 }}>
                💡 Маслиҳат
              </p>
              <p style={{ fontSize: 10, color: 'var(--text-3)', lineHeight: 1.6, margin: 0 }}>
                Агар эфир кор накунад, рости YouTube-ро пахш кунед — бозиҳои Ҷоми Ҷаҳон 2026 дар YouTube мустақим пахш мешаванд.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
