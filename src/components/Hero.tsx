'use client';

import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative h-[90vh] flex items-center overflow-hidden">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-hunter-green via-cambridge-blue to-verdigris" />
      
      {/* Content */}
      <div className="container-custom relative z-10 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-white">
            Prabangūs Piknikai
            <br />
            <span className="text-cherry-blossom">
              Paplūdimyje
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 max-w-2xl">
            PIQUE UNIQUE tai ne tik piknikai, tai kruopščiai kurtos patirtys kviečiančios sustoti, būti su artimaisiais ir švęsti gyvenimą kartu.
          </p>
          
          {/* Buttons */}
          <div className="flex gap-4">
            <Link href="/booking" className="btn-primary text-lg px-8 py-3">
              Rezervuoti Dabar
            </Link>
            <Link href="/themes" className="btn-secondary text-lg px-8 py-3">
              Peržiūrėti Temas
            </Link>
            <Link href="/admin" className="btn-outline text-lg px-8 py-3">
              Administracija
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 