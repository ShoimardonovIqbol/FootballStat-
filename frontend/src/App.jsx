import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ThemeProvider } from './context/ThemeContext'
import { FavoritesProvider } from './context/FavoritesContext'
import ScrollToTop from './components/ui/ScrollToTop'
import Home        from './pages/Home'
import WorldCup    from './pages/WorldCup'
import MatchDetail from './pages/MatchDetail'
import Matches     from './pages/Matches'
import Standings   from './pages/Standings'
import Teams       from './pages/Teams'
import Players     from './pages/Players'
import Leagues     from './pages/Leagues'
import LeagueDetail from './pages/LeagueDetail'
import WatchLive   from './pages/WatchLive'
import Favorites   from './pages/Favorites'
import News        from './pages/News'
import NotFound    from './pages/NotFound'

const pageVariants = {
  initial: { opacity: 0, y: 18, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0,  filter: 'blur(0px)',
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit:    { opacity: 0, y: -12, filter: 'blur(4px)',
    transition: { duration: 0.2 }
  },
}

function PageWrapper({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  )
}

function AppRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"            element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/worldcup"    element={<PageWrapper><WorldCup /></PageWrapper>} />
        <Route path="/matches/:id"  element={<PageWrapper><MatchDetail /></PageWrapper>} />
        <Route path="/matches/*"   element={<PageWrapper><Matches /></PageWrapper>} />
        <Route path="/standings"   element={<PageWrapper><Standings /></PageWrapper>} />
        <Route path="/teams/*"     element={<PageWrapper><Teams /></PageWrapper>} />
        <Route path="/players/*"   element={<PageWrapper><Players /></PageWrapper>} />
        <Route path="/leagues"     element={<PageWrapper><Leagues /></PageWrapper>} />
        <Route path="/leagues/:id" element={<PageWrapper><LeagueDetail /></PageWrapper>} />
        <Route path="/watch"       element={<PageWrapper><WatchLive /></PageWrapper>} />
        <Route path="/favorites"   element={<PageWrapper><Favorites /></PageWrapper>} />
        <Route path="/news"        element={<PageWrapper><News /></PageWrapper>} />
        <Route path="*"            element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ThemeProvider>
    <FavoritesProvider>
    <BrowserRouter>
      <ScrollToTop />
      <div style={{ minHeight: '100vh' }}>
        <main style={{ minHeight: '100vh' }}>
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
    </FavoritesProvider>
    </ThemeProvider>
  )
}
