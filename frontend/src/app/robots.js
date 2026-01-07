export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/admin/', '/profilePage/', '/wishlist/', '/cart/'],
        },
        sitemap: 'https://gadgetplan.id/sitemap.xml', // Replace with your actual domain
    }
}
