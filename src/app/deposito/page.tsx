'use client';

import { Suspense } from "react";
import ProtectedRoute from "../../routes/ProtectedRoute";
import ClientOnly from "../../routes/ClientOnly";
import Deposito from "../../views/Deposito";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ClientOnly>
        <ProtectedRoute>
          <Deposito />
        </ProtectedRoute>
      </ClientOnly>
    </Suspense>
  );
}
