import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Apie Mus - Pique Unique Istorija | Prabangūs Piknikai Klaipėdoje',
  description: 'Sužinokite Pique Unique istoriją - kaip gimė mūsų idėja kurti prabangius paplūdimio piknikus Klaipėdoje ir Neringoje. Mes kuriame nepamirštamus momentus prie jūros.',
  keywords: 'Pique Unique istorija, apie mus, paplūdimio piknikai Klaipėda, prabangūs piknikai, mūsų komanda, pikniko organizatoriai',
  openGraph: {
    title: 'Apie Mus - Pique Unique Istorija',
    description: 'Sužinokite Pique Unique istoriją ir kaip mes kuriame nepamirštamus momentus prie jūros',
    images: ['/images/about-story.webp'],
  },
};

export default function AboutPage() {
  return (
    <main className="bg-sand">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <Image
          src="/images/about-story.webp"
          alt="Pique Unique istorija - nuostabūs momentai paplūdimyje"
          fill
          className="object-cover object-bottom"
          priority
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center px-4 mb-4">
              Mūsų Istorija
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto px-4">
              Kaip gimė Pique Unique ir kodėl mes kuriame nepamirštamus momentus
            </p>
          </div>
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

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-hunter-green text-center mb-12">
            D.U.K. - Dažnai Užduodami Klausimai
          </h2>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-hunter-green mb-3">1. Kas yra Pique Unique?</h3>
              <p className="text-gray-700">
                Pique Unique – tai išskirtinių piknikų patirtis po atviru dangumi, skirta švęsti ypatingas gyvenimo akimirkas: gimtadienius, mergvakarius, pasipiršimus ar tiesiog gražią dieną su brangiais žmonėmis. Mes pasirūpiname viskuo – nuo gėlių puokštės iki kruopščiai parinktų dekoracijų.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-hunter-green mb-3">2. Kas įskaičiuota į pikniką?</h3>
              <p className="text-gray-700 mb-3">Kiekviename piknike rasite:</p>
              <ul className="text-gray-700 list-disc list-inside space-y-1 ml-4">
                <li>Stilingą stalą ir sėdėjimo vietas</li>
                <li>Dekoracijas ir indus</li>
                <li>Pledus, papildomas pagalvėles ir jaukumą</li>
                <li>Teminius žaidimus</li>
                <li>Gėlių dekorą</li>
                <li>Pakvietimus</li>
                <li>Muziką, BOSE kolonėlę, Spotify grojaraštį</li>
                <li>&ldquo;Atsiminimų telefoną&rdquo; skirta įrašyti palinkėjimus jubiliatei ar būsimai nuotakai</li>
              </ul>
              <p className="text-gray-700 mt-3">
                Maisto netiekiame, tačiau galime pasirūpinti sezoniniais, teminiais užkandžiais ir gražiomis serviravimo lėkštėmis už papildomą 30€/5asm.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-hunter-green mb-3">3. Kaip rezervuoti pikniką?</h3>
              <p className="text-gray-700">
                Užsakymus priimame per svetainę arba rašant mums per Instagram ar Facebook. Rekomenduojame rezervuoti bent prieš 5 dienas, ypač savaitgaliais.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-hunter-green mb-3">4. Kiek kainuoja piknikas?</h3>
              <p className="text-gray-700">
                Kaina priklauso nuo žmonių skaičiaus ir pasirinktų papildomų paslaugų. Turime skirtingus pasiūlymus nuo €200 dviem asmenims. (Tikslias kainas rasite skyriuje &ldquo;Paketai&rdquo;.)
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-hunter-green mb-3">5. Ką daryti, jei prognozuojamas lietus?</h3>
              <p className="text-gray-700">
                Jei artėja lietus – susisieksime ir pasiūlysime perkelti datą arba grąžinsime pinigus. Galime padėti rasti dengtas vietas.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-hunter-green mb-3">6. Ar galiu atsinešti savo maistą ir gėrimus?</h3>
              <p className="text-gray-700">
                Taip! Atsineškite savo mėgstamų užkandžių, tortą ar gėrimų – mes pasirūpinsime jaukia aplinka. (Svarbu: neteikiame maisto ar alkoholio.)
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-hunter-green mb-3">7. Kiek laiko trunka piknikas?</h3>
              <p className="text-gray-700">
                Standartinis piknikas trunka 2 valandas, tačiau galima užsisakyti ilgesnį laiką už papildomą mokestį (€50).
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-hunter-green mb-3">8. Ar galima pasirinkti teminį pikniką?</h3>
              <p className="text-gray-700">
                Žinoma! Jei turite ypatingą idėją ar temą – pasidalinkite, ir mes padarysime viską, kad ją įgyvendintume.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-hunter-green mb-3">9. Ar piknikai tinkami vaikams?</h3>
              <p className="text-gray-700">
                Taip! Galime pritaikyti aplinką šeimai ar vaikams – tereikia iš anksto informuoti.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-hunter-green mb-3">10. Ar važiuojate į kitus miestus?</h3>
              <p className="text-gray-700">
                Esame įsikūrę Klaipėdos/Neringos regionuose. Dėl kitų vietovių – parašykite, įvertinsime galimybę!
              </p>
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