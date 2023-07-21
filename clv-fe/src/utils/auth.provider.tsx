'use client'
import { GetUserProfile } from '@/api/user/api.user'
import LoginUser from '@api/authen/login'
import { ACCESS_TOKEN } from '@common/constants'
import { DASHBOARD_ROUTE, LOGIN_ROUTE } from '@common/routes'
import { useRouter } from 'next/navigation'
import { ReactNode, createContext, useEffect, useState } from 'react'

export type User = {
  email: string
  firstName: string
  lastName: string
  roles: Role[]
}
export type Role = {
  name: string
}
export const getToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN)
}

interface UserContextValue {
  user: User | null
  setUser: (user: User | null) => void
  handleAuthenUser: (email: string, password: string) => void
  clearUser: () => void
}

export const UserContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {},
  handleAuthenUser: () => {},
  clearUser: () => {},
})

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(getToken())

  async function GetProfile() {
    const data = await GetUserProfile()
    if (data) {
      setUser(data)
    } else {
      alert(`Unauthorized with error ${data}`)
      router.push(LOGIN_ROUTE)
    }
  }

  async function handleAuthenUser(email: string, password: string) {
    const accessToken: string = await LoginUser(email, password)
    if (accessToken.length > 0) {
      setAccessToken(accessToken)
      localStorage.setItem(ACCESS_TOKEN, accessToken)
      router.push(DASHBOARD_ROUTE)
    } else {
      localStorage.clear()
    }
  }

  function clearUser() {
    localStorage.clear()
    setUser(null)
    router.push(LOGIN_ROUTE)
  }

  useEffect(() => {
    if (accessToken) {
      GetProfile()
    } else {
      alert('Unauthorized')
      router.push(LOGIN_ROUTE)
    }
  }, [accessToken])

  return (
    <UserContext.Provider
      value={{ user, setUser, handleAuthenUser, clearUser }}
    >
      {children}
    </UserContext.Provider>
  )
}
