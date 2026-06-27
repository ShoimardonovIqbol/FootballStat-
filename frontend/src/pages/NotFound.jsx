import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        style={{ textAlign: 'center', maxWidth: 400 }}
      >
        <div style={{
          fontSize: 96, fontWeight: 900, lineHeight: 1,
          background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 16,
        }}>
          404
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 10px' }}>
          Page Not Found
        </h1>
        <p style={{ fontSize: 13, color: '#475569', margin: '0 0 32px', lineHeight: 1.6 }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '10px 20px', borderRadius: 12,
                background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                color: '#fff', fontSize: 13, fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Home size={14} /> Dashboard
            </motion.div>
          </Link>
          <motion.div
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => window.history.back()}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '10px 20px', borderRadius: 12,
              background: 'rgba(21,21,58,0.8)',
              border: '1px solid rgba(124,58,237,0.2)',
              color: '#94a3b8', fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={14} /> Go Back
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
