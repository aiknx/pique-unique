import { redirect } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Navbar from '@/components/Navbar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (!loading && !user) {
    redirect('/signin');
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {!loading && children}
      </main>
    </div>
  );
} 