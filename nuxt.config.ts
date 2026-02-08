const SITE_NAME = 'HouseHunter'
const SITE_URL = 'https://househunter.tera-in.top'
const API_URL = 'https://api.tera-in.top'
// const API_URL = 'http://localhost:8000'
const DEV_HOST = 'househunter.tera-in.top'

const DEFAULT_DESCRIPTION = 'Find, rent, and swap houses easily with HouseHunter - Your trusted platform for seamless property transactions.'
const THEME_COLOR = '#FF5733'
const BACKGROUND_COLOR = '#FFFFFF'
const FAVICON = '/f_logo.png'

// SEO Keywords 
const KEYWORDS = [
  'house hunting',
  'property rental',
  'real estate',
  'home swap',
  'apartment finder',
  'rental platform',
  'house exchange',
  'property listing',
  'housing marketplace',
  'accommodation search'
].join(', ')

export default defineNuxtConfig({
  ssr: true,
  runtimeConfig: {
    public: {
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      siteUrl: SITE_URL,
      siteName: SITE_NAME
    }
  },

  // SEO & Indexing Modules (Nuxt 4 Compatible)
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/robots', 
    '@nuxtjs/sitemap', 
    'nuxt-schema-org', 
  ],
  piniaPluginPersistedstate: {
    storage: 'cookies',
    cookieOptions: {
      sameSite: 'lax',
    },
    debug: true,
  },

  // Robots.txt Configuration
  robots: {
    enabled: true,
    allow: ['/'],
    disallow: ['/api/', '/admin/', '/private/'], // Adjust as needed
    sitemap: `${SITE_URL}/sitemap.xml`
  },

  // Sitemap Configuration
  sitemap: {
    enabled: true,
    siteUrl: SITE_URL,
    autoLastmod: true,
    defaults: {
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString()
    },
    sources: [
      '/api/__sitemap__/urls' // You'll need to create this endpoint
    ]
  },

  // Structured Data (Schema.org)
  schemaOrg: {
    enabled: true,
    canonicalHost: SITE_URL,
    default: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: `${SITE_URL}${FAVICON}`
      }
    }
  },

  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/sitemap.xml',
        '/robots.txt'
      ],
      failOnError: false // Don't fail build on prerender errors
    }
  },

  devtools: {
    enabled: false
  },

  vite: {
    cacheDir: '.vite-cache',
    clearScreen: true,
    server: {
      allowedHosts: [
        DEV_HOST,
        'localhost',
        '127.0.0.1',
        'househunter.tera-in.top',
        'www.househunter.tera-in.top',
        'api.tera-in.top'
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/api/**': {
      cors: true,
      headers: {
        'Cache-Control': 'public, max-age=3600'
      }
    },
    '/_ipx/**': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable' // Image caching
      }
    }
  },

  components: {
    global: true,
    dirs: [
      { path: '~/components/main', pathPrefix: false },
      { path: '~/components/general', pathPrefix: false },
      { path: '~/components/customers', pathPrefix: false },
      { path: '~/components/admin', pathPrefix: false },
      { path: '~/components/inbox', pathPrefix: false },
      { path: '~/components/home', pathPrefix: false },
      { path: '~/components/settings', pathPrefix: false },
      { path: '~/components/listing', pathPrefix: false },
      { path: '~/components/map', pathPrefix: false },
      { path: '~/components/dashboard', pathPrefix: false }

    ]
  },

  compatibilityDate: '2024-07-11',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  // 🎯 Enhanced App Head Configuration
  app: {
    head: {
      titleTemplate: `%s | ${SITE_NAME}`,
      title: SITE_NAME,
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        // Basic SEO
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: DEFAULT_DESCRIPTION },
        { name: 'keywords', content: KEYWORDS },

        // Theme & Mobile
        { name: 'theme-color', content: THEME_COLOR },
        { name: 'color-scheme', content: 'light dark' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: SITE_NAME },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },

        // Open Graph (Facebook, LinkedIn, etc.)
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: SITE_URL },
        { property: 'og:title', content: SITE_NAME },
        { property: 'og:description', content: DEFAULT_DESCRIPTION },
        { property: 'og:image', content: `${SITE_URL}/og-image.jpg` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:site_name', content: SITE_NAME },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@househunter' },
        { name: 'twitter:creator', content: '@househunter' },
        { name: 'twitter:title', content: SITE_NAME },
        { name: 'twitter:description', content: DEFAULT_DESCRIPTION },
        { name: 'twitter:image', content: `${SITE_URL}/twitter-card.jpg` },

        // Additional Meta
        { name: 'robots', content: 'index, follow, max-image-preview:large' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'author', content: SITE_NAME },
        { name: 'publisher', content: SITE_NAME }
      ],
      link: [
        { rel: 'canonical', href: SITE_URL },
        { rel: 'icon', type: 'image/x-icon', href: FAVICON },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.json' },

        // Preconnect for performance
        { rel: 'preconnect', href: API_URL },
        { rel: 'preconnect', href: 'https://accounts.google.com' }
      ],
      script: [
        {
          src: 'https://accounts.google.com/gsi/client',
          async: true,
          defer: true
        }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  workbox: {
    navigateFallback: '/'
  },

  // 🚀 Performance Optimizations
  experimental: {
    payloadExtraction: true,
    inlineSSRStyles: false,
    renderJsonPayloads: true
  }
})