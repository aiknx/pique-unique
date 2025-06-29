'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import Reviews from '@/components/Reviews'
import Image from 'next/image'
import Icon from '@/components/Icon'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center bg-gradient-to-br from-hunter-green via-cambridge-blue to-verdigris">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="w-full h-full bg-[url('/images/pattern.svg')] bg-repeat" />
        </div>
        
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 text-white">
              Prabangūs Piknikai<br />
              <span className="text-cherry-blossom">Paplūdimyje</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              PIQUE UNIQUE tai ne tik piknikai, tai kruopščiai kurtos patirtys kviečiančios sustoti, būti su artimaisiais ir švęsti gyvenimą kartu.
            </p>
            <div className="flex gap-4">
              <Link href="/book" className="btn-primary text-lg px-8 py-3">
                Rezervuoti Dabar
              </Link>
              <Link href="/themes" className="btn-secondary text-lg px-8 py-3">
                Peržiūrėti Temas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Kodėl Rinktis Pique Unique
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-hunter-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Įspūdingos Temos</h3>
              <p className="text-gray-600">
                Rinkitės iš mūsų kruopščiai paruoštų temų, kurios sukurs tobulą atmosferą jūsų ypatingai progai.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-hunter-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Viskas Įskaičiuota</h3>
              <p className="text-gray-600">
                Mes pasirūpiname viskuo nuo paruošimo iki sutvarkymo, kad jūs galėtumėte tiesiog mėgautis momentu.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-hunter-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Nepamirštami Momentai</h3>
              <p className="text-gray-600">
                Kurkite brangius prisiminimus su mūsų tobulai paruoštais piknikais ir dėmesiu detalėms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-16 bg-linen">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-gray-700 leading-relaxed">
              Šiame greitame pasaulyje, kuriame visi skubame, tikras laikas kartu tampa didžiausia prabanga. Nuo gėlių puokštės iki kruopščiai parinktų dekoracijų – viskas apgalvota tam, kad jūs galėtumėte tiesiog būti ir mėgautis akimirka.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
