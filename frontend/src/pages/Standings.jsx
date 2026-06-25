import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { standingsAPI } from '../services/api'
import { Skeleton } from '../components/ui/Skeleton'
import Topbar from '../components/layout/Topbar'

const LEAGUES = [
  { id: 39,  name: 'Premier League' },
  { id: 140, name: 'La Liga'        },
  { id: 135, name: 'Serie A'        },
  { id: 78,  name: 'Bundesliga'     },
  { id: 61,  name: 'Ligue 1'        },
  { id: 2,   name: 'UCL'            },
]

const FORM_COLOR = { W: '#22d47a', D: '#f59e0b', L: '#f43f5e' }

function FormBadge({ result }) {
  return (
    <span
      className="w-5 h-5 rounded text-xs font-bold flex items-center justify-center"
      style={{ background: FORM_COLOR[result] + '33', color: FORM_COLOR[result] }}
    >
      {result}
    </span>
  )
}

export default function Standings() {
  const [leagueId, setLeagueId] = useState(39)
  const { data, loading } = useApi(() => standingsAPI.get(leagueId, 2024), [leagueId])

  const table      = data?.response?.[0]?.league?.standings?.[0] ?? []
  const leagueInfo = data?.response?.[0]?.league

  return (
    <div>
      <Topbar title="Standings" />

      <div style={{ padding: '24px 32px' }}>
        {/* League picker */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {LEAGUES.map(l => (
            <button
              key={l.id}
              onClick={() => setLeagueId(l.id)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
              style={{
                background: leagueId === l.id
                  ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
                  : 'rgba(21,21,58,0.7)',
                color: leagueId === l.id ? '#fff' : '#94a3b8',
                border: '1px solid ' + (leagueId === l.id ? 'transparent' : 'rgba(124,58,237,0.15)'),
              }}
            >
              <Trophy size={13} />
              {l.name}
            </button>
          ))}
        </div>

        <div className="glass overflow-hidden">
          {leagueInfo && (
            <div className="flex items-center gap-3 px-5 py-4"
              style={{ borderBottom: '1px solid rgba(124,58,237,0.15)' }}>
              <img src={leagueInfo.logo} alt="" className="w-8 h-8 object-contain" />
              <div>
                <p className="font-bold text-white">{leagueInfo.name}</p>
                <p className="text-xs text-slate-500">Season 2024/25</p>
              </div>
            </div>
          )}

          {/* Column headers */}
          <div
            className="grid text-xs text-slate-500 font-medium px-5 py-3"
            style={{
              gridTemplateColumns: '2rem 2.5rem 1fr 2rem 2rem 2rem 2rem 2rem 2rem 5rem 4rem',
              borderBottom: '1px solid rgba(124,58,237,0.1)',
            }}
          >
            <span>#</span><span /><span>Club</span>
            <span className="text-center">P</span>
            <span className="text-center">W</span>
            <span className="text-center">D</span>
            <span className="text-center">L</span>
            <span className="text-center">GF</span>
            <span className="text-center">GD</span>
            <span className="text-center">Form</span>
            <span className="text-center text-purple-400 font-bold">Pts</span>
          </div>

          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <Skeleton className="w-5 h-3" />
                <Skeleton className="w-7 h-7 rounded-full" />
                <Skeleton className="h-3 flex-1" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))
            : table.map((row, i) => (
              <motion.div
                key={row.team.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="grid items-center px-5 py-3 hover:bg-white/5 transition"
                style={{
                  gridTemplateColumns: '2rem 2.5rem 1fr 2rem 2rem 2rem 2rem 2rem 2rem 5rem 4rem',
                  borderBottom: '1px solid rgba(124,58,237,0.06)',
                  background: i < 4 ? 'rgba(124,58,237,0.04)' : undefined,
                }}
              >
                <span className="text-xs font-bold text-slate-400">{row.rank}</span>
                <Link to={`/teams/${row.team.id}`}>
                  <img src={row.team.logo} alt="" className="w-7 h-7 object-contain hover:scale-110 transition" />
                </Link>
                <Link to={`/teams/${row.team.id}`}
                  className="text-sm text-slate-200 hover:text-purple-300 transition truncate">
                  {row.team.name}
                </Link>
                <span className="text-xs text-center text-slate-400">{row.all.played}</span>
                <span className="text-xs text-center text-green-400">{row.all.win}</span>
                <span className="text-xs text-center text-yellow-400">{row.all.draw}</span>
                <span className="text-xs text-center text-red-400">{row.all.lose}</span>
                <span className="text-xs text-center text-slate-400">{row.all.goals.for}</span>
                <span className={`text-xs text-center font-medium ${
                  row.goalsDiff > 0 ? 'text-green-400' : row.goalsDiff < 0 ? 'text-red-400' : 'text-slate-400'
                }`}>
                  {row.goalsDiff > 0 ? '+' : ''}{row.goalsDiff}
                </span>
                <div className="flex gap-0.5 justify-center">
                  {row.form?.split('').slice(-5).map((r, j) => <FormBadge key={j} result={r} />)}
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold text-white">{row.points}</span>
                </div>
              </motion.div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
