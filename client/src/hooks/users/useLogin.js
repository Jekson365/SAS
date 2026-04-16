import { useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function login(email, password) {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axiosInstance.post('/users/login', { email, password })
      localStorage.setItem('token',   data.token)
      localStorage.setItem('user_id', data.user_id)
      localStorage.setItem('email',   data.email)
      return data
    } catch (err) {
      const message = err.response?.data?.message ?? 'შესვლა ვერ მოხდა.'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}
