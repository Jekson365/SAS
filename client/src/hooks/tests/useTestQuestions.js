import { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useTestQuestions(id) {
  const [questions, setQuestions] = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    if (!id) return
    axiosInstance.get(`/tests/${id}/questions`)
      .then(res => setQuestions(res.data))
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false))
  }, [id])

  return { questions, loading }
}
