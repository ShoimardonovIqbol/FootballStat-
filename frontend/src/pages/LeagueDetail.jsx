import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Goal, Footprints, Square, CalendarDays, ArrowLeft } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { leaguesAPI, matchesAPI, playersAPI } from '../services/api'
import MatchCard from '../components/ui/MatchCard'
import { MatchCardSkeleton, PlayerSkeleton } from '../components/ui/Skeleton'
import Topbar from '../components/layout/Topbar'

const TABS = [
  { key: 'matches',  label: 'Matches',     icon: CalendarDays },
  { key: 'scorers',  label: 'Top Goals',   icon: Goal         },
  { key: 'assists',  label: 'Top Assists', icon: Footprints   },
  { key: 'redcards', label: 'Red Cards',   icon: Square       },
]

const RANK_COLOR = ['#f59e0b', '#94a3b8', '#b45309']

function StatRow({ item, rank, statKey }) {
  const stats = item?.statistics?.[0]
  const val = statKey === 'scorers'  ? stats?.goals?.total
            : statKey === 'assists'  ? stats?.goals?.assists
            : statKey === 'redcards' ? stats?.cards?.red
            : 0

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.03 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '2rem 3rem 1fr 4rem',
        alignItems: 'center',
        padding: '10px 16px',
        borderBottom: '1px solid rgba(124,58,237,0.07)',
        transition: 'background 0.15s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ fontSize: 12, fontWeight: 700, color: rank <= 3 ? RANK_COLOR[rank - 1] : '#475569' }}>
        {rank}
      </span>

      <img
        src={item?.player?.photo}
        alt={item?.player?.name}
        style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(124,58,237,0.3)' }}
        onError={e => {
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item?.player?.name || '?')}&background=7c3aed&color=fff&size=34`
        }}
      />

      <div style={{ paddingLeft: 10, overflow: 'hidden' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
          {item?.player?.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
          {stats?.team?.logo && (
            <img src={stats.team.logo} alt="" style={{ width: 13, height: 13, objectFit: 'contain' }} />
          )}
          <span style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {stats?.team?.name}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 800, color: '#fff',
          background: statKey === 'redcards'
            ? 'rgba(244,63,94,0.25)'
            : 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(79,70,229,0.3))',
          border: statKey === 'redcards'
            ? '1px solid rgba(244,63,94,0.4)'
            : '1px solid rgba(124,58,237,0.35)',
        }}>
          {val ?? 0}
        </div>
      </div>
    </motion.div>
  )
}

export default function LeagueDetail() {
  const { id } = useParams()
  const leagueId = Number(id)
  const [tab, setTab] = useState('matches')

  const leagueInfo = useApi(() => leaguesAPI.getById(leagueId), [leagueId])
  const matches    = useApi(() => matchesAPI.getList({ league: leagueId, season: 2024, last: 20 }), [leagueId])
  const scorers    = useApi(() => playersAPI.getTopScorers(leagueId, 2024), [leagueId])
  const assists    = useApi(() => playersAPI.getTopAssists(leagueId, 2024), [leagueId])
  const redcards   = useApi(() => playersAPI.getTopRedCards(leagueId, 2024), [leagueId])

  const league  = leagueInfo.data?.league
  const country = leagueInfo.data?.country

  const tabData = {
    matches:  matches.data?.response  ?? [],
    scorers:  scorers.data?.response  ?? [],
    assists:  assists.data?.response  ?? [],
    redcards: redcards.data?.response ?? [],
  }
  const tabLoading = {
    matches:  matches.loading,
    scorers:  scorers.loading,
    assists:  assists.loading,
    redcards: redcards.loading,
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Topbar title={league?.name ?? 'League'} />

      <div style={{ padding: '20px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* League header banner */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            padding: '20px 24px',
            borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.08))',
            border: '1px solid rgba(124,58,237,0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Glow */}
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 200, height: 200, borderRadius: '50%',
            background: '#7c3aed', opacity: 0.07, filter: 'blur(40px)',
            pointerEvents: 'none',
          }} />

          {/* Back button */}
          <Link to="/leagues" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            >
              <ArrowLeft size={16} style={{ color: '#94a3b8' }} />
            </div>
          </Link>

          {/* Logo */}
          {league?.logo && (
            <div style={{
              width: 64, height: 64, borderRadius: 16, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: 10,
            }}>
              <img src={league.logo} alt={league.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          )}

          {/* Name + country */}
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>
              {league?.name ?? '...'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              {country?.flag && (
                <img src={country.flag} alt="" style={{ width: 20, height: 14, objectFit: 'cover', borderRadius: 2 }} />
              )}
              <span style={{ fontSize: 13, color: '#94a3b8' }}>{country?.name}</span>
              <span style={{
                fontSize: 11, fontWeight: 600, color: '#a78bfa',
                background: 'rgba(124,58,237,0.2)',
                padding: '2px 10px', borderRadius: 999,
              }}>Season 2024/25</span>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8 }}>
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 18px', borderRadius: 12,
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                outline: 'none',
                background: tab === key
                  ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
                  : 'rgba(21,21,58,0.7)',
                color: tab === key ? '#fff' : '#64748b',
                border: '1px solid ' + (tab === key ? 'transparent' : 'rgba(124,58,237,0.2)'),
                boxShadow: tab === key ? '0 0 16px rgba(124,58,237,0.35)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'matches' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tabLoading.matches
                  ? Array.from({ length: 6 }).map((_, i) => <MatchCardSkeleton key={i} />)
                  : tabData.matches.length === 0
                  ? (
                    <div style={{
                      padding: '48px 0', textAlign: 'center',
                      background: 'rgba(16,16,42,0.7)',
                      border: '1px solid rgba(124,58,237,0.12)',
                      borderRadius: 16,
                    }}>
                      <CalendarDays size={36} style={{ color: '#334155', margin: '0 auto 10px' }} />
                      <p style={{ color: '#64748b', fontSize: 14 }}>No matches found</p>
                    </div>
                  )
                  : tabData.matches.map((m, i) => (
                    <MatchCard key={m.fixture.id} fixture={m} index={i} />
                  ))
                }
              </div>
            ) : (
              <div style={{
                background: 'rgba(16,16,42,0.75)',
                border: '1px solid rgba(124,58,237,0.15)',
                borderRadius: 16,
                overflow: 'hidden',
              }}>
                {/* Table header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2rem 3rem 1fr 4rem',
                  padding: '10px 16px',
                  fontSize: 11, fontWeight: 600, color: '#64748b',
                  borderBottom: '1px solid rgba(124,58,237,0.12)',
                  background: 'rgba(124,58,237,0.05)',
                }}>
                  <span>#</span>
                  <span />
                  <span style={{ paddingLeft: 10 }}>Player</span>
                  <span style={{ textAlign: 'center' }}>
                    {tab === 'scorers' ? 'Goals' : tab === 'assists' ? 'Assists' : 'Red'}
                  </span>
                </div>

                {tabLoading[tab]
                  ? Array.from({ length: 10 }).map((_, i) => <PlayerSkeleton key={i} />)
                  : tabData[tab].map((item, i) => (
                    <StatRow key={item.player.id} item={item} rank={i + 1} statKey={tab} />
                  ))
                }
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  )
}
