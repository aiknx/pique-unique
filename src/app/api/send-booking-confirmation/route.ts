import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const { customerEmail, bookingDetails } = await request.json();

    // Check if Resend is available
    if (!resend) {
      console.warn('Resend API key not configured, skipping email sending');
      return NextResponse.json({ 
        success: true, 
        message: 'Booking created successfully (email service not configured)' 
      });
    }

    // Send email to customer
    await resend.emails.send({
      from: 'Pique Unique <info@pique-unique.lt>',
      to: customerEmail,
      subject: 'Jūsų rezervacija gauta - Pique Unique',
      html: `
        <h1>Ačiū už rezervaciją!</h1>
        <p>Jūsų užsakymas buvo sėkmingai gautas ir netrukus bus peržiūrėtas.</p>
        <h2>Rezervacijos detalės:</h2>
        <ul>
          <li>Data: ${new Date(bookingDetails.date).toLocaleDateString('lt-LT')}</li>
          <li>Laikas: ${bookingDetails.timeSlot.start} - ${bookingDetails.timeSlot.end}</li>
          <li>Vieta: ${bookingDetails.location}</li>
          <li>Svečių skaičius: ${bookingDetails.guests}</li>
          <li>Tema: ${bookingDetails.themeName}</li>
          <li>Kaina: ${bookingDetails.themePrice} €</li>
        </ul>
        <p>Netrukus su Jumis susisieks mūsų komandos narys dėl detalių aptarimo.</p>
        <p>Jei turite klausimų, drąsiai kreipkitės į mus.</p>
      `,
    });

    // Send notification to admin
    await resend.emails.send({
      from: 'Pique Unique <info@pique-unique.lt>',
      to: process.env.ADMIN_EMAIL || 'admin@pique-unique.lt',
      subject: 'Nauja rezervacija - Pique Unique',
      html: `
        <h1>Gauta nauja rezervacija!</h1>
        <h2>Kliento informacija:</h2>
        <ul>
          <li>Vardas: ${bookingDetails.contactInfo.name}</li>
          <li>El. paštas: ${bookingDetails.contactInfo.email}</li>
          <li>Telefonas: ${bookingDetails.contactInfo.phone}</li>
        </ul>
        <h2>Rezervacijos detalės:</h2>
        <ul>
          <li>Data: ${new Date(bookingDetails.date).toLocaleDateString('lt-LT')}</li>
          <li>Laikas: ${bookingDetails.timeSlot.start} - ${bookingDetails.timeSlot.end}</li>
          <li>Vieta: ${bookingDetails.location}</li>
          <li>Svečių skaičius: ${bookingDetails.guests}</li>
          <li>Tema: ${bookingDetails.themeName}</li>
          <li>Kaina: ${bookingDetails.themePrice} €</li>
        </ul>
        ${bookingDetails.specialRequests ? `
          <h2>Papildomi pageidavimai:</h2>
          <p>${bookingDetails.specialRequests}</p>
        ` : ''}
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/bookings/${bookingDetails.id}">Peržiūrėti rezervaciją administracijos puslapyje</a></p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    );
  }
} 