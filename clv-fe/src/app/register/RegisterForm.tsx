'use client'
import { RegisterParams } from '@api/authen/register'
import { ACCESS_TOKEN } from '@common/constants'
import { DASHBOARD_ROUTE, LOGIN_ROUTE } from '@common/routes'
import { UserContext } from '@utils/auth.provider'
import { Button, Input } from 'antd'
import Link from 'antd/es/typography/Link'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'

import { Metadata } from 'next'
import { FcGoogle } from 'react-icons/fc'
import { LoginGoogleAPI } from '@api/authen/login'

export const metadata: Metadata = {
  title: 'CLV register',
  description: 'CLV Training bootcamp',
}
export const RegisterForm = () => {
  const router = useRouter()
  const { handleAuthenUser } = useContext(UserContext)
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const handleFirstNameChange = (e: any) => {
    setFirstName(e.target.value)
  }

  const handleLastNameChange = (e: any) => {
    setLastName(e.target.value)
  }

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value)
  }

  async function onRegister(e: any) {
    e.preventDefault()
    const newUser: RegisterParams = {
      firstName,
      lastName,
      email,
      password,
    }
    handleAuthenUser('', '', newUser)
  }

  useEffect(() => {
    const accessToken: string | null = localStorage.getItem(ACCESS_TOKEN)
    if (accessToken) {
      router.push(DASHBOARD_ROUTE)
    }
  }, [])

  return (
    <div className='flex justify-center items-center min-h-screen bg-secondColor'>
      <form className='bg-white p-8 rounded shadow-md w-350'>
        <h2 className='text-2xl font-semibold text-blue-900 mb-2 text-center'>
          Register to CLV
        </h2>
        <p className='text-md text-blue-900 mb-6 text-center'>
          Have an account? <Link href={LOGIN_ROUTE}>Sign in</Link>
        </p>
        <div className='mb-4'>
          <label
            htmlFor='firstName'
            className='text-sm block mb-2 required:border-red-500'
          >
            First name
          </label>
          <Input
            type='text'
            id='firstName'
            className='w-full border rounded px-3 py-2'
            value={firstName}
            onChange={handleFirstNameChange}
            onPressEnter={onRegister}
            placeholder='Your first name'
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='lastName'
            className='text-sm block mb-2 required:border-red-500'
          >
            Last name
          </label>
          <Input
            type='text'
            id='lastName'
            className='w-full border rounded px-3 py-2'
            value={lastName}
            onChange={handleLastNameChange}
            onPressEnter={onRegister}
            placeholder='Your last name'
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='email'
            className='text-sm block mb-2 required:border-red-500'
          >
            Email
          </label>
          <Input
            type='email'
            id='email'
            className='w-full border rounded px-3 py-2'
            value={email}
            onChange={handleEmailChange}
            onPressEnter={onRegister}
            placeholder='Your email address'
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='password'
            className='text-sm block mb-2 required:border-red-500'
          >
            Password
          </label>
          <Input.Password
            type='password'
            id='password'
            className='w-full border rounded px-3 py-2'
            value={password}
            onChange={handlePasswordChange}
            onPressEnter={onRegister}
            placeholder='Your password'
          />
        </div>
        <div className='flex flex-col items-center justify-center'>
          <Button
            onClick={onRegister}
            type='primary'
            className='bg-blue-900 text-white font-semibold rounded min-w-[60%]'
          >
            Register
          </Button>
          Or
          <Button
            onClick={LoginGoogleAPI}
            icon={<FcGoogle className='text-lg' />}
            className='flex px-1 items-center justify-center min-w-[60%]'
          >
            Sign in with Google
          </Button>
        </div>
      </form>
    </div>
  )
}
