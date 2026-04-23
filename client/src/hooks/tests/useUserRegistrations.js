import { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useUserRegistrations() {
  const [registrations, setRegistrations] = useState([])
  const [loading,       setLoading]       = useState(true)

  const fetchRegistrations = useCallback(async () => {
    const userId = localStorage.getItem('user_id')
    if (!userId) { setRegistrations([]); setLoading(false); return }
    try {
      const { data } = await axiosInstance.get(`/testregistrations/user/${userId}`)
      setRegistrations(data)
    } catch {
      setRegistrations([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchRegistrations() }, [fetchRegistrations])

  return { registrations, loading, refetch: fetchRegistrations }
}
