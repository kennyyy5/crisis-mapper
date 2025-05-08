"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AiInfo from "./components/AiInfo";

const MapClient = dynamic(() => import("./components/MapClient"), {
  ssr: false,
});

export default function Home() {
  const [quakes, setQuakes] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuakes() {
      try {
        // Use POST to match your API route
        const res = await fetch("/api/map");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        // If your API returns { message: "..." }, extract the actual quakes payload
        setQuakes(data);
      } catch (err) {
        console.error("Error fetching GDACS data:", err);
        setError("Could not load data.");
      } finally {
        setLoading(false);
      }
    }
    fetchQuakes();
  }, []);

  if (loading) {
    return <div className="min-h-screen p-5 sm:p-10">Loading map…</div>;
  }

  return (
    <div className="min-h-screen p-5 sm:p-10">
      <h1 className="text-2xl font-bold text-center mb-6">
        CrisisMapper - Maps crisis alerts and predicts areas needing aid
      </h1>

      <section>
       
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {!quakes ? (
          <p>Retrying map fetch…</p>
        ) : (
          <MapClient quakes={quakes} />
        )}
      </section>

      <section className="mt-12">
        <AiInfo />
      </section>
    </div>
  );
}
