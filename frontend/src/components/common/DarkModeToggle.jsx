import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

function DarkModeToggle({ className = '' }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Sayfa yüklendiğinde tema durumunu kontrol et
    const isDarkStored = localStorage.getItem('theme-dark') === 'true'
    setIsDark(isDarkStored)
    if (isDarkStored) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const handleToggle = () => {
    const newMode = !isDark
    setIsDark(newMode)
    
    if (newMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme-dark', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme-dark', 'false')
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-lg transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
          : 'bg-yellow-100 text-orange-500 hover:bg-yellow-200'
      } ${className}`}
      aria-label="Dark mode toggle"
      title={isDark ? '☀️ Işık Modu' : '🌙 Karanlık Modu'}
    >
      {isDark ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}
    </button>
  )
}

export default DarkModeToggle