import { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useUserTestResults() {
  const [results,  setResults]  = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    if (!userId) { setLoading(false); return }

    axiosInstance.get(`/testresults/user/${userId}`)
      .then(res => setResults(res.data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [])

  return { results, loading }
}
