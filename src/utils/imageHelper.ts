export const getImageUrl = (path: string | undefined | null, defaultImage: string = '/default-avatar.png'): string => {
    if (!path) return defaultImage

    if (path.startsWith('http') || path.startsWith('https') || path.startsWith('data:')) {
        return path
    }

    // Remove duplicate slashes if any when combining
    let baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:7860').replace(/\/$/, '')
    // Strip /api if present because uploads are served at the root level, not under /api
    baseUrl = baseUrl.replace(/\/api$/, '')
    
    const cleanPath = path.startsWith('/') ? path : `/${path}`

    return `${baseUrl}${cleanPath}`
}
