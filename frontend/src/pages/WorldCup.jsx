import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { standingsAPI, matchesAPI, playersAPI } from '../services/api'
import Topbar from '../components/layout/Topbar'
import { Trophy, Globe, Calendar, Target, Share2, Swords } from 'lucide-react'

const WC_LEAGUE = 1
const WC_SEASON = 2026
const GROUP_LABELS = 'ABCDEFGHIJKL'.split('')
const safe = p => p.then(r => r.data).catch(() => null)
const flag = code => `https://flagcdn.com/w40/${code}.png`
const t = (name, code) => ({ name, logo: flag(code) })

// WC 2026 Group Standings — updated Jun 29, 2026
const WC2026_GROUPS = [
  // Group A
  [
    { team: t('Mexico',        'mx'), all: { played:3, win:3, draw:0, lose:0 }, goalsDiff:  6, points: 9 },
    { team: t('South Africa',  'za'), all: { played:3, win:1, draw:1, lose:1 }, goalsDiff: -1, points: 4 },
    { team: t('South Korea',   'kr'), all: { played:3, win:1, draw:0, lose:2 }, goalsDiff: -1, points: 3 },
    { team: t('Czech Rep.',    'cz'), all: { played:3, win:0, draw:1, lose:2 }, goalsDiff: -4, points: 1 },
  ],
  // Group B
  [
    { team: t('Switzerland',   'ch'), all: { played:3, win:2, draw:1, lose:0 }, goalsDiff:  4, points: 7 },
    { team: t('Canada',        'ca'), all: { played:3, win:1, draw:1, lose:1 }, goalsDiff:  5, points: 4 },
    { team: t('Bosnia & Herz.','ba'), all: { played:3, win:1, draw:1, lose:1 }, goalsDiff: -1, points: 4 },
    { team: t('Qatar',         'qa'), all: { played:3, win:0, draw:1, lose:2 }, goalsDiff: -8, points: 1 },
  ],
  // Group C
  [
    { team: t('Brazil',        'br'), all: { played:3, win:2, draw:1, lose:0 }, goalsDiff:  6, points: 7 },
    { team: t('Morocco',       'ma'), all: { played:3, win:2, draw:1, lose:0 }, goalsDiff:  3, points: 7 },
    { team: t('Scotland',      'gb'), all: { played:3, win:1, draw:0, lose:2 }, goalsDiff: -3, points: 3 },
    { team: t('Haiti',         'ht'), all: { played:3, win:0, draw:0, lose:3 }, goalsDiff: -6, points: 0 },
  ],
  // Group D
  [
    { team: t('USA',           'us'), all: { played:3, win:2, draw:0, lose:1 }, goalsDiff:  4, points: 6 },
    { team: t('Australia',     'au'), all: { played:3, win:1, draw:1, lose:1 }, goalsDiff:  0, points: 4 },
    { team: t('Paraguay',      'py'), all: { played:3, win:1, draw:1, lose:1 }, goalsDiff: -2, points: 4 },
    { team: t('Turkey',        'tr'), all: { played:3, win:1, draw:0, lose:2 }, goalsDiff: -2, points: 3 },
  ],
  // Group E
  [
    { team: t('Germany',       'de'), all: { played:3, win:2, draw:0, lose:1 }, goalsDiff:  6, points: 6 },
    { team: t("Côte d'Ivoire", 'ci'), all: { played:3, win:2, draw:0, lose:1 }, goalsDiff:  2, points: 6 },
    { team: t('Ecuador',       'ec'), all: { played:3, win:1, draw:1, lose:1 }, goalsDiff:  0, points: 4 },
    { team: t('Curaçao',       'cw'), all: { played:3, win:0, draw:1, lose:2 }, goalsDiff: -8, points: 1 },
  ],
  // Group F
  [
    { team: t('Netherlands',   'nl'), all: { played:3, win:2, draw:1, lose:0 }, goalsDiff:  6, points: 7 },
    { team: t('Japan',         'jp'), all: { played:3, win:1, draw:2, lose:0 }, goalsDiff:  4, points: 5 },
    { team: t('Sweden',        'se'), all: { played:3, win:1, draw:1, lose:1 }, goalsDiff:  0, points: 4 },
    { team: t('Tunisia',       'tn'), all: { played:3, win:0, draw:0, lose:3 }, goalsDiff:-10, points: 0 },
  ],
  // Group G
  [
    { team: t('Belgium',       'be'), all: { played:3, win:1, draw:2, lose:0 }, goalsDiff:  4, points: 5 },
    { team: t('Egypt',         'eg'), all: { played:3, win:1, draw:2, lose:0 }, goalsDiff:  2, points: 5 },
    { team: t('Iran',          'ir'), all: { played:3, win:0, draw:3, lose:0 }, goalsDiff:  0, points: 3 },
    { team: t('New Zealand',   'nz'), all: { played:3, win:0, draw:1, lose:2 }, goalsDiff: -6, points: 1 },
  ],
  // Group H
  [
    { team: t('Spain',         'es'), all: { played:3, win:2, draw:1, lose:0 }, goalsDiff:  5, points: 7 },
    { team: t('Cape Verde',    'cv'), all: { played:3, win:0, draw:3, lose:0 }, goalsDiff:  0, points: 3 },
    { team: t('Uruguay',       'uy'), all: { played:3, win:0, draw:2, lose:1 }, goalsDiff: -1, points: 2 },
    { team: t('Saudi Arabia',  'sa'), all: { played:3, win:0, draw:2, lose:1 }, goalsDiff: -4, points: 2 },
  ],
  // Group I
  [
    { team: t('France',        'fr'), all: { played:3, win:3, draw:0, lose:0 }, goalsDiff:  8, points: 9 },
    { team: t('Norway',        'no'), all: { played:3, win:2, draw:0, lose:1 }, goalsDiff:  1, points: 6 },
    { team: t('Senegal',       'sn'), all: { played:3, win:1, draw:0, lose:2 }, goalsDiff:  2, points: 3 },
    { team: t('Iraq',          'iq'), all: { played:3, win:0, draw:0, lose:3 }, goalsDiff:-11, points: 0 },
  ],
  // Group J
  [
    { team: t('Argentina',     'ar'), all: { played:3, win:3, draw:0, lose:0 }, goalsDiff:  7, points: 9 },
    { team: t('Austria',       'at'), all: { played:3, win:1, draw:1, lose:1 }, goalsDiff:  0, points: 4 },
    { team: t('Algeria',       'dz'), all: { played:3, win:1, draw:1, lose:1 }, goalsDiff: -2, points: 4 },
    { team: t('Jordan',        'jo'), all: { played:3, win:0, draw:0, lose:3 }, goalsDiff: -5, points: 0 },
  ],
  // Group K
  [
    { team: t('Colombia',      'co'), all: { played:3, win:2, draw:1, lose:0 }, goalsDiff:  3, points: 7 },
    { team: t('Portugal',      'pt'), all: { played:3, win:1, draw:2, lose:0 }, goalsDiff:  5, points: 5 },
    { team: t('DR Congo',      'cd'), all: { played:3, win:1, draw:1, lose:1 }, goalsDiff:  1, points: 4 },
    { team: t('Uzbekistan',    'uz'), all: { played:3, win:0, draw:0, lose:3 }, goalsDiff: -9, points: 0 },
  ],
  // Group L
  [
    { team: t('England',       'gb'), all: { played:3, win:2, draw:1, lose:0 }, goalsDiff:  4, points: 7 },
    { team: t('Croatia',       'hr'), all: { played:3, win:2, draw:0, lose:1 }, goalsDiff:  0, points: 6 },
    { team: t('Ghana',         'gh'), all: { played:3, win:1, draw:1, lose:1 }, goalsDiff:  0, points: 4 },
    { team: t('Panama',        'pa'), all: { played:3, win:0, draw:0, lose:3 }, goalsDiff: -4, points: 0 },
  ],
]

// WC 2026 Round of 32 bracket (from Fabrizio Romano graphic)
const WC2026_R32 = {
  left: [
    { home: { name: 'Germany',      code: 'de' }, away: { name: 'Paraguay',     code: 'py' } },
    { home: { name: 'France',       code: 'fr' }, away: { name: 'Sweden',       code: 'se' } },
    { home: { name: 'South Africa', code: 'za' }, away: { name: 'Canada',       code: 'ca' } },
    { home: { name: 'Netherlands',  code: 'nl' }, away: { name: 'Morocco',      code: 'ma' } },
    { home: { name: 'Portugal',     code: 'pt' }, away: { name: 'Croatia',      code: 'hr' } },
    { home: { name: 'Spain',        code: 'es' }, away: { name: 'Austria',      code: 'at' } },
    { home: { name: 'USA',          code: 'us' }, away: { name: 'Bosnia & Hz.', code: 'ba' } },
    { home: { name: 'Belgium',      code: 'be' }, away: { name: 'Senegal',      code: 'sn' } },
  ],
  right: [
    { home: { name: 'Brazil',       code: 'br' }, away: { name: 'Japan',        code: 'jp' } },
    { home: { name: "Côte d'Ivoire",code: 'ci' }, away: { name: 'Norway',       code: 'no' } },
    { home: { name: 'Mexico',       code: 'mx' }, away: { name: 'Ecuador',      code: 'ec' } },
    { home: { name: 'England',      code: 'gb' }, away: { name: 'DR Congo',     code: 'cd' } },
    { home: { name: 'Argentina',    code: 'ar' }, away: { name: 'Curaçao',      code: 'cw' } },
    { home: { name: 'Australia',    code: 'au' }, away: { name: 'Egypt',        code: 'eg' } },
    { home: { name: 'Switzerland',  code: 'ch' }, away: { name: 'Algeria',      code: 'dz' } },
    { home: { name: 'Colombia',     code: 'co' }, away: { name: 'Ghana',        code: 'gh' } },
  ],
}

const TABS = [
  { key: 'groups',   label: 'Groups',      Icon: Globe    },
  { key: 'knockouts',label: 'Knockouts',   Icon: Swords   },
  { key: 'fixtures', label: 'Fixtures',    Icon: Calendar },
  { key: 'scorers',  label: 'Top Scorers', Icon: Target   },
  { key: 'assists',  label: 'Top Assists', Icon: Share2   },
]

// ─── Bracket tree constants ───────────────────────────────────────
const BR_SLOT   = 50   // px per R32 slot
const BR_TOTAL  = BR_SLOT * 8  // 400px total height
const BR_MW     = 114  // match box width
const BR_MH     = 38   // match box height
const BR_CW     = 16   // connector SVG width

function BracketTeam({ name, code }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 6px', height: (BR_MH - 1) / 2 }}>
      <img
        src={flag(code)} alt=""
        style={{ width: 16, height: 11, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }}
        onError={e => { e.target.style.opacity = 0.2 }}
      />
      <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 84 }}>
        {name}
      </span>
    </div>
  )
}

function BracketMatch({ home, away }) {
  if (!home || !away) {
    return (
      <div style={{
        width: BR_MW, height: BR_MH,
        background: 'var(--surface2)',
        border: '1px dashed var(--border)',
        borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 9, color: 'var(--text-3)', fontWeight: 700, letterSpacing: '0.08em' }}>TBD</span>
      </div>
    )
  }
  return (
    <div style={{
      width: BR_MW,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 8, overflow: 'hidden',
    }}>
      <BracketTeam {...home} />
      <div style={{ height: 1, background: 'var(--border)' }} />
      <BracketTeam {...away} />
    </div>
  )
}

function BracketCol({ matches, slotH, label }) {
  return (
    <div style={{ position: 'relative', width: BR_MW, height: BR_TOTAL, flexShrink: 0 }}>
      <div style={{
        position: 'absolute', top: -18, left: 0, right: 0,
        textAlign: 'center', fontSize: 7, fontWeight: 800,
        color: 'var(--text-3)', letterSpacing: '0.06em', whiteSpace: 'nowrap',
      }}>{label}</div>
      {matches.map((m, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: i * slotH + (slotH - BR_MH) / 2,
          left: 0,
        }}>
          <BracketMatch home={m?.home} away={m?.away} />
        </div>
      ))}
    </div>
  )
}

function BracketConn({ count, isRight = false }) {
  const slotH = BR_TOTAL / count
  const hw = BR_CW / 2
  const paths = []

  for (let k = 0; k < Math.floor(count / 2); k++) {
    const y1 = (2 * k) * slotH + slotH / 2
    const y2 = (2 * k + 1) * slotH + slotH / 2
    const yM = (y1 + y2) / 2
    if (isRight) {
      paths.push(`M ${BR_CW} ${y1} H ${hw} V ${y2} H ${BR_CW} M ${hw} ${yM} H 0`)
    } else {
      paths.push(`M 0 ${y1} H ${hw} V ${y2} H 0 M ${hw} ${yM} H ${BR_CW}`)
    }
  }
  // count=1: single horizontal to Final
  if (count === 1) {
    const y = BR_TOTAL / 2
    paths.push(`M ${isRight ? BR_CW : 0} ${y} H ${isRight ? 0 : BR_CW}`)
  }

  return (
    <svg width={BR_CW} height={BR_TOTAL} style={{ flexShrink: 0, display: 'block' }}>
      {paths.map((d, i) => (
        <path key={i} d={d} stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} fill="none" />
      ))}
    </svg>
  )
}

function KnockoutsTab() {
  const tbd = n => Array(n).fill(null)

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 18px', borderRadius: 14, marginBottom: 24,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}>
        <Swords size={18} color="var(--text-2)" />
        <div>
          <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>
            Knockouts Bracket — World Cup 2026
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-2)', margin: 0 }}>
            R32 → R16 → QF → SF → Final · Single Elimination
          </p>
        </div>
        <span style={{
          marginLeft: 'auto', fontSize: 11, fontWeight: 700,
          padding: '3px 10px', borderRadius: 999,
          background: 'rgba(245,158,11,0.12)', color: '#f59e0b',
          border: '1px solid rgba(245,158,11,0.3)',
        }}>🔜 Starting Soon</span>
      </div>

      {/* Horizontal scrollable bracket tree */}
      <div style={{ overflowX: 'auto', paddingBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', paddingTop: 26, paddingBottom: 8, width: 'max-content' }}>

          {/* ── LEFT SIDE ── */}
          <BracketCol matches={WC2026_R32.left} slotH={BR_SLOT}      label="ROUND OF 32" />
          <BracketConn count={8} />
          <BracketCol matches={tbd(4)}            slotH={BR_SLOT * 2} label="ROUND OF 16" />
          <BracketConn count={4} />
          <BracketCol matches={tbd(2)}            slotH={BR_SLOT * 4} label="QUARTER FINALS" />
          <BracketConn count={2} />
          <BracketCol matches={tbd(1)}            slotH={BR_SLOT * 8} label="SEMI FINALS" />
          <BracketConn count={1} />

          {/* ── CENTER TROPHY ── */}
          <div style={{
            width: 70, height: BR_TOTAL, flexShrink: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'linear-gradient(135deg,#f59e0b,#d97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(245,158,11,0.5)',
            }}>
              <Trophy size={20} color="#fff" />
            </div>
            <p style={{ fontSize: 8, fontWeight: 900, color: '#f59e0b', letterSpacing: '0.1em', margin: 0 }}>FINAL</p>
            <p style={{ fontSize: 7, color: 'var(--text-3)', margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
              Jul 19<br />New York
            </p>
          </div>

          {/* ── RIGHT SIDE ── */}
          <BracketConn count={1} isRight />
          <BracketCol matches={tbd(1)}            slotH={BR_SLOT * 8} label="SEMI FINALS" />
          <BracketConn count={2} isRight />
          <BracketCol matches={tbd(2)}            slotH={BR_SLOT * 4} label="QUARTER FINALS" />
          <BracketConn count={4} isRight />
          <BracketCol matches={tbd(4)}            slotH={BR_SLOT * 2} label="ROUND OF 16" />
          <BracketConn count={8} isRight />
          <BracketCol matches={WC2026_R32.right}  slotH={BR_SLOT}     label="ROUND OF 32" />

        </div>
      </div>
    </div>
  )
}

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
        background: 'var(--surface2)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7,
          background: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 800, color: '#fff',
        }}>
          {label}
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)' }}>Group {label}</span>
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
        <span style={{ textAlign: 'center', color: 'var(--text-2)', fontWeight: 700 }}>Pts</span>
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
              borderLeft: '3px solid ' + (isQ ? '#3fca7a' : 'transparent'),
              background: isQ ? 'rgba(63,202,122,0.04)' : 'transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, overflow: 'hidden' }}>
              <img src={row.team.logo} alt="" style={{ width: 20, height: 14, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }}
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
                background: isQ ? 'rgba(63,202,122,0.18)' : 'var(--surface2)',
                border: isQ ? '1px solid rgba(63,202,122,0.35)' : '1px solid var(--border)',
              }}>
                {row.points}
              </div>
            </div>
          </div>
        )
      })}

      <div style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{ width: 8, height: 2, background: '#3fca7a', borderRadius: 1 }} />
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
        background: 'var(--surface2)',
        border: '1px solid var(--border)',
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

function ScorerRow({ player, rank, value, valueLabel }) {
  const { player: p, statistics } = player
  const stat = statistics?.[0]
  const isTop3 = rank <= 3
  const medalColor = rank === 1 ? '#f59e0b' : rank === 2 ? '#94a3b8' : '#cd7c2e'

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '44px 40px 1fr auto',
      alignItems: 'center',
      gap: 12,
      padding: '10px 16px',
      borderBottom: '1px solid var(--border)',
      background: 'transparent',
    }}>
      <div style={{ textAlign: 'center' }}>
        {isTop3 ? (
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: medalColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 800, color: '#fff', margin: '0 auto',
          }}>
            {rank}
          </div>
        ) : (
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)' }}>{rank}</span>
        )}
      </div>

      <img
        src={p.photo} alt=""
        style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
        onError={e => { e.target.style.opacity = 0.3 }}
      />

      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {p.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
          {stat?.team?.logo && (
            <img src={stat.team.logo} alt="" style={{ width: 14, height: 14, objectFit: 'contain' }}
              onError={e => { e.target.style.opacity = 0 }} />
          )}
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{stat?.team?.name ?? '—'}</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', paddingLeft: 8 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-1)', lineHeight: 1 }}>
          {value ?? 0}
        </div>
        <div style={{ fontSize: 9, color: 'var(--text-3)', fontWeight: 700, letterSpacing: '0.08em', marginTop: 2 }}>
          {valueLabel}
        </div>
      </div>
    </div>
  )
}

function ScorerSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '44px 40px 1fr auto', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--surface2)', margin: '0 auto' }} />
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface2)' }} />
      <div>
        <div style={{ width: '55%', height: 11, borderRadius: 4, background: 'var(--surface2)' }} />
        <div style={{ width: '35%', height: 9, borderRadius: 4, background: 'var(--surface2)', marginTop: 6 }} />
      </div>
      <div style={{ width: 32, height: 28, borderRadius: 6, background: 'var(--surface2)', marginLeft: 'auto' }} />
    </div>
  )
}

function GroupSkeleton() {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ height: 44, background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }} />
      {[1,2,3,4].map(i => (
        <div key={i} style={{ height: 36, padding: '0 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--surface2)' }} />
          <div style={{ flex: 1, height: 10, borderRadius: 4, background: 'var(--surface2)' }} />
          <div style={{ width: 22, height: 20, borderRadius: 5, background: 'var(--surface2)' }} />
        </div>
      ))}
    </div>
  )
}

export default function WorldCup() {
  const [tab, setTab] = useState('groups')
  const [groups, setGroups] = useState([])
  const [fixtures, setFixtures] = useState([])
  const [scorers, setScorers] = useState([])
  const [assists, setAssists] = useState([])
  const [loading, setLoading] = useState(true)
  const [scorersLoading, setScorersLoading] = useState(false)
  const [assistsLoading, setAssistsLoading] = useState(false)
  const [error, setError] = useState(false)
  const scorersFetched = useRef(false)
  const assistsFetched = useRef(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    Promise.all([
      safe(standingsAPI.get(WC_LEAGUE, WC_SEASON)),
      safe(matchesAPI.getList({ league: WC_LEAGUE, season: WC_SEASON, last: 64 })),
    ]).then(([st, fx]) => {
      const raw = st?.response?.[0]?.league?.standings ?? []
      setGroups(raw.length > 0 ? raw : WC2026_GROUPS)
      setFixtures((fx?.response ?? []).slice().reverse())
    }).catch(() => {
      setGroups(WC2026_GROUPS)
      setError(false)
    }).finally(() => setLoading(false))
  }, [])

  const handleTab = (key) => {
    setTab(key)
    if (key === 'scorers' && !scorersFetched.current) {
      scorersFetched.current = true
      setScorersLoading(true)
      safe(playersAPI.getTopScorers(WC_LEAGUE, WC_SEASON))
        .then(d => setScorers(d?.response ?? []))
        .finally(() => setScorersLoading(false))
    }
    if (key === 'assists' && !assistsFetched.current) {
      assistsFetched.current = true
      setAssistsLoading(true)
      safe(playersAPI.getTopAssists(WC_LEAGUE, WC_SEASON))
        .then(d => setAssists(d?.response ?? []))
        .finally(() => setAssistsLoading(false))
    }
  }

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
            background: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.08)',
            }}>
              <Trophy size={28} color="#fff" />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-1)', margin: 0 }}>
                  FIFA World Cup 2026
                </h1>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: '#f59e0b',
                  background: 'rgba(245,158,11,0.15)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  padding: '2px 10px', borderRadius: 999,
                }}>🔴 Live Now</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', margin: 0 }}>
                USA · Canada · Mexico &nbsp;|&nbsp; 48 Teams &nbsp;|&nbsp; 12 Groups &nbsp;|&nbsp; June–July 2026
              </p>
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexShrink: 0 }}>
              {['us','ca','mx'].map(cc => (
                <img key={cc} src={`https://flagcdn.com/w40/${cc}.png`} alt={cc}
                  style={{ width: 34, height: 22, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border)' }} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6 }}>
          {TABS.map(({ key, label, Icon }) => {
            const active = tab === key
            return (
              <motion.button
                key={key}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleTab(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '8px 18px', borderRadius: 12,
                  fontSize: 13, fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid ' + (active ? 'rgba(255,255,255,0.2)' : 'var(--border)'),
                  outline: 'none',
                  background: active ? 'rgba(255,255,255,0.1)' : 'var(--surface)',
                  color: active ? '#fff' : 'var(--text-2)',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                <Icon size={14} />
                {label}
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

        <AnimatePresence mode="wait">
          {/* Knockouts */}
          {tab === 'knockouts' && (
            <motion.div
              key="knockouts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <KnockoutsTab />
            </motion.div>
          )}

          {/* Groups */}
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
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}
            >
              {loading && Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ height: 52, padding: '0 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 10, borderRadius: 4, background: 'var(--surface2)' }} />
                  <div style={{ flex: 1, height: 10, borderRadius: 4, background: 'var(--surface2)' }} />
                  <div style={{ width: 50, height: 24, borderRadius: 8, background: 'var(--surface2)' }} />
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

          {/* Top Scorers */}
          {tab === 'scorers' && (
            <motion.div
              key="scorers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}
            >
              <div style={{
                padding: '12px 16px', borderBottom: '1px solid var(--border)',
                background: 'var(--surface2)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <Target size={16} color="var(--text-2)" />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>Top Scorers — World Cup 2026</span>
              </div>
              {scorersLoading && Array.from({ length: 10 }).map((_, i) => <ScorerSkeleton key={i} />)}
              {!scorersLoading && scorers.length === 0 && (
                <div style={{ padding: '52px 0', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-2)', fontSize: 13 }}>Маълумот дастрас нест</p>
                </div>
              )}
              {!scorersLoading && scorers.map((player, i) => (
                <ScorerRow
                  key={player.player.id}
                  player={player}
                  rank={i + 1}
                  value={player.statistics?.[0]?.goals?.total ?? 0}
                  valueLabel="GOALS"
                />
              ))}
            </motion.div>
          )}

          {/* Top Assists */}
          {tab === 'assists' && (
            <motion.div
              key="assists"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}
            >
              <div style={{
                padding: '12px 16px', borderBottom: '1px solid var(--border)',
                background: 'var(--surface2)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <Share2 size={16} color="var(--text-2)" />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>Top Assists — World Cup 2026</span>
              </div>
              {assistsLoading && Array.from({ length: 10 }).map((_, i) => <ScorerSkeleton key={i} />)}
              {!assistsLoading && assists.length === 0 && (
                <div style={{ padding: '52px 0', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-2)', fontSize: 13 }}>Маълумот дастрас нест</p>
                </div>
              )}
              {!assistsLoading && assists.map((player, i) => (
                <ScorerRow
                  key={player.player.id}
                  player={player}
                  rank={i + 1}
                  value={player.statistics?.[0]?.goals?.assists ?? 0}
                  valueLabel="ASSISTS"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
