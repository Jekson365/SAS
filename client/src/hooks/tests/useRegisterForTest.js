import { useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useRegisterForTest() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  async function registerAndPay(testId) {
    setLoading(true)
    setError(null)
    try {
      const userId = Number(localStorage.getItem('user_id'))
      const { data } = await axiosInstance.post('/testregistrations', {
        user_id: userId,
        test_id: testId,
        is_paid: true,
      })
      return data
    } catch (err) {
      setError(err.response?.data?.message ?? 'რეგისტრაცია ვერ მოხერხდა.')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { registerAndPay, loading, error }
}
