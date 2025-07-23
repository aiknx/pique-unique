export default function Features() {
  return (
    <section className="py-16 bg-linen">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-hunter-green mb-6">
            Šiame greitame pasaulyje, kuriame visi skubame, tikras laikas kartu tampa didžiausia prabanga.
          </h2>
          <p className="text-xl text-gray-700">
            Nuo gėlių puokštės iki kruopščiai parinktų dekoracijų – viskas apgalvota tam, kad jūs galėtumėte tiesiog būti ir mėgautis akimirka.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-hunter-green/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-hunter-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-hunter-green mb-2">Lengvas Užsakymas</h3>
            <p className="text-gray-600">Kelių žingsnių rezervacija ir asmeninis konsultantas, kuris padės suplanuoti jūsų šventę.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-hunter-green/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-hunter-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-hunter-green mb-2">Personalizacija</h3>
            <p className="text-gray-600">Pritaikome kiekvieną detalę pagal jūsų pageidavimus ir progos tematiką.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-hunter-green/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-hunter-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-hunter-green mb-2">Kokybės Garantija</h3>
            <p className="text-gray-600">Aukščiausios kokybės inventorius ir nepriekaištingas aptarnavimas.</p>
          </div>
        </div>
      </div>
    </section>
  );
} 