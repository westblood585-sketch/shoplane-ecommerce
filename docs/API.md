# MyShop API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Products

#### Get All Products
```http
GET /products?page=1&limit=20&category=electronics&sort=-createdAt
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `category` - Filter by category
- `sort` - Sort field (prefix with - for descending)
- `search` - Search query
- `minPrice` - Minimum price
- `maxPrice` - Maximum price

**Response:**
```json
{
  "success": true,
  "products": [...],
  "currentPage": 1,
  "totalPages": 10,
  "total": 200
}
```

#### Get Single Product
```http
GET /products/:id
```

#### Create Product (Admin)
```http
POST /products
Authorization: Bearer 
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "category": "electronics",
  "stock": 100,
  "images": ["image-url-1", "image-url-2"]
}
```

### Orders

#### Create Order
```http
POST /orders
Authorization: Bearer 
Content-Type: application/json

{
  "items": [
    {
      "product": "product-id",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "stripe"
}
```

#### Get My Orders
```http
GET /orders/my-orders
Authorization: Bearer 
```

### Cart

#### Get Cart
```http
GET /cart
Authorization: Bearer 
```

#### Add to Cart
```http
POST /cart
Authorization: Bearer 
Content-Type: application/json

{
  "product": "product-id",
  "quantity": 1
}
```

### Loyalty Program

#### Get My Program
```http
GET /loyalty/my-program
Authorization: Bearer 
```

#### Redeem Reward
```http
POST /loyalty/redeem/:rewardId
Authorization: Bearer 
```

### Bundles

#### Get All Bundles
```http
GET /bundles
```

#### Get Bundle
```http
GET /bundles/:id
```

### Analytics (Admin)

#### Get Dashboard
```http
GET /analytics/dashboard?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer 
```

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Server Error

## Rate Limiting

- General API: 100 requests per 15 minutes
- Authentication: 5 attempts per 15 minutes
- Payments: 10 requests per hour
