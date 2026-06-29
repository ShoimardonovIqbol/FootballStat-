import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' })

export const leaguesAPI = {
  getAll: ()              => api.get('/leagues'),
  getById: (id)           => api.get(`/leagues/${id}`),
}

export const matchesAPI = {
  getToday: ()            => api.get('/matches/today'),
  getLive: ()             => api.get('/matches/live'),
  getById: (id)           => api.get(`/matches/${id}`),
  getEvents: (id)         => api.get(`/matches/${id}/events`),
  getLineups: (id)        => api.get(`/matches/${id}/lineups`),
  getStatistics: (id)     => api.get(`/matches/${id}/statistics`),
  getList: (params)       => api.get('/matches', { params }),
  getH2H: (h2h, last=10) => api.get('/matches/h2h', { params: { h2h, last } }),
}

export const standingsAPI = {
  get: (league=39, season=2024) => api.get('/standings', { params: { league, season } }),
}

export const teamsAPI = {
  getList: (params)        => api.get('/teams', { params }),
  getById: (id)            => api.get(`/teams/${id}`),
  getStats: (id, league=39, season=2024) =>
    api.get(`/teams/${id}/statistics`, { params: { league, season } }),
  getSquad: (id)           => api.get(`/teams/${id}/squad`),
  getFixtures: (id, params)=> api.get(`/teams/${id}/fixtures`, { params }),
}

export const playersAPI = {
  getList: (params)        => api.get('/players', { params }),
  getById: (id, season=2024) => api.get(`/players/${id}`, { params: { season } }),
  getTopScorers: (league=39, season=2024) =>
    api.get('/players/top-scorers', { params: { league, season } }),
  getTopAssists: (league=39, season=2024) =>
    api.get('/players/top-assists', { params: { league, season } }),
  getTopRedCards: (league=39, season=2024) =>
    api.get('/players/top-red-cards', { params: { league, season } }),
  getTopYellowCards: (league=39, season=2024) =>
    api.get('/players/top-yellow-cards', { params: { league, season } }),
}

export const searchAPI = {
  search: (q, league) => api.get('/search', { params: { q, ...(league ? { league } : {}) } }),
}
