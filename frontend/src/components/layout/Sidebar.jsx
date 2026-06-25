import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  Shield,
  Users,
  Zap,
} from 'lucide-react'

const links = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/matches',   icon: CalendarDays,    label: 'Matches'   },
  { to: '/standings', icon: BarChart3,       label: 'Standings' },
  { to: '/teams',     icon: Shield,          label: 'Teams'     },
  { to: '/players',   icon: Users,           label: 'Players'   },
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
        background: 'rgba(8,8,23,0.92)',
        backdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(124,58,237,0.15)',
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
          <p style={{ fontWeight: 700, color: '#fff', fontSize: 14, lineHeight: 1.2 }}>FootballStat</p>
          <p style={{ fontSize: 11, color: '#a78bfa', marginTop: 2 }}>Live · Stats · More</p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {links.map(({ to, icon: Icon, label }) => (
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
                color: isActive ? '#fff' : '#94a3b8',
                boxShadow: isActive ? '0 0 16px rgba(124,58,237,0.35)' : 'none',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <Icon size={17} strokeWidth={isActive ? 2.5 : 1.8} />
                <span>{label}</span>
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
          background: 'rgba(124,58,237,0.1)',
          border: '1px solid rgba(124,58,237,0.2)',
        }}>
          <p style={{ fontSize: 11, color: '#64748b' }}>Powered by</p>
          <p style={{ fontSize: 11, fontWeight: 700, background: 'linear-gradient(135deg,#a78bfa,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>API-Football</p>
        </div>
      </div>
    </motion.aside>
  )
}
