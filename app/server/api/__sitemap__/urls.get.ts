export default defineEventHandler(async () => {
  const API_URL = 'https://api.tera-in.top'
  // const API_URL = 'http://localhost:8000'
  
  try {
    const properties = await $fetch<Array<{ slug: string }>>(`${API_URL}/properties`)
    
    return properties.map(property => ({
      loc: `/properties/${property.slug}`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date().toISOString()
    }))
  } catch (error) {
    console.error('Failed to fetch sitemap URLs:', error)
    return []
  }
})