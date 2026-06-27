import { NavLink } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  Shield,
  Users,
  Zap,
  Trophy,
  Globe2,
  Tv,
} from 'lucide-react'

const links = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/worldcup',  icon: Globe2,          label: 'World Cup',  badge: '🔴' },
  { to: '/watch',     icon: Tv,              label: 'Watch Live', live: true   },
  { to: '/matches',   icon: CalendarDays,    label: 'Matches'    },
  { to: '/leagues',   icon: Trophy,          label: 'Leagues'    },
  { to: '/standings', icon: BarChart3,       label: 'Standings'  },
  { to: '/teams',     icon: Shield,          label: 'Teams'      },
  { to: '/players',   icon: Users,           label: 'Players'    },
]

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: 256,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sidebar-bg)',
        backdropFilter: 'blur(24px)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '24px 24px 20px' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
          boxShadow: '0 0 20px rgba(124,58,237,0.4)',
        }}>
          <Zap size={18} color="#fff" fill="#fff" />
        </div>
        <div>
          <p style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: 14, lineHeight: 1.2 }}>FootballStat</p>
          <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>Live · Stats · More</p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {links.map(({ to, icon: Icon, label, badge, live }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
          >
            {({ isActive }) => (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 16px',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: isActive
                  ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
                  : 'transparent',
                color: isActive ? '#fff' : 'var(--text-2)',
                boxShadow: isActive ? '0 0 16px rgba(124,58,237,0.35)' : 'none',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--surface2)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <Icon size={17} strokeWidth={isActive ? 2.5 : 1.8} />
                <span>{label}</span>
                {badge && !isActive && (
                  <span style={{ marginLeft: 'auto', fontSize: 8 }}>{badge}</span>
                )}
                {live && !isActive && (
                  <span style={{
                    marginLeft: 'auto',
                    padding: '2px 6px', borderRadius: 6,
                    background: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.35)',
                    fontSize: 9, fontWeight: 800, color: '#ef4444',
                    letterSpacing: '0.06em',
                  }}>LIVE</span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    style={{
                      marginLeft: 'auto',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#fff',
                    }}
                  />
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px 20px' }}>
        <div style={{
          borderRadius: 12,
          padding: 12,
          textAlign: 'center',
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
        }}>
          <p style={{ fontSize: 11, color: 'var(--text-3)' }}>Powered by</p>
          <p style={{ fontSize: 11, fontWeight: 700, background: 'linear-gradient(135deg,#a78bfa,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>API-Football</p>
        </div>
      </div>
    </motion.aside>
  )
}
