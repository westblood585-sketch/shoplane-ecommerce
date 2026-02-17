# 🚀 MYSHOP PLATFORM - QUICK TESTING GUIDE

## Server Status
```bash
# ✅ Backend: http://localhost:5001
# ✅ Frontend: http://localhost:5176
# ✅ Database: MongoDB (eticaret)
```

---

## 📊 FEATURE TEST FLOWS

### 1️⃣ USER REGISTRATION & LOYALTY AUTO-CREATE
```
1. Navigate to http://localhost:5176/register
2. Create test account (test@example.com / password123)
3. Submit form
4. Expected: Account created + Auto-login
5. Check database: db.loyaltyprograms.findOne({ user: USER_ID })
   → Should have: 100 welcome points, bronze tier
```

### 2️⃣ FIRST ORDER (TRIGGERS LOYALTY)
```
1. Browse products at http://localhost:5176/products
2. Add product to cart
3. Go to checkout: http://localhost:5176/checkout
4. Complete order with test payment
5. Check points:
   - Points earned = Order Amount ÷ 10
   - Example: 1000₺ order = 100 points
6. Verify: Loyalty dashboard shows updated points
```

### 3️⃣ LOYALTY DASHBOARD
```
1. Logged in user clicks "Loyalty Program" in navbar
2. Should see:
   - Current points
   - Tier level (Bronze, Silver, Gold, Platinum, Diamond)
   - Bonus multiplier (1x, 1.5x, 2x, 2.5x, 3x)
   - Referral code (unique to user)
   - Recent transactions
   - Achievements
```

### 4️⃣ REFERRAL SYSTEM
```
User A (Referrer):
1. Copy referral code from loyalty dashboard
2. Share with User B

User B (New User):
1. Register with referral code: test-ref-code-123
2. Expected result:
   - User B: Receives 200 welcome bonus + 200 referral bonus = 400pts
   - User A: Receives 500 referral bonus (shown in transactions)
```

### 5️⃣ BUNDLE PURCHASE
```
1. Navigate to: http://localhost:5176/bundles
2. Browse 5 seeded bundles
3. Click on bundle detail
4. View bundled products and pricing
5. Add to cart and proceed to checkout
6. Complete order
7. Expected:
   - Bundle discount applied (20% for example)
   - Points earned on bundle
   - Bundle shown in order history
```

### 6️⃣ LEADERBOARD
```
1. Navigate to: http://localhost:5176/loyalty/leaderboard
2. Should show:
   - Top users by points (all-time)
   - Filter options: All-time, Monthly, Weekly
   - User rank, name, points, tier
```

### 7️⃣ REWARDS PAGE
```
1. Navigate to: http://localhost:5176/loyalty/rewards
2. Should show:
   - Available rewards
   - Points cost for each
   - Reward type (discount %, free shipping, etc.)
   - Redeem button
3. Click redeem if have enough points
4. Receive redemption code
```

### 8️⃣ ADMIN ANALYTICS
```
1. Login as admin user
2. Click "Analytics Dashboard" in navbar (admin menu)
3. Should load comprehensive dashboard with:
   - Revenue metrics
   - Order metrics
   - Customer metrics
   - Category performance
   - Real-time stats
4. Test date range filtering
```

### 9️⃣ DARK MODE
```
1. Click dark mode toggle in navbar
2. Verify all pages render correctly
3. Check:
   - Loyalty dashboard dark theme
   - Bundle cards dark theme
   - Analytics charts dark theme
   - Text contrast (WCAG compliant)
```

### 🔟 RESPONSIVE TEST
```
1. Open DevTools (F12)
2. Toggle device toolbar
3. Test on:
   - iPhone 12 (390px)
   - iPad (768px)
   - Desktop (1920px)
4. Verify:
   - Loyalty dashboard responsive
   - Bundle grid responsive
   - Navigation accessible
   - Forms usable on mobile
```

---

## 🔍 API ENDPOINT TESTS

### Loyalty Endpoints
```bash
# Public endpoints
curl http://localhost:5001/api/loyalty/rewards
curl http://localhost:5001/api/loyalty/leaderboard

# Protected endpoints (need JWT token)
curl -H "Authorization: Bearer TOKEN" http://localhost:5001/api/loyalty/my-program
curl -H "Authorization: Bearer TOKEN" http://localhost:5001/api/loyalty/transactions
curl -H "Authorization: Bearer TOKEN" -X POST http://localhost:5001/api/loyalty/referral

# Admin endpoints
curl -H "Authorization: Bearer ADMIN_TOKEN" http://localhost:5001/api/loyalty/admin/stats
```

### Bundle Endpoints
```bash
# Public
curl http://localhost:5001/api/bundles
curl http://localhost:5001/api/bundles/:id

# Admin
curl -H "Authorization: Bearer ADMIN_TOKEN" -X POST http://localhost:5001/api/bundles
curl -H "Authorization: Bearer ADMIN_TOKEN" -X PUT http://localhost:5001/api/bundles/:id
curl -H "Authorization: Bearer ADMIN_TOKEN" -X DELETE http://localhost:5001/api/bundles/:id
```

### Analytics Endpoints
```bash
# All require admin token
curl -H "Authorization: Bearer ADMIN_TOKEN" http://localhost:5001/api/analytics/dashboard
curl -H "Authorization: Bearer ADMIN_TOKEN" http://localhost:5001/api/analytics/realtime
curl -H "Authorization: Bearer ADMIN_TOKEN" http://localhost:5001/api/funnels
curl -H "Authorization: Bearer ADMIN_TOKEN" http://localhost:5001/api/journeys
```

---

## 📝 DATABASE VALIDATION

### Loyalty Program Document Example
```javascript
db.loyaltyprograms.findOne()
{
  user: ObjectId('...'),
  points: {
    current: 150,
    lifetime: 250,
    pending: 0,
    expiredHistory: []
  },
  tier: {
    name: 'silver',
    level: 2,
    benefits: [
      { name: 'pointsMultiplier', value: 1.5 },
      { name: 'freeShipping', value: true }
    ]
  },
  referrals: {
    code: 'USER123ABC',
    referred_users: [],
    earned_points: 0
  },
  transactions: [
    { type: 'earn', amount: 100, reason: 'first_order', date: ... },
    { type: 'earn', amount: 50, reason: 'referral_bonus', date: ... }
  ],
  achievements: [
    { name: 'first_purchase', unlocked_at: ... }
  ],
  stats: {
    totalPurchases: 1,
    totalReferrals: 0,
    currentStreak: 0,
    longestStreak: 0
  }
}
```

### Bundle Document Example
```javascript
db.bundles.findOne()
{
  name: 'Mega Deal Bundle',
  description: 'Best value bundle with all essentials',
  type: 'fixed', // or 'mix_and_match'
  products: [
    {
      product: ObjectId('...'),
      quantity: 1,
      price: 2999
    }
  ],
  bundlePrice: 7499,
  discount: 0.20, // 20%
  active: true,
  stock: 50,
  stats: {
    totalSold: 3,
    totalRevenue: 22497
  }
}
```

---

## 🐛 TROUBLESHOOTING

### Backend won't start
```bash
# Fix port conflict
lsof -i :5001
kill -9 PID

# Restart
cd backend && npm run dev
```

### Frontend won't start
```bash
# Kill processes on ports 5174-5177
lsof -i :5174
lsof -i :5175
lsof -i :5176
kill -9 PIDs

# Restart
cd frontend && npm run dev
```

### Database connection issues
```bash
# Check MongoDB is running
mongosh

# Check connection string in .env
cat .env | grep MONGODB_URI

# Test connection
npm run test:db
```

### Points not calculating
```bash
# Check order exists
db.orders.findOne()

# Check loyalty program created
db.loyaltyprograms.findOne({ user: USER_ID })

# Check service is running
tail -f backend/logs/app.log
```

---

## ✨ FEATURE CHECKLIST FOR QA

### Loyalty Program
- [ ] Auto-create on first login
- [ ] 100pt welcome bonus
- [ ] Points earn on order (amount ÷ 10)
- [ ] Tier upgrade at thresholds (1000, 5000, 15000, 50000)
- [ ] Multiplier bonus (1x-3x based on tier)
- [ ] Referral code generation
- [ ] Referral points (500 referrer, 200 referee)
- [ ] Reward redemption
- [ ] Achievement unlocking
- [ ] Streak tracking
- [ ] Points expiry (365 days)
- [ ] Transaction history
- [ ] Leaderboard ranking

### Bundles
- [ ] Bundle creation (admin)
- [ ] Fixed price bundles
- [ ] Mix & match bundles
- [ ] Discount automatically applied
- [ ] Add to cart functionality
- [ ] Checkout with bundles
- [ ] Bundle in order history
- [ ] Stock management
- [ ] Popular bundles display
- [ ] Bundle recommendations

### Analytics
- [ ] Revenue metrics
- [ ] Order count
- [ ] New vs returning customers
- [ ] Top products
- [ ] Category performance
- [ ] Conversion funnel
- [ ] Real-time stats (last 24h)
- [ ] Date range filtering
- [ ] Charts rendering
- [ ] Dark mode charts

### Integration
- [ ] Order → Loyalty points
- [ ] Bundle → Loyalty points
- [ ] Referral → Both users get points
- [ ] Tier → Benefits applied
- [ ] Journey → Analytics updated
- [ ] Funnel → Conversion tracked

---

## 📞 SUPPORT

If you encounter any issues:

1. Check the **FINAL_TEST_REPORT.md** for detailed status
2. Review terminal output for error messages
3. Check MongoDB for data consistency
4. Verify all services are running
5. Clear browser cache (Ctrl+Shift+Del)
6. Check browser console (F12) for JavaScript errors

**All systems are ready! Happy testing! 🎉**
