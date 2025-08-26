'use client';

import { useState } from 'react';

interface DebugData {
  success: boolean;
  timestamp: string;
  environment: {
    node_env?: string;
    vercel_env?: string;
    vercel_url?: string;
  };
  firebase_config: {
    [key: string]: boolean;
  };
  firebase_status: {
    firestore: string;
    auth: string;
    test_document: string;
  };
  debug_info: {
    has_db: boolean;
    has_auth: boolean;
    error_details: string | null;
  };
}

export default function DebugPage() {
  const [debugData, setDebugData] = useState<DebugData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testFirebase = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/debug-firebase');
      const data = await response.json();
      setDebugData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Firebase Debug Puslapis</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Firebase Konfigūracijos Testas</h2>
          <button
            onClick={testFirebase}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 disabled:opacity-50 font-semibold"
          >
            {loading ? 'Testuojama...' : 'Testuoti Firebase Konfigūraciją'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Klaida:</strong> {error}
          </div>
        )}

        {debugData && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Debug Rezultatai:</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-600">Environment:</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(debugData.environment, null, 2)}
                </pre>
              </div>
              
              <div>
                <h4 className="font-semibold text-blue-600">Firebase Config:</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(debugData.firebase_config, null, 2)}
                </pre>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-600">Firebase Status:</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(debugData.firebase_status, null, 2)}
                </pre>
              </div>
              
              <div>
                <h4 className="font-semibold text-orange-600">Debug Info:</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(debugData.debug_info, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 