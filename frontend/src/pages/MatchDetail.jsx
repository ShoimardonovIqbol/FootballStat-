import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, Bot, RefreshCw, Trophy, Clock } from 'lucide-react'
import { matchesAPI, aiAPI } from '../services/api'
import Topbar from '../components/layout/Topbar'

function PredictBar({ label, logo, flag, pct, color, align = 'left' }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
        flexDirection: align === 'right' ? 'row-reverse' : 'row',
      }}>
        {logo && <img src={logo} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} onError={e => e.target.style.opacity = 0.2} />}
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{label}</span>
      </div>
      <div style={{
        height: 8, borderRadius: 99,
        background: 'var(--surface2)',
        overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          style={{ height: '100%', borderRadius: 99, background: color }}
        />
      </div>
      <p style={{ fontSize: 22, fontWeight: 900, color, marginTop: 6, textAlign: align === 'right' ? 'right' : 'left' }}>
        {pct}%
      </p>
    </div>
  )
}

export default function MatchDetail() {
  const { id } = useParams()
  const [match,  setMatch]  = useState(null)
  const [pred,   setPred]   = useState(null)
  const [mLoad,  setMLoad]  = useState(true)
  const [pLoad,  setPLoad]  = useState(false)
  const [pError, setPError] = useState(null)

  useEffect(() => {
    matchesAPI.getById(id)
      .then(r => setMatch(r.data))
      .catch(() => setMatch(null))
      .finally(() => setMLoad(false))
  }, [id])

  function fetchPrediction() {
    setPLoad(true)
    setPError(null)
    aiAPI.predict(id)
      .then(r => setPred(r.data))
      .catch(e => setPError(e?.response?.data?.detail || 'Prediction failed'))
      .finally(() => setPLoad(false))
  }

  if (mLoad) return (
    <div>
      <Topbar title="Match" />
      <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ height: 80, borderRadius: 16, background: 'var(--surface)' }} className="shimmer" />
        ))}
      </div>
    </div>
  )

  if (!match) return (
    <div>
      <Topbar title="Match" />
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-3)', fontSize: 15 }}>Match not found.</p>
        <Link to="/matches" style={{ color: 'var(--text-2)', fontWeight: 700 }}>← Back to Matches</Link>
      </div>
    </div>
  )

  const { fixture: f, teams, goals, league } = match
  const isNS  = f.status.short === 'NS'
  const isFT  = ['FT','AET','PEN'].includes(f.status.short)
  const isLive= ['1H','2H','HT','ET','BT','P','INT'].includes(f.status.short)
  const kickoff = new Date(f.date).toLocaleString([], { weekday:'short', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })

  return (
    <div>
      <Topbar title={`${teams.home.name} vs ${teams.away.name}`} />
      <div style={{ padding: '20px 24px 48px', display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 760, margin: '0 auto' }}>

        <Link to="/matches" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'var(--text-3)', textDecoration: 'none', fontSize: 13, fontWeight: 600,
          width: 'fit-content',
        }}>
          <ArrowLeft size={14} /> Back to Matches
        </Link>

        {/* Match header card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}
        >
          {/* League bar */}
          <div style={{ padding: '12px 20px', background: 'var(--surface2)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            {league.logo && <img src={league.logo} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />}
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)' }}>{league.name}</span>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>· {league.round}</span>
          </div>

          {/* Teams + score */}
          <div style={{ padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 24 }}>
            {/* Home */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <img src={teams.home.logo} alt="" style={{ width: 72, height: 72, objectFit: 'contain' }} onError={e => e.target.style.opacity = 0.2} />
              <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-1)', textAlign: 'center' }}>{teams.home.name}</span>
              <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>HOME</span>
            </div>

            {/* Score / time */}
            <div style={{ textAlign: 'center' }}>
              {isNS ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 8 }}>
                    <Clock size={13} color="var(--text-3)" />
                    <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600 }}>{kickoff}</span>
                  </div>
                  <span style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-3)', letterSpacing: 2 }}>vs</span>
                </div>
              ) : (
                <div>
                  {isLive && (
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ padding: '3px 10px', borderRadius: 99, background: 'rgba(34,212,122,0.12)', border: '1px solid rgba(34,212,122,0.3)', fontSize: 11, fontWeight: 800, color: '#22d47a' }}>
                        {f.status.elapsed}'
                      </span>
                    </div>
                  )}
                  <span style={{ fontSize: 48, fontWeight: 900, color: 'var(--text-1)', letterSpacing: 4 }}>
                    {goals.home ?? 0} – {goals.away ?? 0}
                  </span>
                  {isFT && <p style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 700, marginTop: 6 }}>FULL TIME</p>}
                </div>
              )}
            </div>

            {/* Away */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <img src={teams.away.logo} alt="" style={{ width: 72, height: 72, objectFit: 'contain' }} onError={e => e.target.style.opacity = 0.2} />
              <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-1)', textAlign: 'center' }}>{teams.away.name}</span>
              <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>AWAY</span>
            </div>
          </div>
        </motion.div>

        {/* AI Prediction block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}
        >
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} color="var(--text-2)" />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>AI Prediction</p>
                <p style={{ fontSize: 11, color: 'var(--text-3)', margin: 0 }}>Powered by Gemini · based on form & H2H</p>
              </div>
            </div>
            {!pred && !pLoad && (
              <button
                onClick={fetchPrediction}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 18px', borderRadius: 10, cursor: 'pointer', border: 'none',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', fontSize: 13, fontWeight: 700,
                }}
              >
                <Bot size={14} /> Get Prediction
              </button>
            )}
            {pred && (
              <button
                onClick={fetchPrediction}
                disabled={pLoad}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 10, cursor: 'pointer', border: '1px solid var(--border)',
                  background: 'transparent', color: 'var(--text-3)', fontSize: 12, fontWeight: 600,
                }}
              >
                <RefreshCw size={12} /> Refresh
              </button>
            )}
          </div>

          {/* Body */}
          <div style={{ padding: '24px 20px' }}>
            {/* Idle state */}
            {!pred && !pLoad && !pError && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <Bot size={36} color="var(--text-4)" style={{ margin: '0 auto 12px', display: 'block' }} />
                <p style={{ color: 'var(--text-3)', fontSize: 14, fontWeight: 600, margin: 0 }}>Click "Get Prediction" to see AI analysis</p>
                <p style={{ color: 'var(--text-4)', fontSize: 12, margin: '6px 0 0' }}>Analyzes last 5 matches + head-to-head history</p>
              </div>
            )}

            {/* Loading */}
            {pLoad && (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  style={{ width: 36, height: 36, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Bot size={36} color="var(--text-2)" />
                </motion.div>
                <p style={{ color: 'var(--text-3)', fontSize: 13, fontWeight: 600 }}>Analyzing matches...</p>
                <p style={{ color: 'var(--text-4)', fontSize: 11 }}>This may take a few seconds</p>
              </div>
            )}

            {/* Error */}
            {pError && !pLoad && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <p style={{ color: '#f43f5e', fontSize: 13, fontWeight: 600 }}>{pError}</p>
                <button onClick={fetchPrediction} style={{ marginTop: 10, padding: '8px 18px', borderRadius: 8, background: '#f43f5e', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                  Try again
                </button>
              </div>
            )}

            {/* Result */}
            {pred && !pLoad && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Bars */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                  <PredictBar
                    label={teams.home.name}
                    logo={teams.home.logo}
                    pct={pred.home_win}
                    color="#22d47a"
                    align="left"
                  />
                  <div style={{ flexShrink: 0, textAlign: 'center', paddingTop: 6 }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-3)', letterSpacing: '0.08em', margin: '0 0 4px' }}>DRAW</p>
                    <p style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-2)', margin: 0 }}>{pred.draw}%</p>
                  </div>
                  <PredictBar
                    label={teams.away.name}
                    logo={teams.away.logo}
                    pct={pred.away_win}
                    color="#3fca7a"
                    align="right"
                  />
                </div>

                {/* Analysis text */}
                <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 10 }}>
                  <Bot size={16} color="var(--text-2)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>{pred.analysis}</p>
                </div>

                <p style={{ fontSize: 10, color: 'var(--text-4)', margin: 0, textAlign: 'center' }}>
                  AI predictions are for entertainment purposes only · Not betting advice
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  )
}
