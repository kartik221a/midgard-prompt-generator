import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token');
    const path = request.nextUrl.pathname;

    // Protected Routes
    if ((path.startsWith('/studio') || path.startsWith('/library') || path.startsWith('/admin')) && !token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Optional: Redirect authenticated users away from Landing Page to Studio?
    // if (path === '/' && token) {
    //   return NextResponse.redirect(new URL('/studio', request.url));
    // }

    return NextResponse.next();
}

export const config = {
    matcher: ['/studio', '/library', '/admin'],
};
