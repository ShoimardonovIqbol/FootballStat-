import { createContext, useContext, useState, useEffect } from 'react'

const ThemeCtx = createContext({ light: false, toggle: () => {} })

export function ThemeProvider({ children }) {
  const [light, setLight] = useState(() => localStorage.getItem('theme') === 'light')

  useEffect(() => {
    document.body.classList.toggle('light', light)
    localStorage.setItem('theme', light ? 'light' : 'dark')
  }, [light])

  return (
    <ThemeCtx.Provider value={{ light, toggle: () => setLight(l => !l) }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)
