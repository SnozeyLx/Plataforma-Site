'use client';

import { useEffect, useState } from 'react';
/**
 * Renderiza os filhos somente no navegador.
 * O app usa localStorage, sockets e Unity, que não existem durante o build estático.
 */
const ClientOnly = ({ children }: any) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? children : null;
};
export default ClientOnly;
