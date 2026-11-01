'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, ROUTES } from './routes';
/**
 * Componente para proteger rotas que requerem autenticação
 * @param {Object} props - Props do componente
 * @param {React.ReactNode} props.children - Componente filho a ser renderizado se autenticado
 * @param {string} props.redirectTo - Rota para redirecionamento se não autenticado
 */
const ProtectedRoute = ({ children, redirectTo = ROUTES.LOGIN }: any) => {
  const router = useRouter();
  // localStorage só existe no navegador, então a checagem roda após a montagem
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace(redirectTo);
      return;
    }
    setAllowed(true);
  }, [redirectTo, router]);

  if (!allowed) {
    return null;
  }
  return children;
};
export default ProtectedRoute;
