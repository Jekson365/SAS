import { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useSubjects() {
  const [subjects, setSubjects] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    axiosInstance.get('/subjects')
      .then(res => setSubjects(res.data))
      .catch(() => setSubjects([]))
      .finally(() => setLoading(false))
  }, [])

  return { subjects, loading }
}
