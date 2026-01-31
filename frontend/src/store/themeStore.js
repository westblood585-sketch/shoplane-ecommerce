import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set) => {
      return {
        isDarkMode: localStorage.getItem('theme-storage') 
          ? JSON.parse(localStorage.getItem('theme-storage')).state?.isDarkMode || false 
          : false,
        
        toggleDarkMode: () => set((state) => {
          const newMode = !state.isDarkMode
          
          if (newMode) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          
          return { isDarkMode: newMode }
        }),
        
        setDarkMode: (value) => set(() => {
          if (value) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { isDarkMode: value }
        })
      }
    },
    {
      name: 'theme-storage'
    }
  )
)

export default useThemeStore