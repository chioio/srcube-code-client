import React, { useState } from 'react'
import { createContext, useContext } from 'react'
import httpCsr from '@lib/utils/http-csr'
import { useEffect } from 'react'
import { TWhoAmI } from 'typings'

interface IAuthContext {
  // signed: boolean
  // setSigned: (signed: boolean) => void
  whoAmI: TWhoAmI | null
  setWhoAmI: (whoAmI: TWhoAmI | null) => void
}

interface IAuthProvider {
  children: React.ReactNode
}

const AuthContext = createContext<IAuthContext>(null!)

const useAuth = () => useContext(AuthContext)

const initAuthContext: IAuthContext = {
  whoAmI: null,
  setWhoAmI: () => {},
}

const AuthProvider: React.FC<IAuthProvider> = ({ children }) => {
  const [whoAmI, setWhoAmI] = useState<TWhoAmI | null>(null)

  useEffect(() => {
    const fetchWhoAmI = async () => {
      const res = await httpCsr.get<TWhoAmI>('/auth/whoami')

      if (res) {
        setWhoAmI(res.data)
      }
    }

    typeof window !== 'undefined' &&
      localStorage.getItem('access-token') &&
      fetchWhoAmI()
  }, [])

  return (
    <AuthContext.Provider value={{ whoAmI, setWhoAmI }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider as default, useAuth, initAuthContext }
