import { Helmet } from 'react-helmet-async'

function SEO({
  title = 'MyShop - En İyi Ürünler, En Uygun Fiyatlar',
  description = 'MyShop\'ta 570+ ürün, ücretsiz kargo, hızlı teslimat ve güvenli ödeme. Elektronik, giyim, ayakkabı ve daha fazlası. Trendyol\'dan daha iyi!',
  keywords = 'online alışveriş, e-ticaret, ucuz ürünler, indirimli ürünler, ücretsiz kargo, elektronik, giyim, ayakkabı',
  image = 'https://myshop-dogukanbayar.vercel.app/og-image.jpg',
  url = 'https://myshop-dogukanbayar.vercel.app',
  type = 'website',
  author = 'MyShop',
  publishedTime,
  modifiedTime,
  productData,
  breadcrumbList
}) {
  const fullUrl = url.startsWith('http') ? url : `https://myshop-dogukanbayar.vercel.app${url}`
  
  // Schema.org Structured Data
  const schemas = []

  // Organization Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MyShop',
    url: 'https://myshop-dogukanbayar.vercel.app',
    logo: 'https://myshop-dogukanbayar.vercel.app/icons/icon-512x512.png',
    description: 'Türkiye\'nin en iyi online alışveriş platformu',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+90-555-123-4567',
      contactType: 'customer service',
      email: 'destek@myshop.com',
      availableLanguage: ['Turkish', 'English']
    },
    sameAs: [
      'https://facebook.com/myshop',
      'https://twitter.com/myshop',
      'https://instagram.com/myshop',
      'https://youtube.com/myshop'
    ]
  })

  // WebSite Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MyShop',
    url: 'https://myshop-dogukanbayar.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://myshop-dogukanbayar.vercel.app/products?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  })

  // Product Schema (ürün sayfası için)
  if (productData) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: productData.name,
      image: productData.images,
      description: productData.description,
      brand: {
        '@type': 'Brand',
        name: productData.brand
      },
      offers: {
        '@type': 'Offer',
        url: fullUrl,
        priceCurrency: 'TRY',
        price: productData.price,
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: productData.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition'
      },
      aggregateRating: productData.rating && {
        '@type': 'AggregateRating',
        ratingValue: productData.rating,
        reviewCount: productData.numReviews,
        bestRating: 5,
        worstRating: 1
      }
    })
  }

  // Breadcrumb Schema
  if (breadcrumbList) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbList.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `https://myshop.vercel.app${item.path}`
      }))
    })
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph (Facebook) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="MyShop" />
      <meta property="og:locale" content="tr_TR" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@myshop" />
      <meta name="twitter:creator" content="@myshop" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="MyShop" />

      {/* Robots */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />

      {/* Language */}
      <meta httpEquiv="content-language" content="tr" />
      <link rel="alternate" hrefLang="tr" href={fullUrl} />
      <link rel="alternate" hrefLang="en" href={fullUrl.replace('.vercel.app', '.vercel.app/en')} />

      {/* Structured Data (JSON-LD) */}
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}

      {/* Preconnect */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
    </Helmet>
  )
}

export default SEO