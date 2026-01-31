// Daha fazla ürün verisi
export const allProducts = [
  {
    id: 1,
    name: "Kablosuz Kulaklık Pro Max",
    price: 899.99,
    oldPrice: 1299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    category: "Elektronik",
    brand: "TechBrand",
    color: "Siyah",
    rating: 4.5,
    reviews: 234,
    inStock: true,
    stock: 45
  },
  {
    id: 2,
    name: "Akıllı Saat Premium",
    price: 1499.99,
    oldPrice: 2199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    category: "Elektronik",
    brand: "SmartWatch Co",
    color: "Gümüş",
    rating: 4.8,
    reviews: 567,
    inStock: true,
    stock: 23
  },
  {
    id: 3,
    name: "Spor Ayakkabı Runner",
    price: 599.99,
    oldPrice: 899.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    category: "Ayakkabı",
    brand: "SportMax",
    color: "Beyaz",
    rating: 4.3,
    reviews: 189,
    inStock: true,
    stock: 67
  },
  {
    id: 4,
    name: "Laptop Çantası Premium",
    price: 299.99,
    oldPrice: 499.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    category: "Aksesuar",
    brand: "BagPro",
    color: "Kahverengi",
    rating: 4.6,
    reviews: 423,
    inStock: true,
    stock: 89
  },
  {
    id: 5,
    name: "Bluetooth Hoparlör XL",
    price: 449.99,
    oldPrice: 699.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
    category: "Elektronik",
    brand: "SoundMax",
    color: "Kırmızı",
    rating: 4.7,
    reviews: 312,
    inStock: false,
    stock: 0
  },
  {
    id: 6,
    name: "Güneş Gözlüğü Classic",
    price: 199.99,
    oldPrice: 349.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
    category: "Aksesuar",
    brand: "SunStyle",
    color: "Siyah",
    rating: 4.4,
    reviews: 156,
    inStock: true,
    stock: 34
  },
  {
    id: 7,
    name: "Gaming Mouse RGB",
    price: 249.99,
    oldPrice: 499.99,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500",
    category: "Elektronik",
    brand: "GameTech",
    color: "Siyah",
    rating: 4.9,
    reviews: 678,
    inStock: true,
    stock: 120
  },
  {
    id: 8,
    name: "Mekanik Klavye Pro",
    price: 799.99,
    oldPrice: 1299.99,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500",
    category: "Elektronik",
    brand: "KeyMaster",
    color: "RGB",
    rating: 4.8,
    reviews: 445,
    inStock: true,
    stock: 56
  },
  {
    id: 9,
    name: "Webcam HD 4K",
    price: 349.99,
    oldPrice: 699.99,
    image: "https://images.unsplash.com/photo-1589739900243-c199f5f572ef?w=500",
    category: "Elektronik",
    brand: "CamPro",
    color: "Siyah",
    rating: 4.5,
    reviews: 289,
    inStock: true,
    stock: 78
  },
  {
    id: 10,
    name: "Deri Cüzdan Premium",
    price: 149.99,
    oldPrice: 299.99,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
    category: "Aksesuar",
    brand: "LeatherCraft",
    color: "Kahverengi",
    rating: 4.6,
    reviews: 234,
    inStock: true,
    stock: 45
  },
  {
    id: 11,
    name: "Akıllı Telefon X1",
    price: 8999.99,
    oldPrice: 11999.99,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    category: "Elektronik",
    brand: "PhoneTech",
    color: "Mavi",
    rating: 4.9,
    reviews: 1234,
    inStock: true,
    stock: 12
  },
  {
    id: 12,
    name: "Sırt Çantası Urban",
    price: 399.99,
    oldPrice: 599.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    category: "Aksesuar",
    brand: "BagStyle",
    color: "Gri",
    rating: 4.4,
    reviews: 167,
    inStock: true,
    stock: 89
  }
]

// Kategoriler
export const categories = [
  { id: 1, name: "Elektronik", slug: "elektronik", icon: "💻" },
  { id: 2, name: "Aksesuar", slug: "aksesuar", icon: "👜" },
  { id: 3, name: "Ayakkabı", slug: "ayakkabi", icon: "👟" }
]

// İndirimli ürünler
export const discountedProducts = allProducts.filter(p => p.oldPrice)

// Filtre seçenekleri
export const filterOptions = {
  categories: ["Elektronik", "Aksesuar", "Ayakkabı"],
  brands: ["TechBrand", "SmartWatch Co", "SportMax", "BagPro", "SoundMax", "SunStyle", "GameTech", "KeyMaster", "CamPro", "LeatherCraft", "PhoneTech", "BagStyle"],
  colors: ["Siyah", "Beyaz", "Gümüş", "Kahverengi", "Kırmızı", "Mavi", "Gri", "RGB"],
  priceRanges: [
    { label: "0 - 500 TL", min: 0, max: 500 },
    { label: "500 - 1000 TL", min: 500, max: 1000 },
    { label: "1000 - 2000 TL", min: 1000, max: 2000 },
    { label: "2000 TL ve üzeri", min: 2000, max: Infinity }
  ]
}