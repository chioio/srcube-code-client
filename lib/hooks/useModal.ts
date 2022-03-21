import { Dispatch, SetStateAction, useState } from 'react'

type UseModalType = [isActive: boolean, setIsActive: Dispatch<SetStateAction<boolean>>, toggle: () => void]

export const useModal = (initMode = false): UseModalType => {
  const [isActive, setIsActive] = useState(initMode)

  const toggle = () => setIsActive(!isActive)

  return [isActive, setIsActive, toggle]
}
