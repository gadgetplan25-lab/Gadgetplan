import { getApiUrl } from "@/lib/config";

export default async function sitemap() {
    const baseUrl = 'https://gadgetplan.id'; // Replace with your actual domain

    // Static routes
    const routes = [
        '',
        '/products',
        '/blog',
        '/serviceGo',
        '/konsultasi',
        '/tukarTambah',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: route === '' ? 1 : 0.8,
    }));

    // You can add dynamic routes for products and blogs here in the future
    // by fetching from the API and mapping them to the sitemap format.

    return [...routes];
}
