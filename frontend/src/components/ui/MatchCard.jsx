import { Link } from 'react-router-dom'

const STATUS_LIVE = ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'INT']
const STATUS_FT   = ['FT', 'AET', 'PEN']

export default function MatchCard({ fixture, index = 0 }) {
  const { fixture: f, teams, goals } = fixture
  if (!teams?.home || !teams?.away) return null

  const isLive = STATUS_LIVE.includes(f.status.short)
  const isFT   = STATUS_FT.includes(f.status.short)
  const isNS   = f.status.short === 'NS'
  const kickoff = isNS
    ? new Date(f.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null

  const homeWin = !isNS && (goals.home ?? 0) > (goals.away ?? 0)
  const awayWin = !isNS && (goals.away ?? 0) > (goals.home ?? 0)

  return (
    <Link to={`/matches/${f.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '56px 1fr 88px 1fr',
          alignItems: 'center',
          gap: 8,
          padding: '10px 12px',
          borderRadius: 10,
          background: isLive ? 'rgba(34,212,122,0.05)' : 'transparent',
          border: `1px solid ${isLive ? 'rgba(34,212,122,0.2)' : 'transparent'}`,
          transition: 'background 0.15s',
          cursor: 'pointer',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = isLive ? 'rgba(34,212,122,0.08)' : 'var(--surface2)' }}
        onMouseLeave={e => { e.currentTarget.style.background = isLive ? 'rgba(34,212,122,0.05)' : 'transparent' }}
      >
        {/* Col 1: Status */}
        <div style={{ textAlign: 'center' }}>
          {isLive ? (
            <span style={{
              display: 'inline-block', padding: '2px 7px', borderRadius: 6,
              background: 'rgba(34,212,122,0.15)', border: '1px solid rgba(34,212,122,0.35)',
              fontSize: 10, fontWeight: 800, color: '#22d47a',
            }}>{f.status.elapsed}'</span>
          ) : isFT ? (
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)' }}>FT</span>
          ) : (
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)' }}>{kickoff}</span>
          )}
        </div>

        {/* Col 2: Home team (logo + name, right-aligned) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
          <span style={{
            flex: 1,
            textAlign: 'right',
            fontSize: 13,
            fontWeight: homeWin ? 700 : 500,
            color: homeWin ? 'var(--text-1)' : 'var(--text-2)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {teams.home.name}
          </span>
          {teams.home.logo && (
            <img
              src={teams.home.logo}
              alt=""
              style={{ width: 22, height: 22, objectFit: 'contain', flexShrink: 0 }}
              onError={e => { e.target.style.opacity = 0.2 }}
            />
          )}
        </div>

        {/* Col 3: Score */}
        <div style={{ textAlign: 'center' }}>
          {isNS ? (
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)' }}>vs</span>
          ) : (
            <span style={{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: 8,
              background: isLive ? 'rgba(34,212,122,0.12)' : 'var(--surface2)',
              border: `1px solid ${isLive ? 'rgba(34,212,122,0.3)' : 'var(--border)'}`,
              fontSize: 14,
              fontWeight: 900,
              color: 'var(--text-1)',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
            }}>
              {goals.home ?? 0} – {goals.away ?? 0}
            </span>
          )}
        </div>

        {/* Col 4: Away team (logo + name, left-aligned) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
          {teams.away.logo && (
            <img
              src={teams.away.logo}
              alt=""
              style={{ width: 22, height: 22, objectFit: 'contain', flexShrink: 0 }}
              onError={e => { e.target.style.opacity = 0.2 }}
            />
          )}
          <span style={{
            flex: 1,
            fontSize: 13,
            fontWeight: awayWin ? 700 : 500,
            color: awayWin ? 'var(--text-1)' : 'var(--text-2)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {teams.away.name}
          </span>
        </div>
      </div>
    </Link>
  )
}
