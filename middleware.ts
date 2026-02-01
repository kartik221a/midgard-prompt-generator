import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token');
    const path = request.nextUrl.pathname;

    // Protected Routes - All tool routes and admin
    const protectedPaths = [
        '/tools/lyrics/studio',
        '/tools/lyrics/library',
        '/tools/coloring-book/studio',
        '/tools/coloring-book/library',
        '/admin'
    ];

    const isProtectedPath = protectedPaths.some(protectedPath =>
        path.startsWith(protectedPath)
    );

    if (isProtectedPath && !token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/tools/:path*', '/admin'],
};
