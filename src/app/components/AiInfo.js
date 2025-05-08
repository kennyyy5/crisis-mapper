// src/components/AiInfo.js
import React, { useEffect, useState } from 'react';

const AiInfo = () => {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInfo() {
      try {
        // Use POST since GET is not allowed on this endpoint
        const res = await fetch('/api/ai', { method: 'POST' });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        // Assume response shape { message: '...' }
        setInfo(data.message ?? data);
      } catch (err) {
        console.error('Error fetching AI data:', err);
        setError('Could not load data.');
      } finally {
        setLoading(false);
      }
    }
    fetchInfo();
  }, []);

  if (loading) {
    return <div>Loading AI insights...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="ai-info">
      <h1 className="text-2xl font-semibold mb-6">AI Prediction:</h1>
      <p>{info}</p>
    </div>
  );
};

export default AiInfo;
