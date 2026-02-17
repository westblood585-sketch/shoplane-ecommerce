const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')

const backupDir = path.join(__dirname, '../backups')

// Create backups directory if it doesn't exist
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true })
}

const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0]
const backupPath = path.join(backupDir, `backup-${timestamp}`)

const mongoUri = process.env.MONGO_URI

if (!mongoUri) {
  console.error('❌ MONGO_URI not found in environment variables')
  process.exit(1)
}

console.log('🔄 Starting database backup...')

const command = `mongodump --uri="${mongoUri}" --out="${backupPath}"`

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Backup failed:', error)
    return
  }

  console.log('✅ Backup completed successfully!')
  console.log(`📁 Backup location: ${backupPath}`)

  // Delete backups older than 7 days
  const files = fs.readdirSync(backupDir)
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)

  files.forEach(file => {
    const filePath = path.join(backupDir, file)
    const stats = fs.statSync(filePath)

    if (stats.birthtimeMs < sevenDaysAgo) {
      fs.rmSync(filePath, { recursive: true, force: true })
      console.log(`🗑️  Deleted old backup: ${file}`)
    }
  })
})
