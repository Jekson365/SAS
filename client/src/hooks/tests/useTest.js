import { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useTest(id) {
  const [test,    setTest]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    axiosInstance.get(`/tests/${id}`)
      .then(res => setTest(res.data))
      .catch(() => setTest(null))
      .finally(() => setLoading(false))
  }, [id])

  return { test, loading }
}
