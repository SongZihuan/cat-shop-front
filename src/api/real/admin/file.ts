import { config } from '@/utils/request'

export function apiAdminPostUploadImageUrl() {
  const baseUrl = (config.baseURL || '/api') as string
  if (baseUrl.endsWith('/')) {
    return baseUrl + 'v1/admin/file/upload/image'
  }
  return baseUrl + '/v1/admin/file/upload/image'
}

export function apiAdminPostUploadVideoUrl() {
  const baseUrl = (config.baseURL || '/api') as string
  if (baseUrl.endsWith('/')) {
    return baseUrl + 'v1/admin/file/upload/video'
  }
  return baseUrl + '/v1/admin/file/upload/video'
}
