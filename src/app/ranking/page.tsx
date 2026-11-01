'use client';

import { Suspense } from "react";
import ProtectedRoute from "../../routes/ProtectedRoute";
import ClientOnly from "../../routes/ClientOnly";
import Ranking from "../../views/Ranking";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ClientOnly>
        <ProtectedRoute>
          <Ranking />
        </ProtectedRoute>
      </ClientOnly>
    </Suspense>
  );
}
