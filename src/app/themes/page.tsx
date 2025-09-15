import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Temos | Pique Unique',
  description: 'Išsirinkite savo pikniko temą - Undinių, Fėjų, Laumių ar Disco pikniką. Kiekviena tema sukuria unikalią atmosferą jūsų ypatingai progai.',
};

export const revalidate = 86400;

const themes = [
  {
    id: 'undiniu',
    title: 'Undinių Piknikai',
    description: 'Spalvos žaižaruoja tarsi bangos saulėje. Undinių tema – tai svajinga, jūros įkvėpta iškylos patirtis. Dominuoja švelnios mėlynos, žalsvos ir perlinės spalvos, dekoracijos primena kriaukles, perlus ir vėtrunges. Tinka gimtadieniams, mergvakariams ar dienai, kai norisi pabėgti į pasaką.',
    icon: '/icons/undine.png'
  },
  {
    id: 'feju',
    title: 'Fėjų Piknikai',
    description: 'Ši tema – tarsi pasivaikščiojimas stebuklingame miške. Fėjų piknikas kupinas pastelinių spalvų, lengvų audinių ir gėlių žiedų. Jauki, romantiška, švelni atmosfera – idealiai tinka fotosesijoms, seserystės šventėms ar laikui su mylimomis draugėmis.',
    icon: '/icons/feja.png'
  },
  {
    id: 'laumiu',
    title: 'Laumių Piknikai',
    description: 'Pajuskite miško dvasią su Laumių pikniku. Laumių tema kviečia į paslaptingą laukinę gamtą: džiovinti augalai, mediniai elementai, žemės tonai ir pagoniškos detalės. Ši iškyla puikiai tiks gamtos mylėtojams, norintiems autentiškos, harmoningos atmosferos.',
    icon: '/icons/laume.png'
  },
  {
    id: 'disco',
    title: 'Disco Piknikai',
    description: 'Šokiai po žvaigždėtų dangumi su Disco tema! Disco tema – tai ryški, žaisminga, energinga iškyla su ryškiomis spalvomis, išskirtinėmis detalėmis ir gera nuotaika. Tinka vakarėliams, gimtadieniams ar bet kokiai progai, kai norisi šiek tiek daugiau.',
    icon: '/icons/disco.png'
  }
];

export default function ThemesPage() {
  return (
    <main className="bg-linen">
      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-hunter text-center mb-8">
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
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow"
              >
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <Image
                      src={theme.icon}
                      alt={theme.title}
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-3xl font-bold text-hunter-green">
                    {theme.title}
                  </h2>
                </div>
                                <p className="text-gray-700 mb-8">
                  {theme.description}
                </p>
                <div className="text-center">
                  <Link
                    href={`/booking?theme=${theme.id}`}
                    className="inline-block bg-hunter-green text-white py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Rezervuoti
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-hunter-green text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">💬</div>
          <h2 className="text-3xl font-bold mb-6 text-white">
            Negalite Apsispręsti?
          </h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto text-white">
            Susisiekite su mumis ir mes padėsime išsirinkti bei sukurti
            tobulą pikniką pagal jūsų poreikius ir norus.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-hunter-green py-3 px-8 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Pasitarkime
          </Link>
        </div>
      </section>
    </main>
  );
} 