import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApi } from '../hooks/useApi'
import { playersAPI } from '../services/api'
import PlayerCard from '../components/ui/PlayerCard'
import { PlayerSkeleton } from '../components/ui/Skeleton'
import Topbar from '../components/layout/Topbar'

const TABS = [
  { key: 'scorers',  label: '⚽ Top Scorers',  stat: 'goals'   },
  { key: 'assists',  label: '🅰️ Top Assists',  stat: 'assists' },
]

const LEAGUES = [
  { id: 39,  name: 'Premier League' },
  { id: 140, name: 'La Liga' },
  { id: 135, name: 'Serie A' },
  { id: 78,  name: 'Bundesliga' },
  { id: 61,  name: 'Ligue 1' },
]

export default function Players() {
  const [tab, setTab]       = useState('scorers')
  const [league, setLeague] = useState(39)

  const scorers = useApi(() => playersAPI.getTopScorers(league, 2024), [league])
  const assists = useApi(() => playersAPI.getTopAssists(league, 2024), [league])

  const current = tab === 'scorers' ? scorers : assists
  const currentStat = TABS.find(t => t.key === tab)?.stat ?? 'goals'
  const players = current.data?.response ?? []

  return (
    <div>
      <Topbar title="Players" />

      <div className="px-8 py-6">
        {/* League filter */}
        <div className="flex gap-2 flex-wrap mb-5">
          {LEAGUES.map(l => (
            <button
              key={l.id}
              onClick={() => setLeague(l.id)}
              className="px-4 py-1.5 rounded-xl text-xs font-medium transition-all"
              style={{
                background: league === l.id
                  ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
                  : 'rgba(21,21,58,0.7)',
                color: league === l.id ? '#fff' : '#94a3b8',
                border: '1px solid ' + (league === l.id ? 'transparent' : 'rgba(124,58,237,0.15)'),
              }}
            >
              {l.name}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="relative px-5 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                color: tab === t.key ? '#fff' : '#64748b',
                background: tab === t.key ? undefined : 'rgba(21,21,58,0.6)',
              }}
            >
              {tab === t.key && (
                <motion.div
                  layoutId="player-tab-bg"
                  className="absolute inset-0 rounded-xl gradient-purple"
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Podium (top 3) */}
        {!current.loading && players.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mb-8">
            {[players[1], players[0], players[2]].map((item, pos) => {
              const heights = [36, 48, 32]
              const ranks   = [2, 1, 3]
              const medals  = ['🥈','🥇','🥉']
              const stats   = item.statistics?.[0]
              const val     = currentStat === 'goals' ? stats?.goals?.total : stats?.goals?.assists

              return (
                <motion.div
                  key={item.player.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: pos * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-2xl mb-1">{medals[pos]}</span>
                  <img
                    src={item.player.photo}
                    alt={item.player.name}
                    className="w-16 h-16 rounded-full object-cover mb-2"
                    style={{ border: '3px solid rgba(124,58,237,0.6)' }}
                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${item.player.name}&background=7c3aed&color=fff` }}
                  />
                  <p className="text-xs font-bold text-white text-center max-w-[80px] truncate">
                    {item.player.name}
                  </p>
                  <div
                    className="flex items-center justify-center mt-2 rounded-lg gradient-purple"
                    style={{ width: '100%', height: `${heights[pos]}px`, minWidth: 80 }}
                  >
                    <span className="text-lg font-bold text-white">{val ?? 0}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Full list */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab + league}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass"
          >
            <div className="flex text-xs text-slate-500 px-4 py-3 font-medium"
              style={{ borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
              <span className="w-8">#</span>
              <span className="flex-1">Player</span>
              <span className="w-20 text-right">{currentStat === 'goals' ? 'Goals' : 'Assists'}</span>
            </div>
            {current.loading
              ? Array.from({ length: 10 }).map((_, i) => <PlayerSkeleton key={i} />)
              : players.map((item, i) => (
                <PlayerCard
                  key={item.player.id}
                  item={item}
                  rank={i + 1}
                  stat={currentStat}
                />
              ))
            }
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
