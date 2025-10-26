import { API_BASE_URL } from '@/backend/api/api'

const normalizeHost = (host?: string) => {
  if (!host) {
    return ''
  }

  return host.endsWith('/') ? host.slice(0, -1) : host
}

const DEFAULT_COVER_IMAGE_PATH = '/images/default-cover.svg'

export const getDefaultCoverImageUrl = () => {
  const host = normalizeHost(API_BASE_URL)
  if (!host) {
    return DEFAULT_COVER_IMAGE_PATH
  }

  return `${host}${DEFAULT_COVER_IMAGE_PATH}`
}

export const getImageUrl = (path?: string | null) => {
  const normalizedPath = path?.trim()
  const host = normalizeHost(API_BASE_URL)

  if (normalizedPath && normalizedPath !== '') {
    const prefix = normalizedPath.startsWith('/') ? '' : '/'
    if (!host) {
      return `${prefix}${normalizedPath}`
    }

    return `${host}${prefix}${normalizedPath}`
  }

  return getDefaultCoverImageUrl()
}
