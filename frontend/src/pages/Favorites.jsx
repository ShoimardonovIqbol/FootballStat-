import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import { Star, Shield, Users, HeartCrack } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'
import Topbar from '../components/layout/Topbar'

function SectionHeader({ icon: Icon, label, count, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9,
        background: color + '1f',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={15} color={color} />
      </div>
      <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-1)' }}>{label}</span>
      <span style={{
        fontSize: 11, fontWeight: 700, color,
        background: color + '1a', padding: '2px 9px', borderRadius: 99,
      }}>{count}</span>
    </div>
  )
}

function EmptyHint({ text }) {
  return (
    <div style={{
      padding: '28px 16px', textAlign: 'center',
      background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: 14,
    }}>
      <HeartCrack size={22} color="var(--text-4)" style={{ margin: '0 auto 8px', display: 'block' }} />
      <p style={{ fontSize: 12, color: 'var(--text-3)', margin: 0 }}>{text}</p>
    </div>
  )
}

export default function Favorites() {
  const { teams, players, toggleTeam, togglePlayer } = useFavorites()

  return (
    <div style={{ minHeight: '100vh' }}>
      <Topbar title="Favorites" />

      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 13,
            background: 'linear-gradient(135deg,#f59e0b,#d97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(245,158,11,0.35)',
          }}>
            <Star size={20} color="#fff" fill="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>My Favorites</h2>
            <p style={{ fontSize: 12, color: 'var(--text-2)', margin: 0 }}>
              Teams and players you've starred, saved on this device
            </p>
          </div>
        </div>

        {/* Teams */}
        <div>
          <SectionHeader icon={Shield} label="Favorite Teams" count={teams.length} color="var(--text-2)" />
          {teams.length === 0 ? (
            <EmptyHint text="No favorite teams yet — tap the star on any team card in Teams to add one." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              <AnimatePresence>
                {teams.map((team, i) => (
                  <motion.div
                    key={team.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ delay: i * 0.03 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px', borderRadius: 14,
                      background: 'var(--surface)', border: '1px solid var(--border)',
                    }}
                  >
                    <Link to={`/teams/${team.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0, textDecoration: 'none' }}>
                      <img src={team.logo} alt="" style={{ width: 34, height: 34, objectFit: 'contain', flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {team.name}
                      </span>
                    </Link>
                    <button
                      onClick={() => toggleTeam(team)}
                      title="Remove from favorites"
                      style={{
                        flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
                        cursor: 'pointer',
                      }}
                    >
                      <Star size={13} color="#f59e0b" fill="#f59e0b" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Players */}
        <div>
          <SectionHeader icon={Users} label="Favorite Players" count={players.length} color="#3b82f6" />
          {players.length === 0 ? (
            <EmptyHint text="No favorite players yet — tap the star next to any player in Players to add one." />
          ) : (
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 16, overflow: 'hidden',
            }}>
              <AnimatePresence>
                {players.map((player, i) => (
                  <motion.div
                    key={player.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 16px', borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <img
                      src={player.photo} alt=""
                      style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)', flexShrink: 0 }}
                      onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=333336&color=fff&size=36` }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {player.name}
                      </p>
                      {player.team && (
                        <p style={{ fontSize: 11, color: 'var(--text-3)', margin: 0 }}>{player.team}</p>
                      )}
                    </div>
                    <button
                      onClick={() => togglePlayer(player)}
                      title="Remove from favorites"
                      style={{
                        flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
                        cursor: 'pointer',
                      }}
                    >
                      <Star size={13} color="#f59e0b" fill="#f59e0b" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
