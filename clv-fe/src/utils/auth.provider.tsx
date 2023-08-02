'use client'
import { GetUserProfileAPI } from '@/api/user/api.user'
import { LoginUserAPI } from '@api/authen/login'
import RegisterUserAPI, { RegisterParams } from '@api/authen/register'
import { ACCESS_TOKEN } from '@common/constants'
import {
  DASHBOARD_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  RESET_PASSWORD_ROUTE,
} from '@common/routes'
import { ActionType } from '@components/select/PermissionSelect'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, createContext, useEffect, useState } from 'react'
import { LogoutUserAPI } from '@api/authen/logout'

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
  action: ActionType
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

  async function handleClearUser() {
    if (await LogoutUserAPI()) {
      localStorage.clear()
      setUser(null)
      router.push(LOGIN_ROUTE)
    }
  }

  useEffect(() => {
    if (accessToken) {
      GetProfile()
    } else {
      if (pathname === REGISTER_ROUTE || pathname === RESET_PASSWORD_ROUTE) {
        return
      }
      router.push(LOGIN_ROUTE)
    }
  }, [accessToken])

  return (
    // <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    //   <GoogleLogin
    //     onSuccess={async (credentialResponse) => {
    //       console.log(credentialResponse)
    //     }}
    //     onError={() => {
    //       console.log('Login Failed')
    //     }}
    //   />
    <UserContext.Provider
      value={{ user, setUser, handleAuthenUser, handleClearUser }}
    >
      {children}
    </UserContext.Provider>
    // </GoogleOAuthProvider>
  )
}
