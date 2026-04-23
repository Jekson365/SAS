import axiosInstance from './axiosInstance'

export function apiOrigin() {
  const base = axiosInstance.defaults.baseURL || ''
  return base.replace(/\/api\/?$/, '')
}

export function resolveImageUrl(url) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  return `${apiOrigin()}${url.startsWith('/') ? '' : '/'}${url}`
}

export async function uploadQuestionImage(file) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await axiosInstance.post('/questions/upload-image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data?.url ?? null
}
