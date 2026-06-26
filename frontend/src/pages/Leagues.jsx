import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Trophy, Globe } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { leaguesAPI } from '../services/api'
import Topbar from '../components/layout/Topbar'
import { Skeleton } from '../components/ui/Skeleton'

export default function Leagues() {
  const { data, loading } = useApi(() => leaguesAPI.getAll(), [])
  const leagues = data?.response ?? []

  return (
    <div style={{ minHeight: '100vh' }}>
      <Topbar title="Leagues" />

      <div style={{ padding: '24px 32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}>
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{
                padding: 20, borderRadius: 16,
                background: 'rgba(16,16,42,0.75)',
                border: '1px solid rgba(124,58,237,0.12)',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <Skeleton style={{ width: 52, height: 52, borderRadius: 12 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Skeleton style={{ height: 14, width: '70%' }} />
                  <Skeleton style={{ height: 11, width: '45%' }} />
                </div>
              </div>
            ))
            : leagues.map((item, i) => (
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
                      e.currentTarget.style.border = '1px solid rgba(124,58,237,0.4)'
                      e.currentTarget.style.background = 'rgba(124,58,237,0.08)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.border = '1px solid rgba(124,58,237,0.12)'
                      e.currentTarget.style.background = 'rgba(16,16,42,0.75)'
                    }}
                  >
                    {/* Logo */}
                    <div style={{
                      width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(124,58,237,0.1)',
                      border: '1px solid rgba(124,58,237,0.2)',
                      padding: 8,
                    }}>
                      <img
                        src={item.logo}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={e => { e.target.style.opacity = 0 }}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        {item.flag && (
                          <img src={item.flag} alt="" style={{ width: 16, height: 11, objectFit: 'cover', borderRadius: 2 }} />
                        )}
                        <span style={{ fontSize: 12, color: '#64748b' }}>{item.country}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 600, color: '#a78bfa',
                          background: 'rgba(124,58,237,0.15)',
                          padding: '2px 7px', borderRadius: 999, marginLeft: 4,
                        }}>
                          {item.type === 'League' ? 'League' : 'Cup'}
                        </span>
                      </div>
                    </div>

                    <Trophy size={16} style={{ color: '#7c3aed', flexShrink: 0 }} />
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
