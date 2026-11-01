'use client';

import { Suspense } from "react";
import ClientOnly from "../../routes/ClientOnly";
import ResetPassword from "../../views/ResetPassword";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ClientOnly>
        <ResetPassword />
      </ClientOnly>
    </Suspense>
  );
}
