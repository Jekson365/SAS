import { useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useDeleteTest() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  async function deleteTest(id) {
    setLoading(true)
    setError(null)
    try {
      await axiosInstance.delete(`/tests/${id}`)
      return true
    } catch (err) {
      setError(err.response?.data?.message ?? 'ტესტის წაშლა ვერ მოხდა.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { deleteTest, loading, error }
}
