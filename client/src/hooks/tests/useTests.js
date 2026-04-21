import { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useTests() {
  const [tests,   setTests]   = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTests = useCallback(() => {
    setLoading(true)
    return axiosInstance.get('/tests')
      .then(res => setTests(res.data))
      .catch(() => setTests([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchTests()
  }, [fetchTests])

  return { tests, loading, refetch: fetchTests }
}
