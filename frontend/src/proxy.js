import { NextResponse } from 'next/server';

export function proxy(request) {
    const { pathname } = request.nextUrl;

    // Allow .well-known paths (for SSL certificate verification, etc.)
    if (pathname.startsWith('/.well-known/')) {
        return NextResponse.next();
    }

    // Allow all other paths (no redirect)
    return NextResponse.next();
}

// Configure which paths the proxy runs on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    ],
};
