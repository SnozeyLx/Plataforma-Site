'use client';

import { Suspense } from "react";
import ProtectedRoute from "../../routes/ProtectedRoute";
import ClientOnly from "../../routes/ClientOnly";
import Vip from "../../views/Vip";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ClientOnly>
        <ProtectedRoute>
          <Vip />
        </ProtectedRoute>
      </ClientOnly>
    </Suspense>
  );
}
