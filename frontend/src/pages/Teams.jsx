import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, Shield } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { teamsAPI } from '../services/api'
import { Skeleton } from '../components/ui/Skeleton'
import Topbar from '../components/layout/Topbar'

const LEAGUES = [
  { id: 39,  name: 'Premier League' },
  { id: 140, name: 'La Liga'        },
  { id: 135, name: 'Serie A'        },
  { id: 78,  name: 'Bundesliga'     },
  { id: 61,  name: 'Ligue 1'        },
]

export default function Teams() {
  const [league, setLeague] = useState(39)
  const { data, loading }   = useApi(() => teamsAPI.getList({ league, season: 2024 }), [league])
  const teams = data?.response ?? []

  return (
    <div>
      <Topbar title="Teams" />

      <div style={{ padding: '24px 32px' }}>
        {/* League filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {LEAGUES.map(l => (
            <button
              key={l.id}
              onClick={() => setLeague(l.id)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
              style={{
                background: league === l.id
                  ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
                  : 'rgba(21,21,58,0.7)',
                color: league === l.id ? '#fff' : '#94a3b8',
                border: '1px solid ' + (league === l.id ? 'transparent' : 'rgba(124,58,237,0.15)'),
              }}
            >
              <Shield size={13} />
              {l.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="glass p-5 flex flex-col items-center gap-3">
                <Skeleton className="w-16 h-16 rounded-2xl" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2 w-16" />
              </div>
            ))
            : teams.map(({ team, venue }, i) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link to={`/teams/${team.id}`}>
                  <div className="glass hover-card p-5 flex flex-col items-center gap-3 text-center cursor-pointer">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center p-2.5"
                      style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}
                    >
                      <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white">{team.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{team.country}</p>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      {team.founded && (
                        <div className="flex items-center gap-1.5 justify-center">
                          <Calendar size={11} className="text-slate-500" />
                          <span className="text-xs text-slate-500">Est. {team.founded}</span>
                        </div>
                      )}
                      {venue?.name && (
                        <div className="flex items-center gap-1.5 justify-center">
                          <MapPin size={11} className="text-purple-400" />
                          <span className="text-xs text-purple-400 truncate max-w-[110px]">
                            {venue.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
