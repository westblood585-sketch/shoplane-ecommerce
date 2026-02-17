const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')

// Transporter oluştur
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
})

// Template derleyici
const compileTemplate = (templateName, data) => {
    const filePath = path.join(__dirname, '../templates/emails', `${templateName}.hbs`)
    if (!fs.existsSync(filePath)) {
        console.error(`Template not found: ${filePath}`)
        // Fallback simple HTML if template missing
        return `<h1>${data.subject || 'Notification'}</h1><p>Template ${templateName} not found.</p>`
    }
    const source = fs.readFileSync(filePath, 'utf-8')
    const template = handlebars.compile(source)
    return template(data)
}

// Pre-order confirmation
const sendPreOrderConfirmation = async (user, preOrder, product) => {
    try {
        const html = compileTemplate('pre-order-confirmation', {
            name: user.name,
            orderNumber: preOrder.orderNumber,
            productName: product.name,
            productImage: product.images[0],
            quantity: preOrder.quantity,
            totalAmount: preOrder.totalAmount,
            depositAmount: preOrder.depositAmount,
            remainingAmount: preOrder.remainingAmount,
            releaseDate: product.preOrderInfo.releaseDate,
            estimatedDelivery: product.preOrderInfo.estimatedShipDate,
            benefits: product.preOrderInfo.preOrderBenefits,
            websiteUrl: process.env.CLIENT_URL
        })

        await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"My E-Commerce" <noreply@example.com>',
            to: user.email,
            subject: `🎁 Ön Siparişiniz Alındı! #${preOrder.orderNumber}`,
            html
        })

        console.log(`Pre-order confirmation sent to ${user.email}`)
    } catch (error) {
        console.error('Pre-order confirmation error:', error)
    }
}

// Deposit confirmation
const sendDepositConfirmation = async (user, preOrder) => {
    try {
        const html = compileTemplate('deposit-confirmation', {
            name: user.name,
            orderNumber: preOrder.orderNumber,
            depositAmount: preOrder.depositAmount,
            remainingAmount: preOrder.remainingAmount,
            websiteUrl: process.env.CLIENT_URL
        })

        await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"My E-Commerce" <noreply@example.com>',
            to: user.email,
            subject: `✅ Depozito Ödemesi Alındı - ${preOrder.orderNumber}`,
            html
        })

        console.log(`Deposit confirmation sent to ${user.email}`)
    } catch (error) {
        console.error('Deposit confirmation error:', error)
    }
}

// Full payment confirmation
const sendFullPaymentConfirmation = async (user, preOrder) => {
    try {
        const html = compileTemplate('full-payment-confirmation', {
            name: user.name,
            orderNumber: preOrder.orderNumber,
            totalAmount: preOrder.totalAmount,
            estimatedDelivery: preOrder.estimatedDelivery,
            websiteUrl: process.env.CLIENT_URL
        })

        await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"My E-Commerce" <noreply@example.com>',
            to: user.email,
            subject: `🎉 Ödeme Tamamlandı! Siparişiniz Hazırlanıyor - ${preOrder.orderNumber}`,
            html
        })

        console.log(`Full payment confirmation sent to ${user.email}`)
    } catch (error) {
        console.error('Full payment confirmation error:', error)
    }
}

// Pre-order shipped
const sendPreOrderShipped = async (user, preOrder) => {
    try {
        const html = compileTemplate('pre-order-shipped', {
            name: user.name,
            orderNumber: preOrder.orderNumber,
            trackingNumber: preOrder.trackingNumber,
            trackingUrl: preOrder.trackingUrl,
            estimatedDelivery: preOrder.estimatedDelivery,
            websiteUrl: process.env.CLIENT_URL
        })

        await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"My E-Commerce" <noreply@example.com>',
            to: user.email,
            subject: `🚚 Ön Siparişiniz Kargoda! ${preOrder.orderNumber}`,
            html
        })

        console.log(`Pre-order shipped notification sent to ${user.email}`)
    } catch (error) {
        console.error('Pre-order shipped error:', error)
    }
}

// Pre-order delivered
const sendPreOrderDelivered = async (user, preOrder) => {
    try {
        const html = compileTemplate('pre-order-delivered', {
            name: user.name,
            orderNumber: preOrder.orderNumber,
            websiteUrl: process.env.CLIENT_URL
        })

        await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"My E-Commerce" <noreply@example.com>',
            to: user.email,
            subject: `🎉 Ön Siparişiniz Teslim Edildi! ${preOrder.orderNumber}`,
            html
        })

        console.log(`Pre-order delivered notification sent to ${user.email}`)
    } catch (error) {
        console.error('Pre-order delivered error:', error)
    }
}

// Pre-order cancellation
const sendPreOrderCancellation = async (user, preOrder, refundAmount) => {
    try {
        const html = compileTemplate('pre-order-cancellation', {
            name: user.name,
            orderNumber: preOrder.orderNumber,
            cancelReason: preOrder.cancelReason,
            refundAmount,
            websiteUrl: process.env.CLIENT_URL
        })

        await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"My E-Commerce" <noreply@example.com>',
            to: user.email,
            subject: `❌ Ön Sipariş İptal Edildi - ${preOrder.orderNumber}`,
            html
        })

        console.log(`Pre-order cancellation sent to ${user.email}`)
    } catch (error) {
        console.error('Pre-order cancellation error:', error)
    }
}

module.exports = {
    sendPreOrderConfirmation,
    sendDepositConfirmation,
    sendFullPaymentConfirmation,
    sendPreOrderShipped,
    sendPreOrderDelivered,
    sendPreOrderCancellation
}
