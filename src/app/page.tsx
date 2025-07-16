import { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import Reviews from '@/components/Reviews';
import WhyChooseUs from '@/components/WhyChooseUs';
import Features from '@/components/Features';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pique Unique - Unikalios vietos jūsų šventei',
  description: 'Atraskite unikalias vietas jūsų šventei ar renginiui. Rezervuokite patogiai ir greitai.',
};

export default function HomePage() {
  return (
    <main>
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        {/* Simple Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-hunter-green via-cambridge-blue to-verdigris" />
        
        {/* Content */}
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 text-white">
              Pique Unique
              <br />
              <span className="text-cherry-blossom">
                Prabangūs Piknikai Paplūdimyje
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
              PIQUE UNIQUE tai ne tik piknikai, tai kruopščiai kurtos patirtys kviečiančios sustoti, būti su artimaisiais ir švęsti gyvenimą kartu.
            </p>
            
            {/* Large Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                href="/booking" 
                className="w-full sm:w-auto text-center btn-primary text-xl px-12 py-4 min-w-[250px]"
              >
                Užsakyti Pikniką
              </Link>
              <Link 
                href="/admin/bookings" 
                className="w-full sm:w-auto text-center btn-secondary text-xl px-12 py-4 min-w-[250px]"
              >
                Administravimas
              </Link>
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
