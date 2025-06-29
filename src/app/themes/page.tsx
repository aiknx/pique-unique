import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Temos | Pique Unique',
  description: 'Išsirinkite savo pikniko temą - romantiška, šeimai ar prabangų pikniką. Kiekviena tema sukuria unikalią atmosferą jūsų ypatingai progai.',
};

const themes = [
  {
    id: 'romantic',
    title: 'Romantiški Piknikai',
    description: 'Tobula aplinka romantiškiems pasimatymams, piršlyboms ar vestuvių metinėms. Sukuriame jaukią ir intymią atmosferą su žvakėmis, gėlėmis ir specialiai jums pritaikyta aplinka.',
    image: '/themes/romantic.jpg',
    features: [
      'Jaukus apšvietimas su žvakėmis ir girliandomis',
      'Romantiška muzika',
      'Gėlių puokštės ir dekoracijos',
      'Šampanas ir užkandžiai dviems',
      'Patogūs sėdmaišiai ir pagalvėlės',
      'Asmeninės detalės pagal jūsų pageidavimus'
    ]
  },
  {
    id: 'family',
    title: 'Šeimos Piknikai',
    description: 'Puiki proga praleisti laiką su šeima ir draugais. Organizuojame gimtadienius, krikštynas ar tiesiog jaukų savaitgalio pikniką visai šeimai.',
    image: '/themes/family.jpg',
    features: [
      'Erdvi ir patogi piknikavimo zona',
      'Žaidimai vaikams ir suaugusiems',
      'Šventinės dekoracijos',
      'Įvairūs užkandžiai ir gėrimai',
      'Saugios ir patogios sėdėjimo vietos',
      'Papildoma įranga pagal poreikį (muzika, apšvietimas)'
    ]
  },
  {
    id: 'luxury',
    title: 'Prabangūs Piknikai',
    description: 'Išskirtinė patirtis tiems, kurie vertina aukščiausią kokybę. Tobula proga verslo susitikimams, mergvakariams ar bet kokiai ypatingai šventei.',
    image: '/themes/luxury.jpg',
    features: [
      'Premium klasės baldai ir įranga',
      'Gurmaniški užkandžiai ir gėrimai',
      'Profesionalus aptarnavimas',
      'Išskirtinės dekoracijos',
      'Asmeninis koordinatorius',
      'Papildomos pramogos pagal pageidavimą'
    ]
  }
];

export default function ThemesPage() {
  return (
    <main className="bg-sand">
      {/* Hero Section */}
      <section className="py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-hunter-green text-center mb-8">
            Pikniko Temos
          </h1>
          <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto">
            Pasirinkite temą, kuri geriausiai atspindi jūsų įsivaizduojamą šventę.
            Kiekviena tema yra kruopščiai apgalvota ir pritaikyta skirtingoms progoms.
          </p>
        </div>
      </section>

      {/* Themes Grid */}
      <section className="pb-16">
        <div className="container-custom">
          <div className="space-y-16">
            {themes.map((theme, index) => (
              <div
                key={theme.id}
                className={`grid md:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={theme.image}
                    alt={theme.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-hunter-green">
                    {theme.title}
                  </h2>
                  <p className="text-gray-700">
                    {theme.description}
                  </p>
                  <ul className="space-y-3">
                    {theme.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-hunter-green flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4">
                    <Link
                      href="/contact"
                      className="inline-block bg-hunter-green text-white py-3 px-8 rounded-md hover:bg-hunter-green/90 transition-colors"
                    >
                      Rezervuoti
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-hunter-green text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">
            Negalite Apsispręsti?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Susisiekite su mumis ir mes padėsime išsirinkti bei sukurti
            tobulą pikniką pagal jūsų poreikius ir norus.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-hunter-green py-3 px-8 rounded-md font-medium hover:bg-sand transition-colors"
          >
            Pasitarkime
          </Link>
        </div>
      </section>
    </main>
  );
} 