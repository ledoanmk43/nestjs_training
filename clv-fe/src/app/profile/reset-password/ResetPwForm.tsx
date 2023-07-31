'use client'
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'
import { ResetPwAPI } from '@api/user/api.user'
import { ACCESS_TOKEN } from '@common/constants'
import { DASHBOARD_ROUTE } from '@common/routes'
import { Button, Input } from 'antd'
import { Metadata } from 'next'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export const metadata: Metadata = {
  title: 'CLV login',
  description: 'CLV Training bootcamp',
}
export const ResetPwForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [tempPassword, setTempPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)

  const handleShowTempPasswordToggle = () => {
    setShowPassword(!showPassword)
  }

  const handleTempPasswordChange = (e: any) => {
    setTempPassword(e.target.value)
  }

  const handleNewPasswordChange = (e: any) => {
    setNewPassword(e.target.value)
  }

  const handleConfirmNewPasswordChange = (e: any) => {
    setConfirmNewPassword(e.target.value)
  }

  async function onSubmit(e: any) {
    e.preventDefault()
    if (newPassword !== confirmNewPassword) {
      alert('Passwords do not match')
      return
    }
    ResetPwAPI(email, tempPassword, newPassword)
  }

  useEffect(() => {
    const emailParam = searchParams.get('e')
    if (emailParam) {
      setEmail(emailParam)
    }
    const accessToken: string | null = localStorage.getItem(ACCESS_TOKEN)
    if (accessToken) {
      router.push(DASHBOARD_ROUTE)
    }
  }, [email])

  return (
    <div className='flex justify-center items-center min-h-screen bg-secondColor'>
      <form className='bg-white p-8 rounded shadow-md w-400'>
        <h2 className='text-2xl font-semibold text-blue-900 mb-2 text-center'>
          Reset your password
        </h2>
        <p className='text-xs text-red-400 mb-6 text-center'>
          New password should not be the same as your old password
        </p>
        <div className='mb-4'>
          <label
            htmlFor='password'
            className='text-sm block mb-2 required:border-red-500'
          >
            Temporary password
          </label>
          <Input.Password
            id='temp-password'
            className='w-full border rounded px-3 py-2'
            value={tempPassword}
            onChange={handleTempPasswordChange}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            onPressEnter={onSubmit}
            placeholder='Enter temporary password'
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='password'
            className='text-sm block mb-2 required:border-red-500'
          >
            New password
          </label>
          <Input.Password
            type='password'
            id='new-password'
            className='w-full border rounded px-3 py-2'
            value={newPassword}
            onChange={handleNewPasswordChange}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            onPressEnter={onSubmit}
            placeholder='Enter new password'
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='password'
            className='text-sm block mb-2 required:border-red-500'
          >
            Confirm new password
          </label>
          <Input.Password
            type='password'
            id='confirm-password'
            className='w-full border rounded px-3 py-2'
            value={confirmNewPassword}
            onChange={handleConfirmNewPasswordChange}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            onPressEnter={onSubmit}
            placeholder='Confirm your new password'
          />
        </div>
        <div className='flex flex-col items-center justify-center'>
          <Button
            onClick={onSubmit}
            type='primary'
            className='bg-blue-900 text-white font-semibold rounded min-w-[60%]'
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  )
}
