'use client';

import { Suspense } from "react";
import ClientOnly from "../routes/ClientOnly";
import IndexPage from "../views/Index";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ClientOnly>
        <IndexPage />
      </ClientOnly>
    </Suspense>
  );
}
