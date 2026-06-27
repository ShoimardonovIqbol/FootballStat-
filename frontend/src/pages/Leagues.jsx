import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import Topbar from '../components/layout/Topbar'

const LEAGUES = [
  { id: 39,  name: 'Premier League',        country: 'England', flag: 'https://media.api-sports.io/flags/gb.svg' },
  { id: 140, name: 'La Liga',               country: 'Spain',   flag: 'https://media.api-sports.io/flags/es.svg' },
  { id: 135, name: 'Serie A',               country: 'Italy',   flag: 'https://media.api-sports.io/flags/it.svg' },
  { id: 61,  name: 'Ligue 1',              country: 'France',  flag: 'https://media.api-sports.io/flags/fr.svg' },
  { id: 1,   name: 'World Cup',             country: 'World',   flag: null                                       },
  { id: 2,   name: 'UEFA Champions League', country: 'World',   flag: null                                       },
  { id: 3,   name: 'UEFA Europa League',    country: 'World',   flag: null                                       },
]

/* Stagger container + card variants */
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.055, delayChildren: 0.05 }
  }
}
const card = {
  hidden: { opacity: 0, y: 28, scale: 0.94 },
  show:   {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 22 }
  }
}

export default function Leagues() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Topbar title="Leagues" />

      <div style={{ padding: '24px 32px' }}>

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 20 }}
        >
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
            {LEAGUES.length} Competitions
          </h2>
        </motion.div>

        {/* Stagger grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}
        >
          {LEAGUES.map((item) => (
            <motion.div key={item.id} variants={card}>
              <Link to={`/leagues/${item.id}`} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -3, borderColor: 'rgba(124,58,237,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '16px 20px',
                    borderRadius: 16,
                    background: 'rgba(16,16,42,0.75)',
                    border: '1px solid rgba(124,58,237,0.12)',
                    cursor: 'pointer',
                    backdropFilter: 'blur(12px)',
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
                      onError={e => { e.target.style.opacity = 0.15 }}
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

                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: Math.random() * 2 }}
                  >
                    <Trophy size={15} style={{ color: '#7c3aed' }} />
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
