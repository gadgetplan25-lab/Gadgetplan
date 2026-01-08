import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env explicitly with ABSOLUTE path
const envPath = path.resolve(__dirname, '.env');
const result = dotenv.config({ path: envPath });

const ADMIN_PHONE = process.env.NEXT_PUBLIC_ADMIN_PHONE || "6282122144305";

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Inject environment variables explicitly
    env: {
        NEXT_PUBLIC_ADMIN_PHONE: ADMIN_PHONE,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
    },

    // Explicitly set the root to the parent directory to resolve the warning
    turbopack: {
        root: path.resolve(__dirname, '..'),
    },

    // Performance: Enable SWC minification - Removed as it's default/deprecated in newer versions
    // swcMinify: true,

    images: {
        // Disable optimization to fix image loading issues
        unoptimized: true,

        // Enable image optimization (production only - config ignored if unoptimized is true)
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

        // Allow images from these domains
        remotePatterns: [
            // Development - Localhost
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8080',
                pathname: '/public/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8080',
                pathname: '/uploads/**',
            },
            // Development - 127.0.0.1 (Fix for private IP resolution)
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8080',
                pathname: '/public/**',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8080',
                pathname: '/uploads/**',
            },
            // Production
            {
                protocol: 'https',
                hostname: 'api.gadgetplan.id',
                pathname: '/public/**',
            },
            {
                protocol: 'https',
                hostname: 'api.gadgetplan.id',
                pathname: '/uploads/**',
            },
        ],

        // Minimize layout shift
        minimumCacheTTL: 60,
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },

    // Enable compression
    compress: true,

    // Disable x-powered-by header
    poweredByHeader: false,

    // Compiler optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? {
            exclude: ['error', 'warn'],
        } : false,
    },

    // Experimental features for better performance
    experimental: {
        optimizePackageImports: ['sweetalert2', 'swiper', 'recharts', 'lucide-react', 'react-icons'],
        optimizeCss: true,
        // Reduce client-side JavaScript
        optimizeServerReact: true,
    },

    // Strict mode for better performance
    reactStrictMode: true,

    // Modularize imports for tree shaking
    modularizeImports: {
        'react-icons': {
            transform: 'react-icons/{{member}}',
        },
        // lucide-react removed - handled by optimizePackageImports
    },

    // Performance budgets
    onDemandEntries: {
        maxInactiveAge: 25 * 1000,
        pagesBufferLength: 2,
    },

    // Allow .well-known paths (for SSL certificate verification)
    async headers() {
        const headers = [
            {
                source: '/.well-known/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate',
                    },
                ],
            },
        ];

        // Disable cache in development
        if (process.env.NODE_ENV === 'development') {
            headers.push({
                source: '/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    },
                    {
                        key: 'Pragma',
                        value: 'no-cache',
                    },
                    {
                        key: 'Expires',
                        value: '0',
                    },
                ],
            });
        }

        return headers;
    },

    // Production-only optimizations
    ...(process.env.NODE_ENV === 'production' && {
        productionBrowserSourceMaps: false,
        generateEtags: true,
    }),
};

export default nextConfig;

