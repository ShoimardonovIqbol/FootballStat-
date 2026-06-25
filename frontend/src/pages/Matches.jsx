import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApi } from '../hooks/useApi'
import { matchesAPI } from '../services/api'
import MatchCard from '../components/ui/MatchCard'
import { MatchCardSkeleton } from '../components/ui/Skeleton'
import Topbar from '../components/layout/Topbar'

const TABS = ['Today', 'Live', 'All']

export default function Matches() {
  const [tab, setTab] = useState('Today')

  const today   = useApi(() => matchesAPI.getToday(), [])
  const live    = useApi(() => matchesAPI.getLive(), [])
  const all     = useApi(() => matchesAPI.getList({ league: 39, season: 2024 }), [])

  const source = tab === 'Today' ? today : tab === 'Live' ? live : all

  const grouped = (() => {
    if (tab === 'Today' && today.data?.leagues) return today.data.leagues
    const fixtures = (tab === 'Live' ? live.data?.response : all.data?.response) ?? []
    const g = {}
    fixtures.forEach(f => {
      const id = f.league.id
      if (!g[id]) g[id] = { league: f.league, fixtures: [] }
      g[id].fixtures.push(f)
    })
    return Object.values(g)
  })()

  return (
    <div>
      <Topbar title="Matches" />

      <div className="px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="relative px-5 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                color: tab === t ? '#fff' : '#64748b',
                background: tab === t ? undefined : 'rgba(21,21,58,0.6)',
              }}
            >
              {tab === t && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 rounded-xl gradient-purple"
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {t === 'Live' && <div className="live-dot w-1.5 h-1.5" />}
                {t}
                {t === 'Live' && live.data && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">
                    {live.data.results}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {source.loading
              ? [0,1,2].map(i => (
                <div key={i} className="glass p-4 space-y-3">
                  {[0,1,2].map(j => <MatchCardSkeleton key={j} />)}
                </div>
              ))
              : grouped.length === 0
              ? (
                <div className="glass p-12 text-center">
                  <p className="text-4xl mb-3">⚽</p>
                  <p className="text-slate-400">No matches found</p>
                </div>
              )
              : grouped.map(({ league, fixtures }) => (
                <div key={league.id} className="glass p-4">
                  <div className="flex items-center gap-2.5 mb-4 pb-3"
                    style={{ borderBottom: '1px solid rgba(124,58,237,0.12)' }}>
                    <img src={league.logo || league.flag} alt="" className="w-6 h-6 object-contain" />
                    <div>
                      <p className="text-sm font-bold text-white">{league.name}</p>
                      <p className="text-xs text-slate-500">{league.country} · {league.round}</p>
                    </div>
                    <span className="ml-auto text-xs text-purple-400 font-medium">
                      {fixtures.length} matches
                    </span>
                  </div>
                  <div className="space-y-2">
                    {fixtures.map((m, i) => (
                      <MatchCard key={m.fixture.id} fixture={m} index={i} />
                    ))}
                  </div>
                </div>
              ))
            }
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
