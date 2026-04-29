import { useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useCreateEvent() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const createEvent = async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axiosInstance.post('/events', payload)
      return data
    } catch (e) {
      setError(e.response?.data?.message ?? 'შეცდომა')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createEvent, loading, error }
}
