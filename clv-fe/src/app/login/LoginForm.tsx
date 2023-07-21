'use client'
import { ACCESS_TOKEN } from '@common/constants'
import { DASHBOARD_ROUTE } from '@common/routes'
import { Button } from 'antd'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../utils/auth.provider'

export const LoginForm = () => {
  const router = useRouter()
  const { handleAuthenUser } = useContext(UserContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const handleEmailChange = (e: any) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value)
  }

  async function onLogin(e: any) {
    e.preventDefault()
    handleAuthenUser(email, password)
  }

  useEffect(() => {
    const accessToken: string | null = localStorage.getItem(ACCESS_TOKEN)
    if (accessToken) {
      router.push(DASHBOARD_ROUTE)
    }
  }, [])
  return (
    <div className='flex justify-center items-center min-h-screen bg-secondColor'>
      <form className='bg-white p-8 rounded shadow-md w-300'>
        <h2 className='text-2xl font-semibold text-blue-900 mb-6 text-center'>
          Login to CLV
        </h2>
        <div className='mb-4'>
          <label
            htmlFor='email'
            className='text-sm block mb-2 required:border-red-500'
          >
            Email
          </label>
          <input
            type='email'
            id='email'
            className='w-full border rounded px-3 py-2'
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='password'
            className='text-sm block mb-2 required:border-red-500'
          >
            Password
          </label>
          <input
            type='password'
            id='password'
            className='w-full border rounded px-3 py-2'
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className='flex justify-center'>
          <Button
            onClick={onLogin}
            type='primary'
            className='bg-blue-900 text-white font-semibold rounded'
          >
            Login
          </Button>
        </div>
      </form>
    </div>
  )
}
