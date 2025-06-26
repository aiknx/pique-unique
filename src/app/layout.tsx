import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Pique Unique | Luxury Picnic Experiences',
  description: 'Experience luxury picnics with Pique Unique.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-background">
        <nav className="w-full bg-white border-b border-neutral-200 p-4">
          <div className="max-w-7xl mx-auto">
            <a href="/" className="text-2xl font-bold">Pique Unique</a>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
