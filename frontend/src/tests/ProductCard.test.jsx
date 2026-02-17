import { describe, it, expect } from 'vitest'

describe('Product Utility Functions', () => {
  describe('Price Formatting', () => {
    it('should format price correctly', () => {
      const formatPrice = (price) => {
        return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '₺'
      }

      expect(formatPrice(99.99)).toBe('99.99₺')
      expect(formatPrice(1000)).toBe('1,000.00₺')
      expect(formatPrice(10000.50)).toBe('10,000.50₺')
    })
  })

  describe('Product Filtering', () => {
    const mockProducts = [
      { _id: '1', name: 'Product 1', price: 100, category: 'electronics' },
      { _id: '2', name: 'Product 2', price: 200, category: 'books' },
      { _id: '3', name: 'Product 3', price: 150, category: 'electronics' }
    ]

    it('should filter products by category', () => {
      const filterByCategory = (products, category) => {
        return products.filter(p => p.category === category)
      }

      const result = filterByCategory(mockProducts, 'electronics')
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('Product 1')
    })

    it('should filter products by price range', () => {
      const filterByPrice = (products, min, max) => {
        return products.filter(p => p.price >= min && p.price <= max)
      }

      const result = filterByPrice(mockProducts, 100, 150)
      expect(result).toHaveLength(2)
    })
  })

  describe('Rating Calculation', () => {
    it('should calculate average rating correctly', () => {
      const calculateAverage = (ratings) => {
        if (ratings.length === 0) return 0
        return ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      }

      expect(calculateAverage([5, 4, 3])).toBe(4)
      expect(calculateAverage([5, 5, 5])).toBe(5)
      expect(calculateAverage([])).toBe(0)
    })
  })
})
