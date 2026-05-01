import { useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useDeleteEvent() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  async function deleteEvent(id) {
    setLoading(true)
    setError(null)
    try {
      await axiosInstance.delete(`/events/${id}`)
      return true
    } catch (err) {
      setError(err.response?.data?.message ?? 'წაშლა ვერ მოხდა.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { deleteEvent, loading, error }
}
