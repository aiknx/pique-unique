import { Metadata } from 'next';
import Image from 'next/image';
// import { Hero } from '@/components/Hero';
import Reviews from '@/components/Reviews';
import WhyChooseUs from '@/components/WhyChooseUs';
import Features from '@/components/Features';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pique Unique - Prabangūs Piknikai Paplūdimyje Klaipėdoje | Romantiški & Šeimos Piknikai',
  description: 'Atraskite unikalius prabangius piknikus paplūdimyje Klaipėdoje ir Neringoje. Romantiški, šeimai ir ypatingiems renginiams. Kruopščiai kurtos patirtys prie jūros.',
  keywords: 'piknikai paplūdimyje, prabangūs piknikai, romantiški piknikai, šeimos piknikai, Klaipėda, Neringa, jūros piknikai, ypatingi renginiai, Pique Unique, paplūdimio piknikai',
  openGraph: {
    title: 'Pique Unique - Prabangūs Piknikai Paplūdimyje',
    description: 'Atraskite unikalius prabangius piknikus paplūdimyje Klaipėdoje ir Neringoje',
    images: ['/images/hero-picnic.webp'],
  },
};

export default function HomePage() {
  return (
    <main>
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-picnic.webp"
            alt="Prabangus piknikas paplūdimyje su draugėmis saulėlydyje - Pique Unique"
            fill
            className="object-cover object-left md:object-center"
            priority
            sizes="100vw"
            quality={85}
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
        
        {/* Content */}
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              Prabangūs Piknikai
              <br />
              <span className="text-cherry-blossom">
                Paplūdimyje Klaipėdoje
              </span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              PIQUE UNIQUE – tai ne tik piknikai, tai kruopščiai kurtos patirtys kviečiančios sustoti, 
              būti su artimaisiais ir švęsti gyvenimą kartu prie jūros.
            </p>
            
            {/* Large Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
              <Link 
                href="/booking" 
                className="w-full sm:w-auto text-center bg-hunter-green hover:bg-hunter-dark text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl min-w-[200px]"
              >
                Rezervuoti Pikniką
              </Link>
              <Link 
                href="/themes" 
                className="w-full sm:w-auto text-center bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-300 border-2 border-white/30 hover:border-white/50 min-w-[200px]"
              >
                Peržiūrėti Temas
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-cherry-blossom" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>100% saugu</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-cherry-blossom" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Greitas rezervavimas</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-cherry-blossom" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Klaipėda & Neringa</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <WhyChooseUs />
      <Features />
      <Reviews />
    </main>
  );
}
