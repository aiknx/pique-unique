import BookingForm from '@/components/BookingForm'

export default function BookingPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl font-bold text-primary-600 mb-4">
          Book Your Luxury Picnic
        </h1>
        <p className="text-lg text-neutral-700">
          Choose your perfect date, time, and location for an unforgettable outdoor dining experience.
        </p>
      </div>

      <BookingForm />
    </div>
  )
} 