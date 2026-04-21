import { useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useVerifyEmail() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  async function verify(email, code) {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axiosInstance.post('/users/verify', { email, code })
      localStorage.setItem('token',   data.token)
      localStorage.setItem('user_id', data.user_id)
      localStorage.setItem('email',   data.email)
      return data
    } catch (err) {
      const message = err.response?.data?.message ?? 'ვერიფიკაცია ვერ მოხდა.'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { verify, loading, error }
}
