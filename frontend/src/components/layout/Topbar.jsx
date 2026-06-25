import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Radio } from 'lucide-react'
import { searchAPI } from '../../services/api'

export default function Topbar({ title }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState(null)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async (val) => {
    setQ(val)
    if (val.length < 3) { setResults(null); setOpen(false); return }
    try {
      const res = await searchAPI.search(val)
      setResults(res.data)
      setOpen(true)
    } catch { /* ignore */ }
  }

  return (
    <header
      className="flex items-center justify-between px-8 py-4 sticky top-0 z-40"
      style={{
        background: 'rgba(8,8,23,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(124,58,237,0.12)',
      }}
    >
      <h1 className="text-lg font-bold text-white">{title}</h1>

      {/* Search */}
      <div className="relative w-72">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={q}
          onChange={e => handleSearch(e.target.value)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          onFocus={() => { if (results) setOpen(true) }}
          placeholder="Search teams, players…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-slate-200 outline-none transition-all"
          style={{
            background: 'rgba(21,21,58,0.8)',
            border: '1px solid rgba(124,58,237,0.2)',
          }}
        />

        <AnimatePresence>
          {open && results && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute top-full mt-2 w-full rounded-xl overflow-hidden z-50"
              style={{
                background: '#10102a',
                border: '1px solid rgba(124,58,237,0.3)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              }}
            >
              {results.teams?.response?.slice(0, 5).map(t => (
                <button
                  key={t.team.id}
                  onMouseDown={() => { navigate(`/teams/${t.team.id}`); setOpen(false); setQ('') }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-white/5 transition text-left"
                >
                  <img src={t.team.logo} alt="" className="w-6 h-6 object-contain" />
                  <span className="text-sm text-slate-200">{t.team.name}</span>
                  <span className="ml-auto text-xs text-slate-500">{t.team.country}</span>
                </button>
              ))}
              {results.teams?.response?.length === 0 && (
                <p className="px-4 py-3 text-sm text-slate-500">No results for "{q}"</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2">
        <Radio size={14} className="text-green-400" />
        <span className="text-xs text-green-400 font-semibold">LIVE</span>
      </div>
    </header>
  )
}
