import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Cek jika request menuju ke halaman admin (kecuali halaman login)
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    
    // Cek jika user sudah login
    const isLoggedIn = request.cookies.get('adminLoggedIn')?.value === 'true';
    
    if (!isLoggedIn) {
      // Redirect ke halaman login jika belum login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Mendapatkan response
  const response = NextResponse.next();

  // Tambahkan header CORS
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}

// Konfigurasi path yang akan diproses oleh middleware
export const config = {
  matcher: '/api/:path*',
}; 