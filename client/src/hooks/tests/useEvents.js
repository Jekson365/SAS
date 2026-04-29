import { useState, useEffect } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useEvents() {
  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosInstance.get('/events')
      .then(r => setEvents(r.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  return { events, loading }
}
