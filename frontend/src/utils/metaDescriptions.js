/**
 * Meta Description Optimizer
 * Use this component on each page to set optimized meta descriptions
 * for better CTR in search results (160 chars max)
 */

import { useEffect } from 'react';

export function useMetaDescription(description, title) {
  useEffect(() => {
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description.slice(0, 160); // Google shows ~160 chars
    
    // Update page title
    if (title) {
      document.title = title;
    }
  }, [description, title]);
}

/**
 * Pre-built optimized descriptions for common pages
 * Use these as templates for other pages
 */
export const metaDescriptions = {
  home: {
    title: 'MyShop - E-Ticaret Platformu | 570+ Ürün',
    description: '570+ premium ürün, hızlı kargo, %100 güvenli ödeme. PWA ile offline alışveriş yapın. Ücretsiz teslimat 200₺+',
  },
  products: {
    title: 'Ürünler - MyShop | Elektronik, Giyim, Ayakkabı',
    description: 'En popüler kategorilerde ürünler: elektronik, giyim, ayakkabı, spor, ev, kozmetik. Hızlı kargo, güvenli ödeme.',
  },
  productDetail: {
    title: '{productName} | MyShop',
    description: 'Satın al: {productName} - {price} - {numReviews} değerlendirme, ⭐{rating} puan. Ücretsiz kargo, 30 gün para iadesi.',
  },
  cart: {
    title: 'Alışveriş Sepeti - MyShop',
    description: 'Sepetinizdeki {itemCount} ürünü kontrol edin. Güvenli ödeme seçenekleri: Kredi kartı, e-cüzdan, banka havalesi.',
  },
  about: {
    title: 'Hakkımızda - MyShop | Modern E-Ticaret',
    description: 'MyShop, kullanıcı deneyimini ön planda tutan modern bir e-ticaret platformu. PWA teknolojisi ile online shopping devrimini yaratıyoruz.',
  },
  contact: {
    title: 'İletişim - MyShop | Bizer ile İletişime Geçin',
    description: 'Sorularınız mı var? MyShop müşteri hizmetleri ekibi 7/24 sizin hizmetinizde. Canlı sohbet, email, telefon desteği.',
  },
  faq: {
    title: 'Sıkça Sorulan Sorular - MyShop',
    description: 'Teslimat, iadeler, ödeme, kargo hakkında sık sorulan sorular ve cevapları. MyShop SSS rehberi.',
  },
  privacy: {
    title: 'Gizlilik Politikası - MyShop',
    description: 'MyShop gizlilik politikası. Verileriniz nasıl korunuyor, hangi bilgiler toplanıyor, haklarınız neler?',
  },
  login: {
    title: 'Giriş Yap - MyShop',
    description: 'MyShop hesabınıza giriş yapın. E-mail veya telefon numarası ile hızlı giriş. Hesabınız yoksa hemen oluşturun.',
  },
  register: {
    title: 'Kayıt Ol - MyShop | Ücretsiz Hesap Oluştur',
    description: '2 dakikada MyShop hesabı oluşturun. Ücretsiz üyelik, özel teklifler ve ödüller kazanın.',
  },
  profile: {
    title: 'Profilim - MyShop',
    description: 'Profil bilgilerinizi yönetin, adreslerinizi kaydedin, siparişlerinizi takip edin, favorilerinizi görün.',
  },
  orders: {
    title: 'Siparişlerim - MyShop',
    description: 'Tüm siparişleriniz ve kargo durumunu takip edin. Siparişi iptal et, iade yap, yoruma katıl.',
  },
  checkout: {
    title: 'Ödeme - MyShop | Güvenli Kasa',
    description: 'Güvenli checkout. Kredi kartı, e-cüzdan, banka havalesi, kapsayıcı ödeme seçenekleri. SSL şifreli.',
  },
};

/**
 * Example usage:
 * // In ProductDetailPage.jsx
 * useMetaDescription(
 *   `${product.name} - ${product.price}₺ - ⭐${product.rating} - Satın Al`,
 *   `${product.name} | MyShop`
 * );
 */
