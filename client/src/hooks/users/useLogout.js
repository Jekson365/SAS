import { useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useLogout() {
  const [loading, setLoading] = useState(false)

  async function logout() {
    setLoading(true)
    try {
      await axiosInstance.post('/users/logout')
    } catch {
      // proceed with local cleanup even if the request fails
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user_id')
      localStorage.removeItem('email')
      setLoading(false)
    }
  }

  return { logout, loading }
}
