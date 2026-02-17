export const getOptimizedImageUrl = (url, width = 800) => {
  if (!url) return ''
  
  // Cloudinary transformations
  if (url.includes('cloudinary.com')) {
    const parts = url.split('/upload/')
    return `${parts[0]}/upload/w_${width},c_scale,f_auto,q_auto/${parts[1]}`
  }
  
  return url
}

export const lazyLoadImage = (element) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove('lazy')
        observer.unobserve(img)
      }
    })
  })
  
  observer.observe(element)
}
