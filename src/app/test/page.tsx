'use client';

import { useState } from 'react';

export default function TestPage() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testFirebase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-firebase');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testBooking = async () => {
    if (!email) {
      setResult('Įveskite el. paštą');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/test-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactInfo: {
            name: 'Test User',
            email: email,
            phone: '123456789'
          }
        }),
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Sistemos Testavimas</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Firebase Test */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Firebase Admin Test</h2>
            <button
              onClick={testFirebase}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testuojama...' : 'Testuoti Firebase Admin'}
            </button>
          </div>

          {/* Booking Test */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Rezervacijos Test</h2>
            <input
              type="email"
              placeholder="Įveskite el. paštą"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <button
              onClick={testBooking}
              disabled={loading || !email}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Testuojama...' : 'Testuoti Rezervaciją'}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Rezultatai:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 