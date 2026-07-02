import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { Newspaper, ExternalLink, Clock } from 'lucide-react'
import { newsAPI } from '../services/api'
import { useApi } from '../hooks/useApi'
import { Skeleton } from '../components/ui/Skeleton'
import Topbar from '../components/layout/Topbar'

const SOURCE_COLORS = {
  'BBC Sport': '#bb1919',
  'Sky Sports': '#ed1a3a',
}

function timeAgo(iso) {
  if (!iso) return ''
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function SourceBadge({ source }) {
  const color = SOURCE_COLORS[source] || 'var(--text-3)'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 99,
      background: color + '1f', border: `1px solid ${color}40`,
      fontSize: 10, fontWeight: 800, color, letterSpacing: '0.02em',
    }}>
      {source}
    </span>
  )
}

function FeaturedCard({ article }) {
  return (
    <motion.a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'relative', display: 'block',
        borderRadius: 18, overflow: 'hidden', textDecoration: 'none',
        border: '1px solid var(--border)', background: 'var(--surface)',
        height: 340,
      }}
    >
      {article.image ? (
        <img
          src={article.image} alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1e1b3a,#2a1f4d)' }} />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.85) 100%)',
      }} />
      <div style={{ position: 'absolute', left: 24, right: 24, bottom: 22 }}>
        <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <SourceBadge source={article.source} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={11} /> {timeAgo(article.pubDate)}
          </span>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.3 }}>
          {article.title}
        </h2>
        {article.description && (
          <p style={{
            fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 8, marginBottom: 0,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {article.description}
          </p>
        )}
      </div>
    </motion.a>
  )
}

function ArticleCard({ article, index }) {
  return (
    <motion.a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.4) }}
      style={{
        display: 'flex', gap: 14, padding: 14, borderRadius: 14,
        background: 'var(--surface)', border: '1px solid var(--border)',
        textDecoration: 'none', alignItems: 'stretch',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{
        width: 110, height: 78, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
        background: 'var(--surface2)',
      }}>
        {article.image && (
          <img src={article.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SourceBadge source={article.source} />
          <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{timeAgo(article.pubDate)}</span>
        </div>
        <p style={{
          fontSize: 13, fontWeight: 700, color: 'var(--text-1)', margin: 0, lineHeight: 1.35,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {article.title}
        </p>
      </div>
      <ExternalLink size={13} style={{ color: 'var(--text-4)', flexShrink: 0, alignSelf: 'flex-start', marginTop: 2 }} />
    </motion.a>
  )
}

function NewsSkeleton() {
  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Skeleton style={{ height: 340, borderRadius: 18 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} style={{ height: 106, borderRadius: 14 }} />
        ))}
      </div>
    </div>
  )
}

const FILTERS = ['All', 'BBC Sport', 'Sky Sports']

export default function News() {
  const { data, loading, error } = useApi(newsAPI.getAll, [])
  const [filter, setFilter] = useState('All')

  const articles = data?.articles || []
  const filtered = useMemo(
    () => filter === 'All' ? articles : articles.filter(a => a.source === filter),
    [articles, filter]
  )
  const [featured, ...rest] = filtered

  return (
    <div style={{ minHeight: '100vh' }}>
      <Topbar title="News" />

      <div style={{ padding: '24px 32px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 13,
          background: 'rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Newspaper size={20} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>Football News</h2>
          <p style={{ fontSize: 12, color: 'var(--text-2)', margin: 0 }}>
            Latest headlines from BBC Sport and Sky Sports
          </p>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s',
                background: filter === f ? 'rgba(255,255,255,0.1)' : 'var(--surface2)',
                border: filter === f ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--border)',
                color: filter === f ? '#fff' : 'var(--text-2)',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading && <NewsSkeleton />}

      {!loading && error && (
        <div style={{ margin: '16px 32px', padding: 24, textAlign: 'center', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 13, color: 'var(--text-2)', margin: 0 }}>Could not load news right now. Try again later.</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={{ margin: '16px 32px', padding: 24, textAlign: 'center', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 13, color: 'var(--text-2)', margin: 0 }}>No articles found.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div style={{ padding: '16px 32px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {featured && <FeaturedCard article={featured} />}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
            {rest.map((article, i) => (
              <ArticleCard key={article.link} article={article} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
