import { ref, onMounted, onUnmounted } from 'vue'

export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280
} as const

export const useScreenSize = () => {
  const width = ref(0)
  const height = ref(0)

  // Instead of computed, use refs directly
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)
  const isLargeDesktop = ref(false)
  const deviceType = ref<'mobile' | 'tablet' | 'desktop' | 'large-desktop'>('desktop')
  const drawerDirection = ref<'bottom' | 'right'>('right')

  const updateScreenSize = () => {
    if (typeof window === 'undefined') return

    width.value = window.innerWidth
    height.value = window.innerHeight

    // Update booleans directly
    isMobile.value = width.value < BREAKPOINTS.MOBILE
    isTablet.value = width.value >= BREAKPOINTS.MOBILE && width.value < BREAKPOINTS.TABLET
    isDesktop.value = width.value >= BREAKPOINTS.TABLET
    isLargeDesktop.value = width.value >= BREAKPOINTS.DESKTOP

    // Device type
    if (isMobile.value) deviceType.value = 'mobile'
    else if (isTablet.value) deviceType.value = 'tablet'
    else if (isLargeDesktop.value) deviceType.value = 'large-desktop'
    else deviceType.value = 'desktop'

    // Drawer direction
    drawerDirection.value = isMobile.value ? 'bottom' : 'right'
  }

  const setupListener = () => {
    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
  }

  const cleanupListener = () => {
    window.removeEventListener('resize', updateScreenSize)
  }

  onMounted(() => setupListener())
  onUnmounted(() => cleanupListener())

  // Utilities
  const isBelow = (breakpoint: number) => width.value < breakpoint
  const isAbove = (breakpoint: number) => width.value >= breakpoint

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    deviceType,
    drawerDirection,
    isBelow,
    isAbove,
    breakpoints: BREAKPOINTS,
    update: updateScreenSize
  }
}
