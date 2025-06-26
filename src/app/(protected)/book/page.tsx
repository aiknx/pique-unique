import Calendar from '@/components/booking/Calendar';
import BookingForm from '@/components/booking/BookingForm';
import AddOns from '@/components/booking/AddOns';

export default function BookPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Book Your Picnic Experience</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Calendar />
          <BookingForm />
        </div>
        <div>
          <AddOns />
        </div>
      </div>
    </div>
  );
} 