import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar     from './components/layout/Sidebar'
import Home        from './pages/Home'
import Matches     from './pages/Matches'
import Standings   from './pages/Standings'
import Teams       from './pages/Teams'
import Players     from './pages/Players'
import Leagues     from './pages/Leagues'
import LeagueDetail from './pages/LeagueDetail'

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  )
}

function AppRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"             element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/matches/*"    element={<PageWrapper><Matches /></PageWrapper>} />
        <Route path="/standings"    element={<PageWrapper><Standings /></PageWrapper>} />
        <Route path="/teams/*"      element={<PageWrapper><Teams /></PageWrapper>} />
        <Route path="/players/*"    element={<PageWrapper><Players /></PageWrapper>} />
        <Route path="/leagues"      element={<PageWrapper><Leagues /></PageWrapper>} />
        <Route path="/leagues/:id"  element={<PageWrapper><LeagueDetail /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Floating background orbs */}
      <div className="orb w-96 h-96" style={{ background:'#7c3aed', top:'5%',  left:'18%', animationDelay:'0s'  }} />
      <div className="orb w-80 h-80" style={{ background:'#4f46e5', top:'55%', right:'10%', animationDelay:'4s'  }} />
      <div className="orb w-64 h-64" style={{ background:'#a855f7', top:'35%', left:'48%', animationDelay:'8s'  }} />

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: 256, minHeight: '100vh', position: 'relative' }}>
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  )
}
