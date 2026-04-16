import { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useTests() {
  const [tests,   setTests]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosInstance.get('/tests')
      .then(res => setTests(res.data))
      .catch(() => setTests([]))
      .finally(() => setLoading(false))
  }, [])

  return { tests, loading }
}
