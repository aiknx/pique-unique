import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const LOCATIONS = {
  'juodkrante': 'Juodkrantė',
  'nida': 'Nida',
  'klaipeda': 'Klaipėda',
  'palanga': 'Palanga',
  'svencele': 'Svencelė',
  'other': 'Kita vieta'
};

const THEMES = {
  'undiniu': 'Undinių',
  'feju': 'Fėjų',
  'laumiu': 'Laumių',
  'disco': 'Disco'
};

const ADDITIONAL_SERVICES = {
  'acala': 'ACALA Skonių kelionė',
  'maar': 'MAAR kvapų degustacija',
  'painting': 'Tapymo užsiėmimas',
  'plates': 'Užkandžių lėkštės'
};

export async function POST(request: Request) {
  try {
    const { bookingDetails } = await request.json();

    // Check if Resend is available
    if (!resend) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Resend API key not configured, skipping admin notification email');
      }
      return NextResponse.json({ 
        success: true, 
        message: 'Admin notification skipped (email service not configured)' 
      });
    }

    const locationName = LOCATIONS[bookingDetails.location as keyof typeof LOCATIONS] || bookingDetails.location;
    const themeName = THEMES[bookingDetails.theme as keyof typeof THEMES] || bookingDetails.theme;
    
    // Format additional services
    const additionalServicesList = bookingDetails.additionalServices
      ?.map((serviceId: string) => ADDITIONAL_SERVICES[serviceId as keyof typeof ADDITIONAL_SERVICES] || serviceId)
      .join(', ') || 'Nėra';

    // Send notification to admin
    await resend.emails.send({
      from: 'Pique Unique <info@pique-unique.lt>',
      to: process.env.ADMIN_EMAIL || 'admin@pique-unique.lt',
      subject: `Nauja rezervacija #${bookingDetails.id} - Pique Unique`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a472a; border-bottom: 2px solid #1a472a; padding-bottom: 10px;">
            🎉 Nauja rezervacija gauta!
          </h1>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1a472a; margin-top: 0;">Rezervacijos ID: ${bookingDetails.id}</h2>
            <p style="margin: 5px 0;"><strong>Data:</strong> ${new Date(bookingDetails.date).toLocaleDateString('lt-LT')}</p>
            <p style="margin: 5px 0;"><strong>Laikas:</strong> ${bookingDetails.time}</p>
            <p style="margin: 5px 0;"><strong>Vieta:</strong> ${locationName}</p>
            <p style="margin: 5px 0;"><strong>Tema:</strong> ${themeName}</p>
            <p style="margin: 5px 0;"><strong>Svečių skaičius:</strong> ${bookingDetails.guestCount}</p>
            <p style="margin: 5px 0;"><strong>Bendra kaina:</strong> €${bookingDetails.totalPrice}</p>
          </div>

          ${bookingDetails.contactInfo?.name || bookingDetails.contactInfo?.email ? `
          <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1a472a; margin-top: 0;">Kliento informacija:</h3>
            ${bookingDetails.contactInfo?.name ? `<p style="margin: 5px 0;"><strong>Vardas:</strong> ${bookingDetails.contactInfo.name}</p>` : ''}
            ${bookingDetails.contactInfo?.email ? `<p style="margin: 5px 0;"><strong>El. paštas:</strong> ${bookingDetails.contactInfo.email}</p>` : ''}
            ${bookingDetails.contactInfo?.phone ? `<p style="margin: 5px 0;"><strong>Telefonas:</strong> ${bookingDetails.contactInfo.phone}</p>` : ''}
          </div>
          ` : ''}

          ${bookingDetails.additionalServices?.length > 0 ? `
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1a472a; margin-top: 0;">Papildomos paslaugos:</h3>
            <p style="margin: 5px 0;">${additionalServicesList}</p>
            <p style="margin: 5px 0;"><strong>Papildomų paslaugų kaina:</strong> €${bookingDetails.additionalPrice}</p>
          </div>
          ` : ''}

          <div style="background-color: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1a472a; margin-top: 0;">Kainų detalės:</h3>
            <p style="margin: 5px 0;"><strong>Pagrindinė kaina:</strong> €${bookingDetails.basePrice}</p>
            ${bookingDetails.additionalPrice > 0 ? `<p style="margin: 5px 0;"><strong>Papildomos paslaugos:</strong> €${bookingDetails.additionalPrice}</p>` : ''}
            <p style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #1a472a;"><strong>Bendra kaina:</strong> €${bookingDetails.totalPrice}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/bookings/${bookingDetails.id}" 
               style="background-color: #1a472a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Peržiūrėti rezervaciją administracijos puslapyje
            </a>
          </div>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 14px; color: #6c757d;">
            <p style="margin: 0;">Šis el. laiškas buvo išsiųstas automatiškai iš Pique Unique rezervacijos sistemos.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error sending admin notification email:', error);
      }
    return NextResponse.json(
      { error: 'Failed to send admin notification email' },
      { status: 500 }
    );
  }
} 