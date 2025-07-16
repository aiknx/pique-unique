'use client';

import { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase/schema';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

const emailTemplates: EmailTemplate[] = [
  {
    id: 'booking-confirmation',
    name: 'Užsakymo patvirtinimas',
    subject: 'Jūsų pikniko užsakymas patvirtintas',
    content: `Sveiki, {name}!

Džiaugiamės galėdami patvirtinti Jūsų pikniko užsakymą.

Data: {date}
Laikas: {time}
Vieta: {location}
Tema: {theme}
Svečių skaičius: {guests}

Jei turite klausimų, susisiekite su mumis.

Pagarbiai,
Pique Unique komanda`
  },
  {
    id: 'booking-reminder',
    name: 'Priminimas apie pikniką',
    subject: 'Priminimas apie artėjantį pikniką',
    content: `Sveiki, {name}!

Primename, kad Jūsų piknikas įvyks rytoj!

Data: {date}
Laikas: {time}
Vieta: {location}

Nekantraujame Jus pamatyti!

Pagarbiai,
Pique Unique komanda`
  },
  {
    id: 'custom-message',
    name: 'Pasirinktinis pranešimas',
    subject: '',
    content: ''
  }
];

export default function EmailsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(emailTemplates[0]);
  const [subject, setSubject] = useState(emailTemplates[0].subject);
  const [content, setContent] = useState(emailTemplates[0].content);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [recipientType, setRecipientType] = useState<'all' | 'upcoming' | 'custom'>('all');
  const [customEmails, setCustomEmails] = useState('');

  const handleTemplateChange = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId) || emailTemplates[0];
    setSelectedTemplate(template);
    setSubject(template.subject);
    setContent(template.content);
  };

  const fetchRecipients = async () => {
    try {
      setLoading(true);
      setError(null);
      let recipientsQuery;

      if (recipientType === 'upcoming') {
        // Fetch customers with upcoming bookings (next 7 days)
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        recipientsQuery = query(
          collection(db, COLLECTIONS.BOOKINGS),
          where('date', '>=', new Date()),
          where('date', '<=', nextWeek)
        );
      } else {
        // Fetch all customers
        recipientsQuery = query(collection(db, COLLECTIONS.BOOKINGS));
      }

      const snapshot = await getDocs(recipientsQuery);
      const emails = snapshot.docs.map(doc => doc.data().contactInfo.email);
      const uniqueEmails = [...new Set(emails)];
      setRecipients(uniqueEmails);
    } catch (err) {
      console.error('Error fetching recipients:', err);
      setError('Klaida gaunant gavėjų sąrašą');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const finalRecipients = recipientType === 'custom'
        ? customEmails.split(',').map(email => email.trim())
        : recipients;

      // Send email through API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: finalRecipients,
          subject,
          content
        }),
      });

      if (!response.ok) {
        throw new Error('Klaida siunčiant laišką');
      }

      setSuccess('Laiškai sėkmingai išsiųsti!');
    } catch (err) {
      console.error('Error sending emails:', err);
      setError('Klaida siunčiant laiškus');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Laiškų Siuntimas</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        {/* Template Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Šablonas
          </label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter"
            value={selectedTemplate.id}
            onChange={(e) => handleTemplateChange(e.target.value)}
          >
            {emailTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        {/* Recipients Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gavėjai
          </label>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-hunter"
                  name="recipientType"
                  value="all"
                  checked={recipientType === 'all'}
                  onChange={(e) => setRecipientType('all')}
                />
                <span className="ml-2">Visi klientai</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-hunter"
                  name="recipientType"
                  value="upcoming"
                  checked={recipientType === 'upcoming'}
                  onChange={(e) => setRecipientType('upcoming')}
                />
                <span className="ml-2">Artėjantys užsakymai</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-hunter"
                  name="recipientType"
                  value="custom"
                  checked={recipientType === 'custom'}
                  onChange={(e) => setRecipientType('custom')}
                />
                <span className="ml-2">Pasirinktiniai gavėjai</span>
              </label>
            </div>

            {recipientType === 'custom' ? (
              <textarea
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter"
                rows={3}
                placeholder="Įveskite el. pašto adresus, atskirtus kableliais"
                value={customEmails}
                onChange={(e) => setCustomEmails(e.target.value)}
              />
            ) : (
              <button
                className="btn-secondary"
                onClick={fetchRecipients}
                disabled={loading}
              >
                {loading ? 'Gaunami gavėjai...' : 'Gauti gavėjų sąrašą'}
              </button>
            )}

            {recipients.length > 0 && recipientType !== 'custom' && (
              <div className="text-sm text-gray-600">
                Bus išsiųsta {recipients.length} gavėjams
              </div>
            )}
          </div>
        </div>

        {/* Email Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tema
          </label>
          <input
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* Email Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Turinys
          </label>
          <textarea
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <p className="mt-2 text-sm text-gray-500">
            Galite naudoti šiuos kintamuosius: {'{name}'}, {'{date}'}, {'{time}'}, {'{location}'}, {'{theme}'}, {'{guests}'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <div className="flex justify-end">
          <button
            className="btn-primary"
            onClick={handleSend}
            disabled={loading || (!customEmails && recipients.length === 0)}
          >
            {loading ? 'Siunčiama...' : 'Siųsti laišką'}
          </button>
        </div>
      </div>
    </div>
  );
} 