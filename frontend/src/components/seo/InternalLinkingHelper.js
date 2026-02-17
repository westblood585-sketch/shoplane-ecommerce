/**
 * Internal Linking Helper for SEO
 * 
 * This utility provides strategic internal links to:
 * 1. Help Google crawl the entire site
 * 2. Distribute PageRank to important pages
 * 3. Keep users on site longer
 * 4. Improve ranking for target keywords
 */

export const internalLinks = {
  // Primary navigation pages (highest priority)
  primary: [
    { label: 'Ana Sayfa', path: '/', keywords: 'e-ticaret, shopping' },
    { label: 'Ürünler', path: '/products', keywords: 'products, categories' },
    { label: 'Sepetim', path: '/cart', keywords: 'shopping cart, checkout' },
    { label: 'Giriş Yap', path: '/login', keywords: 'login, account' },
  ],

  // Category pages (important for content clustering)
  categories: [
    { label: 'Elektronik', path: '/products?category=Elektronik', keywords: 'electronics' },
    { label: 'Giyim', path: '/products?category=Giyim', keywords: 'clothing' },
    { label: 'Ayakkabı', path: '/products?category=Ayakkabı', keywords: 'shoes' },
    { label: 'Spor', path: '/products?category=Spor', keywords: 'sports' },
    { label: 'Ev & Yaşam', path: '/products?category=Ev & Yaşam', keywords: 'home' },
    { label: 'Kozmetik', path: '/products?category=Kozmetik', keywords: 'beauty' },
  ],

  // Info pages (trust signals + authority)
  info: [
    { label: 'Hakkımızda', path: '/about', keywords: 'about us, company' },
    { label: 'İletişim', path: '/contact', keywords: 'contact us, support' },
    { label: 'SSS', path: '/faq', keywords: 'FAQ, help, questions' },
    { label: 'Gizlilik Politikası', path: '/privacy', keywords: 'privacy policy, terms' },
  ],

  // User account pages
  account: [
    { label: 'Profilim', path: '/profile', keywords: 'account, profile' },
    { label: 'Siparişlerim', path: '/orders', keywords: 'orders, purchases' },
    { label: 'Adreslerim', path: '/addresses', keywords: 'addresses' },
    { label: 'Favorilerim', path: '/favorites', keywords: 'favorites, wishlist' },
  ],

  // Premium features
  premium: [
    { label: 'Bundleler', path: '/bundles', keywords: 'bundles, deals' },
    { label: 'Kart Satın Al', path: '/purchase-gift-card', keywords: 'gift cards' },
    { label: 'Ön Siparişler', path: '/pre-orders', keywords: 'pre-orders' },
    { label: 'Abonelikler', path: '/subscriptions', keywords: 'subscriptions' },
  ],
};

/**
 * Get anchor text with keywords for a link
 * Helps with keyword relevance
 */
export function getAnchorText(label, keywords) {
  // Primary keyword from label, secondary from keywords array
  return label;
}

/**
 * Generate related category links for a product
 * (Use category from product data)
 */
export function getRelatedCategoryLinks(productCategory, limit = 3) {
  const allCategories = internalLinks.categories;
  
  // Get current category + 2 others
  return allCategories.filter(cat => 
    cat.label.toLowerCase().includes(productCategory?.toLowerCase() || '')
  ).slice(0, limit);
}

/**
 * Get all footer links for sitemap-like structure
 */
export function getFooterLinks() {
  return {
    'Alışveriş': internalLinks.primary.slice(1, 3),
    'Hesap': internalLinks.account.slice(0, 2),
    'Bilgi': internalLinks.info,
    'Özel': internalLinks.premium.slice(0, 2),
  };
}

/**
 * Contextual links based on current page
 * Show relevant pages to user based on where they are
 */
export function getContextualLinks(currentPath) {
  if (currentPath.includes('/products/')) {
    // On product detail → link to related categories + home
    return {
      primary: [internalLinks.primary[1]], // Products
      related: internalLinks.categories.slice(0, 3),
      breadcrumb: [internalLinks.primary[0]], // Home
    };
  }
  
  if (currentPath.includes('/products')) {
    // On products list → link to categories + premium features
    return {
      categories: internalLinks.categories,
      premium: internalLinks.premium,
    };
  }

  if (currentPath.includes('/cart') || currentPath.includes('/checkout')) {
    // On cart → link to products + account pages
    return {
      continueShop: internalLinks.primary[1],
      account: internalLinks.account.slice(0, 1),
    };
  }

  return {
    header: internalLinks.primary,
    footer: internalLinks.info,
  };
}

/**
 * Schema.ld markup generation for BreadcrumbList
 * (Already implemented in Breadcrumb component)
 */
export function generateBreadcrumbSchema(breadcrumbs) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.url,
    })),
  };
}

/**
 * Internal link tracking for analytics
 * Track which internal links users click (for optimization)
 */
export function trackInternalLinkClick(linkLabel, linkPath) {
  // Can be used with analytics service
  if (window.trackJourneyTouchpoint) {
    window.trackJourneyTouchpoint('internal_link_click', {
      link: linkLabel,
      destination: linkPath,
    });
  }
}
