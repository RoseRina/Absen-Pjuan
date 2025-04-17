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

  return NextResponse.next();
} 