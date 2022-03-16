import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { toast } from 'react-hot-toast'

import { Result, Variables } from '@lib/api/graphql'
import { EXISTED_CHECK_QUERY } from '@lib/api/queries'
import { ExistedCheckInput, ExistedCheckOutput } from '@lib/api/schema'

export const useExistedCheck = () => {
  const [isExisted, setExisted] = useState<boolean>(false)
  const [variables, setVariables] = useState<ExistedCheckInput>()

  const [existedCheck] = useLazyQuery<Result<ExistedCheckOutput>, Variables<ExistedCheckInput>>(EXISTED_CHECK_QUERY, {
    onCompleted: (data) => {
      setExisted(data.existedCheck.result)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  useEffect(() => {
    variables && existedCheck({ variables: { input: variables } })
  }, [variables])

  return {
    isExisted,
    setVariables,
  }
}
