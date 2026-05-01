import { useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useUpdateEvent() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  async function updateEvent(id, payload) {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axiosInstance.put(`/events/${id}`, payload)
      return data
    } catch (err) {
      setError(err.response?.data?.message ?? 'განახლება ვერ მოხდა.')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { updateEvent, loading, error }
}
