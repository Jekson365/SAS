import { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useCurrentUser() {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = localStorage.getItem('user_id')
    if (!id) { setLoading(false); return }

    axiosInstance.get(`/users/${id}`)
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  return { user, loading }
}
