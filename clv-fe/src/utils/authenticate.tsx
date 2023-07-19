'use client'
import { useRouter } from 'next/navigation'
import { createContext, useState, ReactNode, useEffect } from 'react'
import GetUserProfile from '../api/user/user'
import { ACCESS_TOKEN } from '../common/constants'
import { DASHBOARD_ROUTE, LOGIN_ROUTE } from '../common/routes'

export type User = {
  email: string
  firstName: string
  lastName: string
}

interface UserContextValue {
  user: User | null
  setUser: (user: User | null) => void
}

export const UserContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {},
})

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const accessToken: string | null = localStorage.getItem(ACCESS_TOKEN)

  async function GetProfile(token: string) {
    const data = await GetUserProfile(token)
    if (data) {
      setUser(data)
    } else {
      alert(`Unauthorized with error ${data}`)
      router.push(DASHBOARD_ROUTE)
    }
  }
  useEffect(() => {
    if (accessToken) {
      GetProfile(accessToken)
    } else {
      alert('Unauthorized')
      router.push(LOGIN_ROUTE)
    }
  }, [accessToken])
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
