'use client'
import { GetUserProfileAPI } from '@/api/user/api.user'
import LoginUserAPI from '@api/authen/login'
import { ACCESS_TOKEN } from '@common/constants'
import { DASHBOARD_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from '@common/routes'
import { useRouter, usePathname } from 'next/navigation'
import { ReactNode, createContext, useEffect, useState } from 'react'
import RegisterUserAPI, { RegisterParams } from '@api/authen/register'
import { v4 as uuidv4 } from 'uuid'

export type User = {
  email: string
  firstName: string
  lastName: string
  roles: Role[]
}
export type Role = {
  name: string
}
export type Permission = {
  id: string
  name: string
  description: string
  roles: Role[]
}

export const getToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN)
}

interface UserContextValue {
  user: User | null
  setUser: (user: User | null) => void
  handleAuthenUser: (
    email: string,
    password: string,
    registerParams?: RegisterParams
  ) => void
  handleClearUser: () => void
}

export const UserContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {},
  handleAuthenUser: () => {},
  handleClearUser: () => {},
})

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(getToken())

  async function GetProfile() {
    const data = await GetUserProfileAPI()
    if (data) {
      setUser(data)
    } else {
      handleClearUser()
    }
  }

  async function handleAuthenUser(
    email: string,
    password: string,
    registerParams?: RegisterParams
  ) {
    let accessToken: string = ''
    if (registerParams) {
      accessToken = await RegisterUserAPI(registerParams)
    } else {
      accessToken = await LoginUserAPI(email, password)
    }

    if (accessToken.length > 0) {
      setAccessToken(accessToken)
      localStorage.setItem(ACCESS_TOKEN, accessToken)
      router.push(DASHBOARD_ROUTE)
    } else {
      localStorage.clear()
    }
  }

  function handleClearUser() {
    localStorage.clear()
    setUser(null)
    router.push(LOGIN_ROUTE)
  }

  useEffect(() => {
    if (accessToken) {
      GetProfile()
    } else {
      if (pathname === REGISTER_ROUTE) {
        return
      }
      router.push(LOGIN_ROUTE)
    }
  }, [accessToken])

  return (
    <UserContext.Provider
      value={{ user, setUser, handleAuthenUser, handleClearUser }}
    >
      {children}
    </UserContext.Provider>
  )
}
