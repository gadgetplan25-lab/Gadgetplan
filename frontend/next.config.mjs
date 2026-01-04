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

    images: {
        // Enable image optimization
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

        // Allow images from these domains
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '4000',
                pathname: '/uploads/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '4000',
                pathname: '/public/**',
            },
            {
                protocol: 'https',
                hostname: '*.ngrok-free.dev',
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: '*.ngrok-free.dev',
                pathname: '/public/**',
            },
        ],

        // Minimize layout shift
        minimumCacheTTL: 60,
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
        optimizePackageImports: ['sweetalert2', 'swiper', 'recharts', 'lucide-react'],
    },
};

export default nextConfig;

