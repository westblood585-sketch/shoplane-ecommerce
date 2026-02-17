const Product = require('../models/Product')
const fs = require('fs')
const path = require('path')

const generateSitemap = async () => {
  try {
    const baseUrl = process.env.CLIENT_URL || 'https://myshop.com'
    
    // Tüm ürünleri al
    const products = await Product.find({ isActive: true }).select('_id updatedAt')
    
    // Kategoriler
    const categories = [
      'elektronik',
      'giyim',
      'ayakkabi',
      'aksesuar',
      'ev-yasam',
      'spor-outdoor',
      'kozmetik-kisisel-bakim',
      'kitap-muzik-film'
    ]

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`

    // Ana sayfa
    sitemap += `  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
`

    // Statik sayfalar
    const staticPages = [
      { url: '/products', priority: '0.9', changefreq: 'daily' },
      { url: '/bundles', priority: '0.8', changefreq: 'weekly' },
      { url: '/gift-cards/purchase', priority: '0.7', changefreq: 'monthly' },
      { url: '/about', priority: '0.6', changefreq: 'monthly' },
      { url: '/contact', priority: '0.6', changefreq: 'monthly' },
      { url: '/faq', priority: '0.5', changefreq: 'monthly' },
      { url: '/terms', priority: '0.4', changefreq: 'yearly' },
      { url: '/privacy', priority: '0.4', changefreq: 'yearly' },
      { url: '/guest-checkout', priority: '0.8', changefreq: 'monthly' },
      { url: '/guest-order-tracking', priority: '0.7', changefreq: 'monthly' }
    ]

    staticPages.forEach(page => {
      sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
`
    })

    // Kategoriler
    categories.forEach(category => {
      sitemap += `  <url>
    <loc>${baseUrl}/products?category=${category}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
`
    })

    // Ürünler
    products.forEach(product => {
      sitemap += `  <url>
    <loc>${baseUrl}/products/${product._id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${product.updatedAt.toISOString()}</lastmod>
  </url>
`
    })

    sitemap += '</urlset>'

    // Dosyayı kaydet
    const sitemapPath = path.join(__dirname, '../../public/sitemap.xml')
    fs.writeFileSync(sitemapPath, sitemap)

    console.log('✅ Sitemap generated successfully!')
    return sitemap
  } catch (error) {
    console.error('Sitemap generation error:', error)
    throw error
  }
}

module.exports = { generateSitemap }