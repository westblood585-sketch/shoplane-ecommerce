import ProductCard from '../common/ProductCard'

function FeaturedProducts({ products }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Öne Çıkan Ürünler</h2>
        <p className="text-gray-600">En popüler ve çok satan ürünlerimiz</p>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">Henüz ürün bulunmuyor</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}

export default FeaturedProducts