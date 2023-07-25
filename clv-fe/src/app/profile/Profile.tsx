'use client'
import { UserContext, getToken } from '@/utils/auth.provider'
import { Metadata } from 'next'
import { useContext, useEffect, useState } from 'react'

export const metadata: Metadata = {
  title: 'CLV profile',
  description: 'CLV Training bootcamp',
}

export const UserProfile = () => {
  const { user } = useContext(UserContext)
  const [accessToken, setAccessToken] = useState<string | null>(getToken())
  useEffect(() => {}, [user, accessToken])

  return (
    <div className='flex justify-center items-center min-h-screen bg-secondColor'>
      <div className='flex flex-col justify-center items-center text-xl'>
        Helloooo {user?.firstName} ({user?.roles[0].name})
      </div>
    </div>
  )
}
