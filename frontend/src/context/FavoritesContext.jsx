import { createContext, useContext, useState, useEffect } from 'react'

const FavoritesCtx = createContext({
  teams: [],
  players: [],
  isTeamFav: () => false,
  isPlayerFav: () => false,
  toggleTeam: () => {},
  togglePlayer: () => {},
})

const load = key => {
  try { return JSON.parse(localStorage.getItem(key)) ?? [] }
  catch { return [] }
}

export function FavoritesProvider({ children }) {
  const [teams, setTeams]     = useState(() => load('fav-teams'))
  const [players, setPlayers] = useState(() => load('fav-players'))

  useEffect(() => { localStorage.setItem('fav-teams', JSON.stringify(teams)) }, [teams])
  useEffect(() => { localStorage.setItem('fav-players', JSON.stringify(players)) }, [players])

  const isTeamFav   = id => teams.some(t => t.id === id)
  const isPlayerFav = id => players.some(p => p.id === id)

  const toggleTeam = team => {
    setTeams(prev => prev.some(t => t.id === team.id)
      ? prev.filter(t => t.id !== team.id)
      : [...prev, team])
  }

  const togglePlayer = player => {
    setPlayers(prev => prev.some(p => p.id === player.id)
      ? prev.filter(p => p.id !== player.id)
      : [...prev, player])
  }

  return (
    <FavoritesCtx.Provider value={{ teams, players, isTeamFav, isPlayerFav, toggleTeam, togglePlayer }}>
      {children}
    </FavoritesCtx.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesCtx)
