import { NextRequest, NextResponse } from 'next/server';

// Mock data for development when Firebase emulator is not running
const MOCK_BOOKED_DATES = {
  'klaipeda': [
    '2025-07-23', '2025-07-24', '2025-07-25', '2025-07-26'
  ],
  'juodkrante': [
    '2025-07-22', '2025-07-23', '2025-07-27', '2025-07-28'
  ],
  'nida': [
    '2025-07-21', '2025-07-22', '2025-07-29', '2025-07-30'
  ],
  'palanga': [
    '2025-07-20', '2025-07-21', '2025-07-31'
  ],
  'svencele': [
    '2025-07-19', '2025-07-20', '2025-08-01'
  ]
};

export async function GET(request: NextRequest) {
  try {
    const location = request.nextUrl.searchParams.get('location') || 'klaipeda';
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');

    // For now, return mock data to avoid Firebase emulator issues
    const bookedDates = MOCK_BOOKED_DATES[location as keyof typeof MOCK_BOOKED_DATES] || [];
    
    console.log(`Returning mock booked dates for ${location}:`, bookedDates);

    return NextResponse.json({
      bookedDates,
      location,
      startDate,
      endDate
    });
  } catch (error) {
    console.error('Error fetching booked dates:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch booked dates',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 