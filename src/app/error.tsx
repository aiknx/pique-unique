"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Galima siųsti į Sentry
    // console.error(error);
  }, [error]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center bg-white">
      <div className="text-center px-6">
        <h1 className="text-4xl font-bold text-hunter-green mb-4">Įvyko klaida</h1>
        <p className="text-gray-700 mb-6">Bandykite dar kartą. Jei problema kartojasi, susisiekite su mumis.</p>
        <button className="btn-primary" onClick={() => reset()}>
          Bandyti iš naujo
        </button>
      </div>
    </main>
  );
}