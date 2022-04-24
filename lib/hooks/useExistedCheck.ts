import http from '@lib/utils/http-csr'
import { useEffect, useState } from 'react'
import { TExistedCheckDto } from 'typings'

export const useExistedCheck = () => {
  const [isExisted, setIsExisted] = useState(false)

  const [input, setInput] = useState<TExistedCheckDto | null>(null)

  useEffect(() => {
    input &&
      requestExistedCheck(input).then(({ isExisted }) => {
        setIsExisted(isExisted)
      })
  }, [input])

  return {
    isExisted,
    setInput,
  }
}

const requestExistedCheck = async (input: TExistedCheckDto) => {
  const { data, status } = await http.post('/auth/existed-check', input)

  if (status === 200) {
    return data
  }

  return null
}
