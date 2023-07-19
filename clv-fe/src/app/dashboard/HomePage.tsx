'use client'
import { useRouter } from 'next/navigation'
import { useContext, useEffect } from 'react'
import { LOGIN_ROUTE } from '../../common/routes'
import { UserContext } from '../../utils/authenticate'

export const HomePage = () => {
  const router = useRouter()
  const { user } = useContext(UserContext)

  function logOut() {
    localStorage.clear()
    router.push(LOGIN_ROUTE)
  }
  console.log(user)
  useEffect(() => {}, [])
  return (
    <div className='flex justify-center items-center min-h-screen bg-secondColor'>
      <div className='flex flex-col justify-center items-center'>
        Helloooo {user?.firstName}
        <button
          onClick={logOut}
          className='bg-red-400 text-white font-semibold rounded py-1 px-4'
        >
          Log out
        </button>
      </div>
    </div>
  )
}
