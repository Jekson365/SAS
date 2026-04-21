import { useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useRegister() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function register(fields) {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axiosInstance.post('/users/register', fields)
      return data
    } catch (err) {
      const message = err.response?.data?.message ?? 'რეგისტრაცია ვერ მოხდა.'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { register, loading, error }
}
