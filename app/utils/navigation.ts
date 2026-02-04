export const useBreadcrumbs = () => {

const route = useRoute()
  
  return computed(() => {
    const crumbs: BreadcrumbItem[] = []
    const segments = route.path.split('/').filter(Boolean)
    
    // Always start with Home
    crumbs.push({
      label: 'Home',
      to: '/',
      disabled: false
    })
    
    // Build path hierarchy
    let currentPath = ''
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1
      
      crumbs.push({
        label: formatSegmentLabel(segment, index, segments),
        to: isLast ? undefined : currentPath,
        disabled: isLast
      })
    })
    
    return crumbs
  })
}

function formatSegmentLabel(segment: string, index: number, allSegments: string[]): string {
  // Level 1: Main sections
  if (index === 0) {
    const sectionLabels: Record<string, string> = {
      'rentals': 'Rentals',
      'apartments': 'Apartments',
      'swaps': 'Swaps',
      'dashboard': 'Dashboard',
      'properties': 'Properties',
      'admin': 'Admin',
      'profile': 'Profile',
      'settings': 'Settings'
    }
    
    return sectionLabels[segment] || formatText(segment)
  }
  
  // Level 2: Sub-sections or IDs
  if (index === 1) {
    // If it's a numeric ID
    if (/^\d+$/.test(segment)) {
      return `Item ${segment}`
    }
    
    const slugLabels: Record<string, string> = {
      'villa': 'Villa',
      'apartment': 'Apartment',
      'house': 'House',
      'penthouse': 'Penthouse',
      'studio': 'Studio',
      'cottage': 'Cottage',
      'edit': 'Edit',
      'create': 'Create',
      'list': 'List'
    }
    
    return slugLabels[segment] || formatText(segment)
  }
  
  // Level 3+: Deep nesting
  if (index >= 2) {
    // For IDs
    if (/^\d+$/.test(segment)) {
      return `#${segment}`
    }
    
    // For common actions
    const actionLabels: Record<string, string> = {
      'edit': 'Edit',
      'view': 'View',
      'settings': 'Settings',
      'photos': 'Photos',
      'amenities': 'Amenities',
      'reviews': 'Reviews',
      'analytics': 'Analytics'
    }
    
    return actionLabels[segment] || formatText(segment)
  }
  
  return formatText(segment)
}

function formatText(text: string): string {
  // Convert kebab-case, snake_case, or camelCase to Title Case
  return text
    .replace(/[-_]/g, ' ') // Replace - and _ with spaces
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camelCase
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}