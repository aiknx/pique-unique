import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Apie Mus | Pique Unique',
  description: 'Sužinokite daugiau apie Pique Unique - jūsų prabangių paplūdimio piknikų organizatorius Klaipėdoje. Mes kuriame nepamirštamus momentus prie jūros.',
};

export default function AboutPage() {
  return (
    <main className="bg-sand">
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <Image
          src="/images/about-hero.jpg"
          alt="Pique Unique komanda paplūdimyje"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">
            Mūsų Istorija
          </h1>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-hunter-green mb-6">
              Kaip Viskas Prasidėjo
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Pique Unique gimė iš meilės jūrai ir noro sukurti ypatingus momentus. 
              Mes tikime, kad kiekviena proga verta švęsti, o kas gali būti geriau 
              nei šventė paplūdimyje su artimaisiais?
            </p>
            <p className="text-lg text-gray-700">
              Mūsų kelionė prasidėjo Klaipėdoje, kur jūros ošimas ir smėlio 
              švelnumas įkvėpė mus kurti unikalius piknikus. Nuo tada mes 
              nepaliaujamai tobuliname savo paslaugas, kad galėtume pasiūlyti 
              jums nepakartojamai gražius momentus prie jūros.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-hunter-green text-center mb-12">
            Mūsų Vertybės
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-sand rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-hunter-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-hunter-green mb-3">
                Unikalumas
              </h3>
              <p className="text-gray-700">
                Kiekvienas piknikas yra individualiai pritaikytas jūsų poreikiams ir norams.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-sand rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-hunter-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-hunter-green mb-3">
                Rūpestingumas
              </h3>
              <p className="text-gray-700">
                Dėmesys detalėms ir asmeninis požiūris į kiekvieną klientą.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-sand rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-hunter-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-hunter-green mb-3">
                Kokybė
              </h3>
              <p className="text-gray-700">
                Aukščiausios kokybės inventorius ir nepriekaištingas aptarnavimas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-hunter-green text-center mb-12">
            Susipažinkite su Komanda
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/images/team/founder.jpg"
                  alt="Įkūrėja"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-hunter-green">Vardenis Pavardenis</h3>
              <p className="text-gray-600">Įkūrėja</p>
            </div>

            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/images/team/designer.jpg"
                  alt="Dizainerė"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-hunter-green">Vardenis Pavardenis</h3>
              <p className="text-gray-600">Dizainerė</p>
            </div>

            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/images/team/coordinator.jpg"
                  alt="Koordinatorė"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-hunter-green">Vardenis Pavardenis</h3>
              <p className="text-gray-600">Koordinatorė</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-hunter-green text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">
            Pasiruošę Kurti Nepamirštamus Momentus?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Leiskite mums padėti jums sukurti tobulą pikniką paplūdimyje.
            Susisiekite su mumis ir pradėkime planuoti jūsų ypatingą dieną!
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-hunter-green py-3 px-8 rounded-md font-medium hover:bg-sand transition-colors"
          >
            Susisiekite
          </a>
        </div>
      </section>
    </main>
  );
} 