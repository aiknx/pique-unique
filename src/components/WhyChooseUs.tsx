import Image from 'next/image';

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-hunter-green mb-12">
          Kodėl rinktis Pique Unique
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-linen rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <Image
                src="/images/icons/temos.png"
                alt="Išskirtinės temos"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold text-hunter-green mb-3">
              Išskirtinės temos
            </h3>
            <p className="text-gray-700">
              Rinkitės iš mūsų kruopščiai paruoštų temų, kurios sukurs tobulą atmosferą jūsų ypatingai progai.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-linen rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <Image
                src="/images/icons/viskas.png"
                alt="Viskas apgalvota"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold text-hunter-green mb-3">
              Viskas apgalvota
            </h3>
            <p className="text-gray-700">
              Mes pasirūpiname viskuo nuo paruošimo iki sutvarkymo, kad jūs galėtumėte tiesiog mėgautis momentu.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-linen rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <Image
                src="/images/icons/momentai.png"
                alt="Nepamirštami momentai"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold text-hunter-green mb-3">
              Nepamirštami momentai
            </h3>
            <p className="text-gray-700">
              Kurkite brangius prisiminimus su mūsų tobulai paruoštais piknikais ir dėmesiu detalėms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 