import { NextRequest, NextResponse } from 'next/server';

// Mock data for development when Firebase emulator is not running
const MOCK_BOOKED_SLOTS = {
  'klaipeda': {
    '2025-07-23': ['10:00', '14:00', '18:00'],
    '2025-07-24': ['10:00', '18:00'],
    '2025-07-25': ['14:00'],
    '2025-07-26': ['10:00', '14:00', '18:00']
  },
  'juodkrante': {
    '2025-07-22': ['10:00', '18:00'],
    '2025-07-23': ['14:00', '18:00'],
    '2025-07-27': ['10:00', '14:00'],
    '2025-07-28': ['10:00', '14:00', '18:00']
  },
  'nida': {
    '2025-07-21': ['14:00', '18:00'],
    '2025-07-22': ['10:00', '14:00'],
    '2025-07-29': ['10:00', '18:00'],
    '2025-07-30': ['14:00', '18:00']
  },
  'palanga': {
    '2025-07-20': ['10:00', '14:00', '18:00'],
    '2025-07-21': ['10:00', '18:00'],
    '2025-07-31': ['14:00', '18:00']
  },
  'svencele': {
    '2025-07-19': ['10:00', '14:00'],
    '2025-07-20': ['14:00', '18:00'],
    '2025-08-01': ['10:00', '14:00', '18:00']
  }
};

export async function GET(request: NextRequest) {
  try {
    const location = request.nextUrl.searchParams.get('location') || 'klaipeda';
    const date = request.nextUrl.searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Missing date parameter' },
        { status: 400 }
      );
    }

    // For now, return mock data to avoid Firebase emulator issues
    const locationSlots = MOCK_BOOKED_SLOTS[location as keyof typeof MOCK_BOOKED_SLOTS] || {};
    const bookedSlots = (locationSlots as Record<string, string[]>)[date] || [];
    
    console.log(`Returning mock booked slots for ${location} on ${date}:`, bookedSlots);

    return NextResponse.json({
      bookedSlots,
      location,
      date
    });
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch booked slots',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 