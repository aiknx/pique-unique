export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-hunter-green mb-12">
          Kodėl rinktis Pique Unique
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-linen rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-hunter-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-hunter-green mb-3">
              Įspūdingos temos
            </h3>
            <p className="text-gray-700">
              Rinkitės iš mūsų kruopščiai paruoštų temų, kurios sukurs tobulą atmosferą jūsų ypatingai progai.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-linen rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-hunter-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-hunter-green mb-3">
              Viskas įskaičiuota
            </h3>
            <p className="text-gray-700">
              Mes pasirūpiname viskuo nuo paruošimo iki sutvarkymo, kad jūs galėtumėte tiesiog mėgautis momentu.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-linen rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-hunter-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
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