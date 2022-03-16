import { useEffect, useRef, useState } from 'react'

export const useWindowMounted = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (!isMounted) setIsMounted(true)
  }, [isMounted])

  return isMounted
}
