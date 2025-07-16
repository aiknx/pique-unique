'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';

export default function SessionTimeout() {
  const [showWarning, setShowWarning] = useState(false);
  const { signOut } = useAuth();

  useEffect(() => {
    let warningTimer: NodeJS.Timeout;
    const WARNING_TIMEOUT = 25 * 60 * 1000; // Show warning 5 minutes before timeout

    const resetWarningTimer = () => {
      if (warningTimer) clearTimeout(warningTimer);
      setShowWarning(false);
      warningTimer = setTimeout(() => {
        setShowWarning(true);
      }, WARNING_TIMEOUT);
    };

    const handleActivity = () => {
      resetWarningTimer();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    resetWarningTimer();

    return () => {
      if (warningTimer) clearTimeout(warningTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, []);

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-hunter z-50">
      <div className="flex flex-col space-y-2">
        <p className="text-sm text-gray-700">
          Jūsų sesija baigsis po 5 minučių dėl neaktyvumo.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowWarning(false)}
            className="text-sm px-3 py-1 bg-hunter text-white rounded hover:bg-hunter-dark"
          >
            Tęsti sesiją
          </button>
          <button
            onClick={() => signOut()}
            className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Atsijungti
          </button>
        </div>
      </div>
    </div>
  );
} 