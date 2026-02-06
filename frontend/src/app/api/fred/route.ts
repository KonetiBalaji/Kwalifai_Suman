/**
 * @file route.ts
 * @author Balaji Koneti
 * @linkedin https://www.linkedin.com/in/balaji-koneti/
 * @github https://github.com/KonetiBalaji/kwalifai
 * 
 * Copyright (C) 2026 Balaji Koneti
 * All Rights Reserved.
 * 
 * This software is proprietary and confidential.
 * Unauthorized copying, modification, distribution, or use is prohibited.
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const FRED_API_KEY = '8cae904855af46d8a82e98440b4e88e7';
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const seriesId = searchParams.get('series_id');
    const observationStart = searchParams.get('observation_start');
    const observationEnd = searchParams.get('observation_end');

    if (!seriesId) {
      return NextResponse.json(
        { error: 'series_id is required' },
        { status: 400 }
      );
    }

    // Build FRED API URL
    const fredUrl = new URL(FRED_BASE_URL);
    fredUrl.searchParams.set('series_id', seriesId);
    fredUrl.searchParams.set('api_key', FRED_API_KEY);
    fredUrl.searchParams.set('file_type', 'json');
    fredUrl.searchParams.set('sort_order', 'asc');
    
    if (observationStart) {
      fredUrl.searchParams.set('observation_start', observationStart);
    }
    if (observationEnd) {
      fredUrl.searchParams.set('observation_end', observationEnd);
    }

    console.log('Proxying FRED API request:', fredUrl.toString());

    // Fetch from FRED API
    const response = await fetch(fredUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('FRED API error:', response.status, errorText);
      return NextResponse.json(
        { error: `FRED API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the data with CORS headers
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error: any) {
    console.error('Error proxying FRED API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from FRED API', details: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
