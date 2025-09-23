import { format, addHours } from 'date-fns';

export interface BookingData {
  id: string;
  location: string;
  date: Date;
  time: string;
  theme: string;
  guestCount: number;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export const generateICS = (booking: BookingData): string => {
  const startDate = new Date(booking.date);
  const [hours, minutes] = booking.time.split(':').map(Number);
  startDate.setHours(hours, minutes, 0, 0);
  
  const endDate = addHours(startDate, 3); // 3 hour duration
  
  const formatDate = (date: Date) => {
    return format(date, "yyyyMMdd'T'HHmmss'Z'");
  };

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Pique Unique//Booking//EN',
    'BEGIN:VEVENT',
    `UID:${booking.id}@pique-unique.lt`,
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:Pikniko rezervacija - ${booking.theme}`,
    `DESCRIPTION:Vieta: ${booking.location}\\nSvečiai: ${booking.guestCount}\\nKontaktai: ${booking.contactInfo.name} (${booking.contactInfo.phone})`,
    `LOCATION:${booking.location}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  
  return ics;
};

export const generateICSFile = (booking: BookingData): Buffer => {
  const icsContent = generateICS(booking);
  return Buffer.from(icsContent, 'utf-8');
};
