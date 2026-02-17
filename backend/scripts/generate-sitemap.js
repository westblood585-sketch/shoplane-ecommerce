#!/usr/bin/env node

/**
 * Dynamic Sitemap Generator
 * Localhost: http://localhost:5001
 * Production: https://your-domain.com
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:5001';
const BASE_URL = process.env.BASE_URL || 'http://localhost:5178';
const SITEMAP_PATH = path.join(__dirname, '../..', 'frontend/public/sitemap.xml');

async function generateSitemap() {
  try {
    console.log('📡 Fetching products from API...');
    
    // Fetch products from API
    const response = await axios.get(`${API_URL}/api/products?limit=1000`);
    const products = response.data.products || [];
    
    console.log(`✅ Found ${products.length} products`);
    
    // Generate product URLs
    const productUrls = products.map(product => `
  <url>
    <loc>${BASE_URL}/product/${product._id}</loc>
    <lastmod>${new Date(product.updatedAt || new Date()).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');
    
    // Extract categories from products
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    
    const categoryUrls = categories.map(category => `
  <url>
    <loc>${BASE_URL}/products?category=${encodeURIComponent(category)}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');
    
    // Static pages
    const staticUrls = `
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/products</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${BASE_URL}/contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${BASE_URL}/faq</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${BASE_URL}/privacy</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`;
    
    // Build complete sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticUrls}
${categoryUrls}
${productUrls}
</urlset>`;
    
    // Write to file
    fs.writeFileSync(SITEMAP_PATH, sitemap);
    
    console.log(`\n✅ Sitemap generated successfully!`);
    console.log(`📍 Location: ${SITEMAP_PATH}`);
    console.log(`📊 Statistics:`);
    console.log(`   - Static pages: 6`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Total URLs: ${6 + categories.length + products.length}`);
    console.log(`\n🚀 For production, run:`);
    console.log(`   BASE_URL=https://your-domain.com npm run generate-sitemap`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
  }
}

// Run generator
generateSitemap();
