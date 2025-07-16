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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-hunter-green mb-2">Lengvas Užsakymas</h3>
            <p className="text-gray-600">Kelių žingsnių rezervacija ir asmeninis konsultantas, kuris padės suplanuoti jūsų šventę.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-hunter-green/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-hunter-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-hunter-green mb-2">Personalizacija</h3>
            <p className="text-gray-600">Pritaikome kiekvieną detalę pagal jūsų pageidavimus ir progos tematiką.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-hunter-green/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-hunter-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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