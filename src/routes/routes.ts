export const ROUTES = {
  LOGIN: process.env.REACT_APP_LOGIN_ROUTE || '/',
  INDEX: '/index',
  HOME: process.env.REACT_APP_HOME_ROUTE || '/home',
  GAME: process.env.REACT_APP_GAME_ROUTE || '/game',
  PROFILE: process.env.REACT_APP_PROFILE_ROUTE || '/profile',
  WALLET: process.env.REACT_APP_WALLET_ROUTE || '/wallet',
  DEPOSIT: process.env.REACT_APP_DEPOSIT_ROUTE || '/deposito',
  SUPPORT: process.env.REACT_APP_SUPPORT_ROUTE || '/suporte',
  RANKING: process.env.REACT_APP_RANKING_ROUTE || '/ranking',
  BANK: process.env.REACT_APP_BANK_ROUTE || '/bank',
  LIVE: '/live',
  RESET: '/reset',
  VIP: '/vip'
};
export const API_URLS = {
  BASE: process.env.REACT_APP_API_BASE_URL || 'https://api.rondaonlinebr.com',
  ROOMS: '/rooms',
  AUTH: '/auth',
  USER: '/user',
  WALLET: '/wallet',
  DEPOSIT: '/deposit',
  BETS: '/bets',
  VIP: '/vip'
};
export const SOCKET_URLS = {
  BASE: process.env.REACT_APP_SOCKET_BASE_URL || 'wss://api.rondaonlinebr.com:8081',
  CHAT: process.env.REACT_APP_CHAT_SOCKET_URL || 'wss://api.rondaonlinebr.com:8081/chat',
  USER_LIVE: process.env.REACT_APP_USER_LIVE_SOCKET_URL || 'wss://api.rondaonlinebr.com:8081/userlive',
  ARTEVIT: process.env.REACT_APP_SOCKET_ARTEVIT_URL || 'wss://ronda-api.artevitdevs.com.br:8080'
};
export const UNITY_URLS = {
  BASE: process.env.REACT_APP_UNITY_URL || 'https://unity.rondaonlinebr.com',
  DEALER_PATH: process.env.REACT_APP_UNITY_DEALER_PATH || '/unity_dealer',
  USER_PATH: process.env.REACT_APP_UNITY_USER_PATH || '/unity_user'
};
export const STREAM_URL = process.env.REACT_APP_STREAM_URL || 'https://stream-akamai.castr.com/5b9352dbda7b8c769937e459/live_2361c920455111ea85db6911fe397b9e/index.fmp4.m3u8';
export const buildApiUrl = (endpoint) => {
  return `${API_URLS.BASE}${endpoint}`;
};
export const navigateToRoute = (navigate, route, params = {}) => {
  const queryString = Object.keys(params).length > 0 
    ? '?' + new URLSearchParams(params).toString() 
    : '';
  navigate(`${route}${queryString}`);
};
export const isProtectedRoute = (pathname) => {
  const protectedRoutes = [
    ROUTES.HOME,
    ROUTES.GAME,
    ROUTES.PROFILE,
    ROUTES.WALLET,
    ROUTES.DEPOSIT,
    ROUTES.BANK,
    ROUTES.LIVE,
    ROUTES.RESET,
    ROUTES.VIP
  ];
  return protectedRoutes.includes(pathname);
};
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};
export default ROUTES;