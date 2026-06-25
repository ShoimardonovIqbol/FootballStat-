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
      className="fixed left-0 top-0 h-screen w-64 z-50 flex flex-col"
      style={{
        background: 'rgba(8,8,23,0.92)',
        backdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(124,58,237,0.15)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 mb-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center gradient-purple glow-purple">
          <Zap size={18} color="#fff" fill="#fff" />
        </div>
        <div>
          <p className="font-bold text-white text-sm leading-tight">FootballStat</p>
          <p className="text-xs" style={{ color: '#a78bfa' }}>Live · Stats · More</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
               ${isActive
                 ? 'gradient-purple text-white glow-purple'
                 : 'text-slate-400 hover:bg-white/5 hover:text-white'}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={17}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={isActive ? 'text-white' : 'text-slate-400'}
                />
                <span>{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-5">
        <div
          className="rounded-xl p-3 text-center"
          style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}
        >
          <p className="text-xs text-slate-400">Powered by</p>
          <p className="text-xs font-semibold gradient-text">API-Football</p>
        </div>
      </div>
    </motion.aside>
  )
}
