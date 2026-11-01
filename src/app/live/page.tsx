'use client';

import { Suspense } from "react";
import ProtectedRoute from "../../routes/ProtectedRoute";
import ClientOnly from "../../routes/ClientOnly";
import DealerLive from "../../assets/components/DealerLive";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ClientOnly>
        <ProtectedRoute>
          <DealerLive />
        </ProtectedRoute>
      </ClientOnly>
    </Suspense>
  );
}
