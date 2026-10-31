import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, ROUTES } from './routes';
/**
 * Componente para proteger rotas que requerem autenticação
 * @param {Object} props - Props do componente
 * @param {React.ReactNode} props.children - Componente filho a ser renderizado se autenticado
 * @param {string} props.redirectTo - Rota para redirecionamento se não autenticado
 */
const ProtectedRoute = ({ children, redirectTo = ROUTES.LOGIN }) => {
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
};
export default ProtectedRoute;