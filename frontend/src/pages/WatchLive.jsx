import { useState, useEffect, useRef } from 'react'
import Hls from 'hls.js'
import { Maximize2, Loader2, VideoOff } from 'lucide-react'
import { motion } from 'motion/react'
import Topbar from '../components/layout/Topbar'

const flag = code => `https://flagcdn.com/w40/${code}.png`

const CHANNELS = [
  {
    id: 1,
    name: 'Varzish TV',
    code: 'tj',
    country: 'Tajikistan',
    stream: 'https://stream.listopad.tj/varzish/index.m3u8',
    url: 'https://varzishtv.tj/tj/',
    accent: '#22d47a',
    live: true,
  },
  {
    id: 2,
    name: 'Setanta Sports',
    code: 'ua',
    country: 'Europe',
    embed: 'https://www.setanta.com.ua/',
    url: 'https://www.setanta.com.ua/',
    accent: '#f59e0b',
    live: true,
  },
]

export default function WatchLive() {
  const [active, setActive] = useState(CHANNELS[0])
  const [loaded, setLoaded] = useState(false)
  const videoRef = useRef(null)

  const select = ch => {
    if (ch.id === active.id) return
    setLoaded(false)
    setActive(ch)
  }

  useEffect(() => {
    if (!active.stream) return
    const video = videoRef.current
    if (!video) return

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(active.stream)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoaded(true)
        video.play().catch(() => {})
      })
      return () => hls.destroy()
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = active.stream
      const onMeta = () => {
        setLoaded(true)
        video.play().catch(() => {})
      }
      video.addEventListener('loadedmetadata', onMeta)
      return () => video.removeEventListener('loadedmetadata', onMeta)
    }
  }, [active])

  return (
    <div style={{ minHeight: '100vh' }}>
      <Topbar title="Watch Live" />

      <div style={{ padding: '24px 32px' }}>

        {/* Player */}
        <div style={{
          position: 'relative', width: '100%', aspectRatio: '16/9',
          borderRadius: 16, overflow: 'hidden',
          background: '#000', border: '1px solid var(--border)',
          maxWidth: 980,
        }}>
          {!active.live ? (
            // Offline state
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 14,
              background: `radial-gradient(circle at 50% 40%, ${active.accent}14, #0b0b0f 70%)`,
            }}>
              <div style={{ position: 'relative', width: 88, height: 88 }}>
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  border: `1px solid ${active.accent}55`,
                  animation: 'wl-ring 2.4s ease-out infinite',
                }} />
                <div style={{
                  width: 88, height: 88, borderRadius: '50%',
                  background: active.accent + '14', border: `1px solid ${active.accent}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <VideoOff size={36} color={active.accent} strokeWidth={1.5} />
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '0.01em' }}>
                  No Live Broadcast
                </p>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: '10px 0 0', maxWidth: 380, lineHeight: 1.6 }}>
                  {active.name} is currently offline. Coverage resumes during scheduled match hours.
                </p>
              </div>
            </div>
          ) : (
            <>
              {!loaded && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 10, background: '#0b0b0f', zIndex: 1,
                }}>
                  <Loader2 size={28} color={active.accent} className="spin" />
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Loading {active.name}…</span>
                </div>
              )}

              {active.stream ? (
                <video
                  key={active.id}
                  ref={videoRef}
                  controls
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', position: 'relative', zIndex: 0, background: '#000' }}
                />
              ) : (
                <iframe
                  key={active.id}
                  src={active.embed}
                  title={active.name}
                  onLoad={() => setLoaded(true)}
                  allow="autoplay; fullscreen"
                  style={{ width: '100%', height: '100%', border: 'none', position: 'relative', zIndex: 0 }}
                />
              )}
            </>
          )}

          {/* Top overlay bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2,
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.65), transparent)',
            pointerEvents: 'none',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '3px 9px', borderRadius: 6,
              background: active.live ? '#ef4444' : 'rgba(255,255,255,0.12)',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: active.live ? '#fff' : 'rgba(255,255,255,0.5)' }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '0.03em' }}>
                {active.live ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
            <img src={flag(active.code)} alt="" style={{ width: 18, height: 12, objectFit: 'cover', borderRadius: 2 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{active.name}</span>

            <a
              href={active.url}
              target="_blank"
              rel="noreferrer"
              style={{
                marginLeft: 'auto', pointerEvents: 'auto',
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 10px', borderRadius: 7,
                background: 'rgba(0,0,0,0.5)', textDecoration: 'none',
              }}
            >
              <Maximize2 size={12} color="#fff" />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>Fullscreen</span>
            </a>
          </div>
        </div>

        {/* Channel switcher */}
        <div style={{ display: 'flex', gap: 10, marginTop: 18, maxWidth: 980 }}>
          {CHANNELS.map(ch => {
            const isActive = ch.id === active.id
            return (
              <motion.button
                key={ch.id}
                onClick={() => select(ch)}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 16px', borderRadius: 11, cursor: 'pointer',
                  border: isActive ? `1px solid ${ch.accent}` : '1px solid var(--border)',
                  background: isActive ? ch.accent + '18' : 'var(--surface)',
                }}
              >
                <img src={flag(ch.code)} alt="" style={{ width: 18, height: 12, objectFit: 'cover', borderRadius: 2 }} />
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  color: isActive ? ch.accent : 'var(--text-2)',
                }}>
                  {ch.name}
                </span>
                {isActive && (
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
                )}
              </motion.button>
            )
          })}
        </div>

      </div>

      <style>{`
        .spin { animation: wl-spin 1s linear infinite; }
        @keyframes wl-spin { to { transform: rotate(360deg); } }
        @keyframes wl-ring { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.6); opacity: 0; } }
      `}</style>
    </div>
  )
}
