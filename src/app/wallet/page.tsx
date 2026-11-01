'use client';

import { Suspense } from "react";
import ProtectedRoute from "../../routes/ProtectedRoute";
import ClientOnly from "../../routes/ClientOnly";
import Wallet from "../../views/Wallet";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ClientOnly>
        <ProtectedRoute>
          <Wallet />
        </ProtectedRoute>
      </ClientOnly>
    </Suspense>
  );
}
