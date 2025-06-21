import { useState } from 'react'
import { format } from 'date-fns'

export default function BookingForm() {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: '',
    guests: 2,
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form submission
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-heading font-bold text-primary-600 mb-6">Book Your Picnic</h2>
        
        <div className="space-y-4">
          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-neutral-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              min={format(new Date(), 'yyyy-MM-dd')}
              value={formData.date}
              onChange={handleChange}
              className="input mt-1"
              required
            />
          </div>

          {/* Time */}
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-neutral-700">
              Time
            </label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="input mt-1"
              required
            >
              <option value="">Select a time</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-neutral-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter picnic location"
              className="input mt-1"
              required
            />
          </div>

          {/* Number of Guests */}
          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-neutral-700">
              Number of Guests
            </label>
            <input
              type="number"
              id="guests"
              name="guests"
              min="2"
              max="10"
              value={formData.guests}
              onChange={handleChange}
              className="input mt-1"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-neutral-700">
              Special Requests
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any dietary restrictions or special requests?"
              className="input mt-1"
            />
          </div>
        </div>

        <div className="mt-6">
          <button type="submit" className="btn w-full">
            Continue to Add-ons
          </button>
        </div>
      </div>
    </form>
  )
} 