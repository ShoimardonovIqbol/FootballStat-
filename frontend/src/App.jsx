import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar          from './components/layout/Sidebar'
import MatrixBackground from './components/ui/MatrixBackground'
import Home        from './pages/Home'
import Matches     from './pages/Matches'
import Standings   from './pages/Standings'
import Teams       from './pages/Teams'
import Players     from './pages/Players'
import Leagues     from './pages/Leagues'
import LeagueDetail from './pages/LeagueDetail'

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
        <Route path="/matches/*"   element={<PageWrapper><Matches /></PageWrapper>} />
        <Route path="/standings"   element={<PageWrapper><Standings /></PageWrapper>} />
        <Route path="/teams/*"     element={<PageWrapper><Teams /></PageWrapper>} />
        <Route path="/players/*"   element={<PageWrapper><Players /></PageWrapper>} />
        <Route path="/leagues"     element={<PageWrapper><Leagues /></PageWrapper>} />
        <Route path="/leagues/:id" element={<PageWrapper><LeagueDetail /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Matrix character background */}
      <MatrixBackground />

      {/* Floating orbs on top of matrix */}
      <div className="orb" style={{ width: 384, height: 384, background:'#7c3aed', top:'5%',  left:'18%', animationDelay:'0s'  }} />
      <div className="orb" style={{ width: 320, height: 320, background:'#4f46e5', top:'55%', right:'10%', animationDelay:'4s'  }} />
      <div className="orb" style={{ width: 256, height: 256, background:'#a855f7', top:'35%', left:'48%', animationDelay:'8s'  }} />

      <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: 256, minHeight: '100vh', position: 'relative' }}>
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  )
}
