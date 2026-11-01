export const ROUTES = {
  LOGIN: process.env.NEXT_PUBLIC_LOGIN_ROUTE || '/',
  INDEX: '/index',
  HOME: process.env.NEXT_PUBLIC_HOME_ROUTE || '/home',
  GAME: process.env.NEXT_PUBLIC_GAME_ROUTE || '/game',
  PROFILE: process.env.NEXT_PUBLIC_PROFILE_ROUTE || '/profile',
  WALLET: process.env.NEXT_PUBLIC_WALLET_ROUTE || '/wallet',
  DEPOSIT: process.env.NEXT_PUBLIC_DEPOSIT_ROUTE || '/deposito',
  SUPPORT: process.env.NEXT_PUBLIC_SUPPORT_ROUTE || '/suporte',
  RANKING: process.env.NEXT_PUBLIC_RANKING_ROUTE || '/ranking',
  BANK: process.env.NEXT_PUBLIC_BANK_ROUTE || '/bank',
  LIVE: '/live',
  RESET: '/reset',
  VIP: '/vip'
};
export const API_URLS = {
  BASE: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.rondaonlinebr.com',
  ROOMS: '/rooms',
  AUTH: '/auth',
  USER: '/user',
  WALLET: '/wallet',
  DEPOSIT: '/deposit',
  BETS: '/bets',
  VIP: '/vip'
};
export const SOCKET_URLS = {
  BASE: process.env.NEXT_PUBLIC_SOCKET_BASE_URL || 'wss://api.rondaonlinebr.com:8081',
  CHAT: process.env.NEXT_PUBLIC_CHAT_SOCKET_URL || 'wss://api.rondaonlinebr.com:8081/chat',
  USER_LIVE: process.env.NEXT_PUBLIC_USER_LIVE_SOCKET_URL || 'wss://api.rondaonlinebr.com:8081/userlive',
  ARTEVIT: process.env.NEXT_PUBLIC_SOCKET_ARTEVIT_URL || 'wss://ronda-api.artevitdevs.com.br:8080'
};
export const UNITY_URLS = {
  BASE: process.env.NEXT_PUBLIC_UNITY_URL || 'https://unity.rondaonlinebr.com',
  DEALER_PATH: process.env.NEXT_PUBLIC_UNITY_DEALER_PATH || '/unity_dealer',
  USER_PATH: process.env.NEXT_PUBLIC_UNITY_USER_PATH || '/unity_user'
};
export const STREAM_URL = process.env.NEXT_PUBLIC_STREAM_URL || 'https://stream-akamai.castr.com/5b9352dbda7b8c769937e459/live_2361c920455111ea85db6911fe397b9e/index.fmp4.m3u8';
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