import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Apie Mus - Pique Unique Istorija | Prabangūs Piknikai Klaipėdoje ir Neringoje',
  description: 'Sužinokite Pique Unique istoriją - kaip gimė mūsų idėja kurti prabangius paplūdimio piknikus Klaipėdoje ir Neringoje. Mes kuriame nepamirštamus momentus prie jūros su profesionaliais dekoracijomis ir meniu.',
  keywords: 'Pique Unique istorija, apie mus, paplūdimio piknikai Klaipėda, prabangūs piknikai, mūsų komanda, pikniko organizatoriai, pikniko paslaugos Klaipėdoje, pikniko istorija, pikniko komanda',
  openGraph: {
    title: 'Apie Mus - Pique Unique Istorija',
    description: 'Sužinokite Pique Unique istoriją ir kaip mes kuriame nepamirštamus momentus prie jūros',
    images: [
      {
        url: '/images/about-story.webp',
        width: 1200,
        height: 630,
        alt: 'Pique Unique istorija - nuostabūs momentai paplūdimyje',
      }
    ],
    locale: 'lt_LT',
    type: 'website',
  },
  alternates: {
    canonical: '/about',
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
          className="object-cover object-bottom md:object-center"
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

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-hunter-green text-center mb-12">
              Dažnai Užduodami Klausimai
            </h2>
            
            <div className="space-y-6">
              <div className="bg-sand/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-hunter-green mb-3">
                  Kas yra Pique Unique?
                </h3>
                <p className="text-gray-700">
                  Pique Unique – tai išskirtinių piknikų patirtis po atviru dangumi, skirta švęsti ypatingas gyvenimo akimirkas: gimtadienius, mergvakarius, pasipiršimus ar tiesiog gražią dieną su brangiais žmonėmis. Mes pasirūpiname viskuo – nuo gėlių puokštės iki kruopščiai parinktų dekoracijų.
                </p>
              </div>

              <div className="bg-sand/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-hunter-green mb-3">
                  Kas įskaičiuota į pikniką?
                </h3>
                <p className="text-gray-700">
                  Kiekviename piknike rasite: stilingą stalą ir sėdėjimo vietas, dekoracijas ir indus, pledus, papildomas pagalvėles ir jaukumą, teminius žaidimus, gėlių dekorą, pakvietimus, muziką, BOSE kolonėlę, Spotify grojaraštį, &ldquo;atsiminimų telefoną&rdquo; skirta įrašyti palinkėjimus jubiliatei ar būsimai nuotakai. Maisto netiekiame, tačiau galime pasirūpinti sezoniniais, teminiais užkandžiais ir gražiomis serviravimo lėkštėmis už papildomą 30€/5asm.
                </p>
              </div>

              <div className="bg-sand/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-hunter-green mb-3">
                  Kaip rezervuoti pikniką?
                </h3>
                <p className="text-gray-700">
                  Užsakymus priimame per svetainę arba rašant mums per Instagram ar Facebook. Rekomenduojame rezervuoti bent prieš 5 dienas, ypač savaitgaliais.
                </p>
              </div>

              <div className="bg-sand/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-hunter-green mb-3">
                  Kiek kainuoja piknikas?
                </h3>
                <p className="text-gray-700">
                  Kaina priklauso nuo žmonių skaičiaus ir pasirinktų papildomų paslaugų. Turime skirtingus pasiūlymus nuo €200 dviem asmenims. (Tikslias kainas rasite skyriuje &ldquo;Paketai&rdquo;.)
                </p>
              </div>

              <div className="bg-sand/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-hunter-green mb-3">
                  Ką daryti, jei prognozuojamas lietus?
                </h3>
                <p className="text-gray-700">
                  Jei artėja lietus – susisieksime ir pasiūlysime perkelti datą arba grąžinsime pinigus. Galime padėti rasti dengtas vietas.
                </p>
              </div>

              <div className="bg-sand/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-hunter-green mb-3">
                  Ar galiu atsinešti savo maistą ir gėrimus?
                </h3>
                <p className="text-gray-700">
                  Taip! Atsineškite savo mėgstamų užkandžių, tortą ar gėrimų – mes pasirūpinsime jaukia aplinka. (Svarbu: neteikiame maisto ar alkoholio.)
                </p>
              </div>

              <div className="bg-sand/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-hunter-green mb-3">
                  Kiek laiko trunka piknikas?
                </h3>
                <p className="text-gray-700">
                  Standartinis piknikas trunka 2 valandas, tačiau galima užsisakyti ilgesnį laiką už papildomą mokestį (€50).
                </p>
              </div>

              <div className="bg-sand/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-hunter-green mb-3">
                  Ar galima pasirinkti teminį pikniką?
                </h3>
                <p className="text-gray-700">
                  Žinoma! Jei turite ypatingą idėją ar temą – pasidalinkite, ir mes padarysime viską, kad ją įgyvendintume.
                </p>
              </div>

              <div className="bg-sand/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-hunter-green mb-3">
                  Ar piknikai tinkami vaikams?
                </h3>
                <p className="text-gray-700">
                  Taip! Galime pritaikyti aplinką šeimai ar vaikams – tereikia iš anksto informuoti.
                </p>
              </div>

              <div className="bg-sand/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-hunter-green mb-3">
                  Ar važiuojate į kitus miestus?
                </h3>
                <p className="text-gray-700">
                  Esame įsikūrę Klaipėdos/Neringos regionuose. Dėl kitų vietovių – parašykite, įvertinsime galimybę!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Pique Unique",
            "description": "Prabangūs pikninkai paplūdimyje Klaipėdoje ir Neringoje",
            "url": "https://piqueunique.lt",
            "logo": "https://piqueunique.lt/logo.png",
            "image": "https://piqueunique.lt/images/about-story.webp",
            "foundingDate": "2024",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Klaipėda",
              "addressRegion": "Klaipėdos apskritis",
              "addressCountry": "LT"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": "info@piqueunique.lt"
            },
            "sameAs": [
              "https://facebook.com/piqueunique",
              "https://instagram.com/piqueunique.lt"
            ]
          })
        }}
      />
    </main>
  );
} 