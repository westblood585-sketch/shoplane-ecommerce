const multer = require('multer')
const path = require('path')

// Memory storage (geçici olarak RAM'de tut)
const storage = multer.memoryStorage()

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Sadece resim dosyaları yüklenebilir (JPEG, PNG, WEBP)'), false)
  }
}

// Upload config
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
})

module.exports = upload