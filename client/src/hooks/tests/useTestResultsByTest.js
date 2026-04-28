import { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useTestResultsByTest(testId) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!testId) return
    setLoading(true)
    axiosInstance.get(`/testresults/test/${testId}`)
      .then(res => setResults(res.data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [testId])

  return { results, loading }
}
