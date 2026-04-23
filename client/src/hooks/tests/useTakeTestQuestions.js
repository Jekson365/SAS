import { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

export function useTakeTestQuestions(id) {
  const [questions, setQuestions] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [forbidden, setForbidden] = useState(null)

  useEffect(() => {
    if (!id) return
    const userId = Number(localStorage.getItem('user_id'))
    if (!userId) {
      setForbidden('სესია ვერ მოიძებნა.')
      setLoading(false)
      return
    }

    axiosInstance.get(`/tests/${id}/take/${userId}`)
      .then(res => { setQuestions(res.data); setForbidden(null) })
      .catch(err => {
        if (err.response?.status === 403) {
          setForbidden(err.response.data?.message ?? 'ამ ტესტზე წვდომა შეზღუდულია.')
        } else {
          setForbidden('კითხვების ჩატვირთვა ვერ მოხერხდა.')
        }
        setQuestions([])
      })
      .finally(() => setLoading(false))
  }, [id])

  return { questions, loading, forbidden }
}
