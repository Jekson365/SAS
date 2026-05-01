import { useState } from 'react'
import axiosInstance from '../api/axiosInstance'

export function useSubmitTestResult() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  async function submitResult({ testId, score, passed, durationSeconds, answers = [] }) {
    setLoading(true)
    setError(null)
    try {
      const userId = Number(localStorage.getItem('user_id'))
      const { data } = await axiosInstance.post('/testresults', {
        user_id:          userId,
        test_id:          testId,
        score,
        passed,
        duration_seconds: Number.isFinite(durationSeconds) ? Math.max(0, Math.floor(durationSeconds)) : 0,
        answers,
      })
      return data
    } catch (err) {
      setError(err.response?.data?.message ?? 'შედეგის შენახვა ვერ მოხდა.')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { submitResult, loading, error }
}
