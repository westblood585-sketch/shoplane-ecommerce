// OG Image Generator - Sharp ile dinamik resim oluştur
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, 'public', 'og-image.jpg');

// SVG Template - Branded OG Image
const svgImage = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <!-- Gradient Background -->
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#grad1)"/>
  
  <!-- Decorative circles -->
  <circle cx="100" cy="100" r="80" fill="rgba(255,255,255,0.1)"/>
  <circle cx="1100" cy="530" r="100" fill="rgba(255,255,255,0.1)"/>
  <circle cx="600" cy="-20" r="120" fill="rgba(255,255,255,0.05)"/>
  
  <!-- Logo/Brand Area -->
  <text x="60" y="80" font-size="48" font-weight="bold" fill="white" font-family="Arial, sans-serif">
    MyShop
  </text>
  
  <!-- Main Heading -->
  <text x="60" y="180" font-size="64" font-weight="bold" fill="white" font-family="Arial, sans-serif">
    En İyi Ürünler
  </text>
  <text x="60" y="260" font-size="64" font-weight="bold" fill="white" font-family="Arial, sans-serif">
    En Uygun Fiyatlar
  </text>
  
  <!-- Subheading -->
  <text x="60" y="340" font-size="32" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif">
    570+ Ürün • Ücretsiz Kargo • Hızlı Teslimat
  </text>
  
  <!-- Features -->
  <text x="60" y="420" font-size="24" fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif">
    ✓ Güvenli Ödeme
  </text>
  <text x="60" y="470" font-size="24" fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif">
    ✓ Hızlı Kargo
  </text>
  <text x="60" y="520" font-size="24" fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif">
    ✓ 7/24 Müşteri Desteği
  </text>
  
  <!-- Right side - Product Icons -->
  <g opacity="0.3">
    <!-- Smartphone icon -->
    <rect x="850" y="120" width="100" height="180" rx="10" fill="none" stroke="white" stroke-width="8"/>
    <rect x="870" y="140" width="60" height="120" fill="white"/>
    <circle cx="900" cy="280" r="8" fill="white"/>
    
    <!-- Shopping bag icon -->
    <path d="M 950 200 L 980 200 L 980 280 Q 980 300 960 300 L 970 300 L 970 340 L 950 340 L 950 300 L 960 300 Q 940 300 940 280 L 940 200 Z" fill="white" opacity="0.8"/>
  </g>
  
  <!-- CTA Bottom -->
  <rect x="60" y="550" width="300" height="60" rx="8" fill="white"/>
  <text x="210" y="590" font-size="28" font-weight="bold" fill="#667eea" font-family="Arial, sans-serif" text-anchor="middle">
    www.myshop.com
  </text>
</svg>
`;

async function generateOGImage() {
  try {
    console.log('📸 OG Image oluşturuluyor...');
    
    await sharp(Buffer.from(svgImage))
      .jpeg({ quality: 95, progressive: true })
      .toFile(outputPath);
    
    const stats = fs.statSync(outputPath);
    console.log(`✅ OG Image başarıyla oluşturuldu!`);
    console.log(`📍 Konum: ${outputPath}`);
    console.log(`📊 Boyut: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`📐 Çözünürlük: 1200x630 px`);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

generateOGImage();
