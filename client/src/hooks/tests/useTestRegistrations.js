import { useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useTestRegistrations() {
  const [students, setStudents] = useState([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  async function fetchStudents(testId) {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axiosInstance.get(`/testregistrations/test/${testId}`)
      setStudents(data)
    } catch {
      setError('სტუდენტების ჩატვირთვა ვერ მოხდა.')
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  return { students, loading, error, fetchStudents }
}
