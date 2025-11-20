/**
 * Next.js API Route Proxy
 * 
 * Proxies all API requests to the backend to avoid CORS issues during development.
 * In production, the frontend should make direct requests to the backend.
 */

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://apibackend-production-696e.up.railway.app';

/**
 * Helper function to build headers for proxied requests
 * Forwards Authorization header and other important headers
 */
function buildProxyHeaders(request: NextRequest): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Forward Authorization header if present (critical for authenticated requests)
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  return headers;
}

/**
 * Helper function to proxy request to backend
 */
async function proxyRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string,
  body?: string | null
) {
  try {
    const path = params.path.join('/');
    const searchParams = request.nextUrl.searchParams.toString();
    // Add /api prefix back when forwarding to backend
    const url = `${BACKEND_URL}/api/${path}${searchParams ? `?${searchParams}` : ''}`;

    const headers = buildProxyHeaders(request);

    const response = await fetch(url, {
      method,
      headers,
      body: body || undefined,
      cache: 'no-store',
    });

    // Handle non-JSON responses (e.g., 204 No Content)
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `API request failed: ${response.status} ${response.statusText}`,
      }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to backend' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const body = await request.json().catch(() => null);
  return proxyRequest(request, params, 'POST', body ? JSON.stringify(body) : null);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const body = await request.json().catch(() => null);
  return proxyRequest(request, params, 'PUT', body ? JSON.stringify(body) : null);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params, 'DELETE');
}

