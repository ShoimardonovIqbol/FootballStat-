import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import Topbar from '../components/layout/Topbar'

const LEAGUES = [
  { id: 39,  name: 'Premier League',        country: 'England',      flag: 'https://media.api-sports.io/flags/gb.svg'  },
  { id: 140, name: 'La Liga',               country: 'Spain',        flag: 'https://media.api-sports.io/flags/es.svg'  },
  { id: 135, name: 'Serie A',               country: 'Italy',        flag: 'https://media.api-sports.io/flags/it.svg'  },
  { id: 78,  name: 'Bundesliga',            country: 'Germany',      flag: 'https://media.api-sports.io/flags/de.svg'  },
  { id: 61,  name: 'Ligue 1',              country: 'France',       flag: 'https://media.api-sports.io/flags/fr.svg'  },
  { id: 2,   name: 'UEFA Champions League', country: 'World',        flag: null                                        },
  { id: 3,   name: 'UEFA Europa League',    country: 'World',        flag: null                                        },
  { id: 1,   name: 'World Cup',             country: 'World',        flag: null                                        },
  { id: 4,   name: 'Euro Championship',     country: 'World',        flag: null                                        },
  { id: 9,   name: 'Copa America',          country: 'World',        flag: null                                        },
  { id: 88,  name: 'Eredivisie',            country: 'Netherlands',  flag: 'https://media.api-sports.io/flags/nl.svg'  },
  { id: 94,  name: 'Primeira Liga',         country: 'Portugal',     flag: 'https://media.api-sports.io/flags/pt.svg'  },
  { id: 40,  name: 'Championship',          country: 'England',      flag: 'https://media.api-sports.io/flags/gb.svg'  },
  { id: 253, name: 'Major League Soccer',   country: 'USA',          flag: 'https://media.api-sports.io/flags/us.svg'  },
  { id: 262, name: 'Liga MX',              country: 'Mexico',       flag: 'https://media.api-sports.io/flags/mx.svg'  },
  { id: 307, name: 'Pro League',            country: 'Saudi Arabia', flag: 'https://media.api-sports.io/flags/sa.svg'  },
  { id: 143, name: 'Copa del Rey',          country: 'Spain',        flag: 'https://media.api-sports.io/flags/es.svg'  },
]

const TIER_COLORS = {
  2:   '#f59e0b',
  3:   '#f97316',
  1:   '#22d47a',
  4:   '#6366f1',
  9:   '#ec4899',
}

export default function Leagues() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Topbar title="Leagues" />

      <div style={{ padding: '24px 32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
        }}>
          {LEAGUES.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link to={`/leagues/${item.id}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '16px 20px',
                    borderRadius: 16,
                    background: 'rgba(16,16,42,0.75)',
                    border: '1px solid rgba(124,58,237,0.12)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.border = '1px solid rgba(124,58,237,0.45)'
                    e.currentTarget.style.background = 'rgba(124,58,237,0.09)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.border = '1px solid rgba(124,58,237,0.12)'
                    e.currentTarget.style.background = 'rgba(16,16,42,0.75)'
                    e.currentTarget.style.transform = 'none'
                  }}
                >
                  {/* Logo */}
                  <div style={{
                    width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(124,58,237,0.1)',
                    border: '1px solid rgba(124,58,237,0.18)',
                    padding: 9,
                  }}>
                    <img
                      src={`https://media.api-sports.io/football/leagues/${item.id}.png`}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={e => { e.target.style.opacity = 0.2 }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: 0,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {item.name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
                      {item.flag && (
                        <img
                          src={item.flag}
                          alt=""
                          style={{ width: 18, height: 12, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }}
                          onError={e => { e.target.style.display = 'none' }}
                        />
                      )}
                      <span style={{ fontSize: 12, color: '#64748b' }}>{item.country}</span>
                    </div>
                  </div>

                  <Trophy
                    size={15}
                    style={{ color: TIER_COLORS[item.id] || '#7c3aed', flexShrink: 0 }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
