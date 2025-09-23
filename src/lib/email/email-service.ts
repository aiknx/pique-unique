import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { generateICS, type BookingData } from './ics-generator';

interface EmailConfig {
  provider: 'resend' | 'smtp';
  resendApiKey?: string;
  smtpConfig?: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
}

class EmailService {
  private config: EmailConfig;
  private resend?: Resend;
  private transporter?: nodemailer.Transporter;

  constructor() {
    this.config = this.getEmailConfig();
    this.initializeProvider();
  }

  private getEmailConfig(): EmailConfig {
    // Prefer Resend if API key is available
    if (process.env.RESEND_API_KEY) {
      return {
        provider: 'resend',
        resendApiKey: process.env.RESEND_API_KEY,
      };
    }

    // Fallback to SMTP
    return {
      provider: 'smtp',
      smtpConfig: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    };
  }

  private initializeProvider() {
    if (this.config.provider === 'resend' && this.config.resendApiKey) {
      this.resend = new Resend(this.config.resendApiKey);
    } else if (this.config.provider === 'smtp' && this.config.smtpConfig) {
      this.transporter = nodemailer.createTransport({
        host: this.config.smtpConfig.host,
        port: this.config.smtpConfig.port,
        secure: this.config.smtpConfig.port === 465,
        auth: {
          user: this.config.smtpConfig.user,
          pass: this.config.smtpConfig.pass,
        },
      });
    }
  }

  async sendBookingConfirmation(booking: BookingData): Promise<void> {
    const icsContent = generateICS(booking);
    const emailContent = this.generateBookingEmailHTML(booking);

    if (this.resend) {
      await this.sendViaResend(booking.contactInfo.email, emailContent, icsContent);
    } else if (this.transporter) {
      await this.sendViaSMTP(booking.contactInfo.email, emailContent, icsContent);
    } else {
      console.log('Email service not configured, skipping email send');
      console.log('Would send to:', booking.contactInfo.email);
      console.log('ICS content:', icsContent);
    }
  }

  async sendAdminNotification(booking: BookingData): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.log('ADMIN_EMAIL not configured, skipping admin notification');
      return;
    }

    const emailContent = this.generateAdminNotificationHTML(booking);

    if (this.resend) {
      await this.resend.emails.send({
        from: 'Pique Unique <noreply@pique-unique.lt>',
        to: adminEmail,
        subject: `Nauja rezervacija - ${booking.contactInfo.name}`,
        html: emailContent,
      });
    } else if (this.transporter) {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: adminEmail,
        subject: `Nauja rezervacija - ${booking.contactInfo.name}`,
        html: emailContent,
      });
    }
  }

  private async sendViaResend(to: string, html: string, icsContent: string): Promise<void> {
    if (!this.resend) throw new Error('Resend not initialized');

    await this.resend.emails.send({
      from: 'Pique Unique <noreply@pique-unique.lt>',
      to,
      subject: 'Jūsų pikniko rezervacija patvirtinta',
      html,
      attachments: [
        {
          filename: 'pikniko-rezervacija.ics',
          content: icsContent,
        },
      ],
    });
  }

  private async sendViaSMTP(to: string, html: string, icsContent: string): Promise<void> {
    if (!this.transporter) throw new Error('SMTP transporter not initialized');

    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Jūsų pikniko rezervacija patvirtinta',
      html,
      attachments: [
        {
          filename: 'pikniko-rezervacija.ics',
          content: icsContent,
        },
      ],
    });
  }

  private generateBookingEmailHTML(booking: BookingData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Pikniko rezervacija patvirtinta</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Jūsų pikniko rezervacija patvirtinta!</h1>
          </div>
          <div class="content">
            <p>Sveiki ${booking.contactInfo.name},</p>
            <p>Dėkojame už rezervaciją! Jūsų pikniko rezervacija sėkmingai patvirtinta.</p>
            
            <div class="booking-details">
              <h3>Rezervacijos detalės:</h3>
              <div class="detail-row">
                <span><strong>Vieta:</strong></span>
                <span>${booking.location}</span>
              </div>
              <div class="detail-row">
                <span><strong>Data:</strong></span>
                <span>${booking.date.toLocaleDateString('lt-LT')}</span>
              </div>
              <div class="detail-row">
                <span><strong>Laikas:</strong></span>
                <span>${booking.time}</span>
              </div>
              <div class="detail-row">
                <span><strong>Tema:</strong></span>
                <span>${booking.theme}</span>
              </div>
              <div class="detail-row">
                <span><strong>Svečių skaičius:</strong></span>
                <span>${booking.guestCount}</span>
              </div>
            </div>

            <p>📅 Kalendoriaus failas prikabintas prie šio laiško - galite jį pridėti prie savo kalendoriaus.</p>
            
            <p>Jei turite klausimų, susisiekite su mumis:</p>
            <ul>
              <li>📧 El. paštas: info@pique-unique.lt</li>
              <li>📞 Telefonas: +370 600 00000</li>
            </ul>
          </div>
          <div class="footer">
            <p>Su pagarba,<br>Pique Unique komanda</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateAdminNotificationHTML(booking: BookingData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nauja rezervacija</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #DC2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Nauja rezervacija</h1>
          </div>
          <div class="content">
            <p>Gauta nauja pikniko rezervacija:</p>
            
            <div class="booking-details">
              <h3>Rezervacijos detalės:</h3>
              <div class="detail-row">
                <span><strong>Rezervacijos ID:</strong></span>
                <span>${booking.id}</span>
              </div>
              <div class="detail-row">
                <span><strong>Klientas:</strong></span>
                <span>${booking.contactInfo.name}</span>
              </div>
              <div class="detail-row">
                <span><strong>El. paštas:</strong></span>
                <span>${booking.contactInfo.email}</span>
              </div>
              <div class="detail-row">
                <span><strong>Telefonas:</strong></span>
                <span>${booking.contactInfo.phone}</span>
              </div>
              <div class="detail-row">
                <span><strong>Vieta:</strong></span>
                <span>${booking.location}</span>
              </div>
              <div class="detail-row">
                <span><strong>Data:</strong></span>
                <span>${booking.date.toLocaleDateString('lt-LT')}</span>
              </div>
              <div class="detail-row">
                <span><strong>Laikas:</strong></span>
                <span>${booking.time}</span>
              </div>
              <div class="detail-row">
                <span><strong>Tema:</strong></span>
                <span>${booking.theme}</span>
              </div>
              <div class="detail-row">
                <span><strong>Svečių skaičius:</strong></span>
                <span>${booking.guestCount}</span>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
