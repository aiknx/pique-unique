import { redirect } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-xl shadow-lg">
        {children}
      </div>
    </div>
  );
} 