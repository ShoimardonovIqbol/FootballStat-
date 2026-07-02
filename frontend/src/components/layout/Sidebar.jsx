import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, CalendarDays, BarChart3, Shield,
  Users, Trophy, Globe2, Tv, Star, Newspaper,
} from 'lucide-react'
import { useFavorites } from '../../context/FavoritesContext'

const links = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/worldcup',  icon: Globe2,          label: 'World Cup',  badge: 'WC' },
  { to: '/watch',     icon: Tv,              label: 'Watch Live', live: true   },
  { to: '/news',      icon: Newspaper,       label: 'News'        },
  { to: '/matches',   icon: CalendarDays,    label: 'Matches'     },
  { to: '/leagues',   icon: Trophy,          label: 'Leagues'     },
  { to: '/standings', icon: BarChart3,       label: 'Standings'   },
  { to: '/teams',     icon: Shield,          label: 'Teams'       },
  { to: '/players',   icon: Users,           label: 'Players'     },
  { to: '/favorites', icon: Star,            label: 'Favorites',  favCount: true },
]

export default function Sidebar() {
  const { teams, players } = useFavorites()
  const favTotal = teams.length + players.length

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0,
      height: '100vh', width: 240, zIndex: 50,
      display: 'flex', flexDirection: 'column',
      background: 'var(--sidebar-bg)',
      borderRight: '1px solid var(--border)',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#fff',
          }}>
            <span style={{ fontSize: 16, fontWeight: 900, color: '#0e0e0e', fontFamily: 'system-ui' }}>F</span>
          </div>
          <div>
            <p style={{ fontWeight: 800, color: '#fff', fontSize: 15, lineHeight: 1.1, letterSpacing: '-0.3px' }}>FootballStat</p>
            <p style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2, letterSpacing: '0.04em' }}>LIVE · STATS · MORE</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px', display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto' }}>
        {links.map(({ to, icon: Icon, label, badge, live, favCount }) => (
          <NavLink key={to} to={to} end={to === '/'} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8,
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                cursor: 'pointer', transition: 'background 0.15s, color 0.15s',
                background: isActive ? 'rgba(255,255,255,0.09)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-2)',
                borderLeft: isActive ? '2px solid #fff' : '2px solid transparent',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff' } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)' } }}
              >
                <Icon size={16} strokeWidth={isActive ? 2.2 : 1.7} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{label}</span>

                {badge && !isActive && (
                  <span style={{
                    fontSize: 9, fontWeight: 800, letterSpacing: '0.06em',
                    padding: '1px 5px', borderRadius: 4,
                    background: 'rgba(63,202,122,0.15)',
                    border: '1px solid rgba(63,202,122,0.3)',
                    color: '#3fca7a',
                  }}>{badge}</span>
                )}

                {live && !isActive && (
                  <span style={{
                    fontSize: 9, fontWeight: 800, letterSpacing: '0.06em',
                    padding: '1px 5px', borderRadius: 4,
                    background: 'rgba(239,68,68,0.12)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    color: '#ef4444',
                  }}>LIVE</span>
                )}

                {favCount && favTotal > 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    padding: '1px 6px', borderRadius: 99,
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                  }}>{favTotal}</span>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 16px 16px', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: 10, color: 'var(--text-3)', textAlign: 'center' }}>
          Powered by <span style={{ color: 'var(--text-2)', fontWeight: 600 }}>API-Football</span>
        </p>
      </div>
    </aside>
  )
}
