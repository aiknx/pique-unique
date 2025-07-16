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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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