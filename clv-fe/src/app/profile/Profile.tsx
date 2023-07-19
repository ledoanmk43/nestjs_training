'use client'
import { useContext, useEffect } from 'react'
import { UserContext } from '../../utils/authenticate'

export const UserProfile = () => {
  const { user } = useContext(UserContext)
  // useEffect(() => {}, [])

  return (
    <div className='flex justify-center items-center min-h-screen bg-secondColor'>
      <div className='flex flex-col justify-center items-center'>
        Helloooo {user?.firstName}
      </div>
    </div>
  )
}
