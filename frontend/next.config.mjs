import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Explicitly set the root to the parent directory to resolve the warning
    turbopack: {
        root: path.resolve(__dirname, '..'),
    },

    // Performance: Enable SWC minification
    swcMinify: true,

    images: {
        // Enable image optimization
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

        // Allow images from these domains
        remotePatterns: [
            // Development
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

    // Output optimization
    output: 'standalone',

    // Performance budgets
    onDemandEntries: {
        maxInactiveAge: 25 * 1000,
        pagesBufferLength: 2,
    },

    // Allow .well-known paths (for SSL certificate verification)
    async headers() {
        return [
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
    },

    // Production-only optimizations
    ...(process.env.NODE_ENV === 'production' && {
        productionBrowserSourceMaps: false,
        generateEtags: true,
    }),
};

export default nextConfig;

