// Email servisi geçici olarak devre dışı
module.exports = {
  sendMail: () => Promise.resolve({ message: 'Email disabled' })
}
