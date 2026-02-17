/**
 * Organization Schema
 * Globally available SEO schema for entire site
 * Shows company info in Google Knowledge Panel
 */

import { useEffect } from 'react';

export function OrganizationSchema() {
  useEffect(() => {
    // Create script element for Organization Schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'MyShop',
      'url': 'http://localhost:5178', // Will be replaced with production URL
      'logo': 'http://localhost:5178/og-image.svg',
      'description': 'Modern e-commerce platform with 570+ products, PWA support, offline mode, and dark theme.',
      'sameAs': [
        'https://facebook.com/myshop',
        'https://twitter.com/myshop',
        'https://instagram.com/myshop',
        'https://linkedin.com/company/myshop'
      ],
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+1-XXX-XXX-XXXX',
        'contactType': 'Customer Service',
        'url': 'http://localhost:5178/contact'
      },
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': 'US',
        'addressLocality': 'City',
        'addressRegion': 'State',
        'postalCode': 'XXXXX',
        'streetAddress': 'XXX Main Street'
      },
      'founder': {
        '@type': 'Person',
        'name': 'Your Name'
      },
      'foundingDate': '2024-01-01',
      'areaServed': {
        '@type': 'Country',
        'name': 'United States'
      },
      'priceRange': '$$'
    };
    
    script.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(script);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null;
}

export default OrganizationSchema;
