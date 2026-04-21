import { useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useStartTest() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  async function startTest(id) {
    setLoading(true)
    setError(null)
    try {
      await axiosInstance.post(`/tests/${id}/start`)
      return true
    } catch (err) {
      setError(err.response?.data?.message ?? 'ტესტის დაწყება ვერ მოხდა.')
      return false
    } finally {
      setLoading(false)
    }
  }

  async function stopTest(id) {
    setLoading(true)
    setError(null)
    try {
      await axiosInstance.post(`/tests/${id}/stop`)
      return true
    } catch (err) {
      setError(err.response?.data?.message ?? 'ტესტის შეწყვეტა ვერ მოხდა.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { startTest, stopTest, loading, error }
}
