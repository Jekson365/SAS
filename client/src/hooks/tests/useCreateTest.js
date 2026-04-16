import { useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useCreateTest() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  async function createTest(fields) {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axiosInstance.post('/tests', fields)
      return data
    } catch (err) {
      setError(err.response?.data?.message ?? 'ტესტის შექმნა ვერ მოხდა.')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createTest, loading, error }
}
