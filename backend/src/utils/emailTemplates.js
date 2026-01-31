exports.orderConfirmationTemplate = (order, user) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .product-item { display: flex; padding: 15px 0; border-bottom: 1px solid #eee; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .total { font-size: 24px; font-weight: bold; color: #667eea; text-align: right; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Siparişiniz Alındı!</h1>
          <p>Sipariş No: ${order.orderNumber}</p>
        </div>
        
        <div class="content">
          <p>Merhaba ${user.name},</p>
          <p>Siparişiniz başarıyla alındı ve hazırlanmaya başlandı.</p>
          
          <div class="order-details">
            <h2>Sipariş Detayları</h2>
            ${order.items.map(item => `
              <div class="product-item">
                <div>
                  <strong>${item.name}</strong><br>
                  <small>${item.size} • ${item.color} • ${item.quantity}x</small>
                </div>
                <div style="margin-left: auto;">
                  <strong>₺${(item.price * item.quantity).toFixed(2)}</strong>
                </div>
              </div>
            `).join('')}
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee;">
              <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                <span>Ara Toplam:</span>
                <span>₺${order.subtotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                <span>Kargo:</span>
                <span>${order.shippingPrice === 0 ? 'ÜCRETSİZ' : '₺' + order.shippingPrice.toFixed(2)}</span>
              </div>
              ${order.discount > 0 ? `
                <div style="display: flex; justify-content: space-between; margin: 10px 0; color: green;">
                  <span>İndirim:</span>
                  <span>-₺${order.discount.toFixed(2)}</span>
                </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 2px solid #eee;">
                <span style="font-size: 20px; font-weight: bold;">Toplam:</span>
                <span class="total">₺${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div class="order-details">
            <h3>Teslimat Adresi</h3>
            <p>
              <strong>${order.shippingAddress.fullName}</strong><br>
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.district} / ${order.shippingAddress.city}<br>
              ${order.shippingAddress.zipCode}<br>
              Tel: ${order.shippingAddress.phone}
            </p>
          </div>

          <center>
            <a href="${process.env.CLIENT_URL}/orders/${order._id}" class="button">
              Siparişimi Takip Et
            </a>
          </center>

          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Kargo takip numaranız oluştuğunda size bilgi vereceğiz.
          </p>
        </div>
        
        <div class="footer">
          <p>Bu bir otomatik e-postadır, lütfen yanıtlamayın.</p>
          <p>&copy; 2025 MyShop. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

exports.orderShippedTemplate = (order, user) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; }
        .tracking { background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚚 Siparişiniz Kargoda!</h1>
        </div>
        
        <div class="content">
          <p>Merhaba ${user.name},</p>
          <p>Siparişiniz kargoya verildi ve yakında adresinize teslim edilecek.</p>
          
          <div class="tracking">
            <h2>Kargo Bilgileri</h2>
            <p><strong>Kargo Firması:</strong> ${order.cargoCompany}</p>
            <p><strong>Takip Numarası:</strong></p>
            <h3 style="color: #10b981; font-family: monospace;">${order.trackingNumber}</h3>
            
            <a href="https://gonderitakip.com/${order.trackingNumber}" class="button" target="_blank">
              Kargoyu Takip Et
            </a>
          </div>

          <p>Tahmini teslimat süresi: 2-4 iş günü</p>
        </div>
      </div>
    </body>
    </html>
  `
}

exports.welcomeTemplate = (user) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border.button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .benefits { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .benefit-item { display: flex; align-items: center; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Hoş Geldiniz!</h1>
          <p>MyShop ailesine katıldığınız için teşekkür ederiz</p>
        </div>
        
        <div class="content">
          <p>Merhaba ${user.name},</p>
          <p>Hesabınız başarıyla oluşturuldu. Artık binlerce ürüne kolayca ulaşabilir ve harika fırsatlardan yararlanabilirsiniz!</p>
          
          <div class="benefits">
            <h2>Size Özel Avantajlar</h2>
            <div class="benefit-item">
              ✅ 500 TL ve üzeri alışverişlerde ücretsiz kargo
            </div>
            <div class="benefit-item">
              ✅ İlk alışverişinizde %10 indirim (Kod: ILKALIŞVERIŞ)
            </div>
            <div class="benefit-item">
              ✅ Özel kampanya ve fırsatlardan haberdar olma
            </div>
            <div class="benefit-item">
              ✅ Hızlı ve kolay iade
            </div>
          </div>

          <center>
            <a href="${process.env.CLIENT_URL}/products" class="button">
              Alışverişe Başla
            </a>
          </center>
        </div>
      </div>
    </body>
    </html>
  `
}