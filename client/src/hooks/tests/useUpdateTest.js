import { useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useUpdateTest() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  async function updateTest(id, fields) {
    setLoading(true)
    setError(null)
    try {
      await axiosInstance.put(`/tests/${id}`, fields)
      return true
    } catch (err) {
      setError(err.response?.data?.message ?? 'ტესტის განახლება ვერ მოხდა.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { updateTest, loading, error }
}
