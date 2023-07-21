'use client'
import { UserContext, getToken } from '@/utils/auth.provider'
import { LOGIN_ROUTE, PROFILE_ROUTE } from '@common/routes'
import { TbListUser } from '@components/table/TbListUser'
import Link from 'antd/es/typography/Link'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { TbListPermission } from '@components/table/TbListPermission'

export const DashBoard = () => {
  const router = useRouter()
  const { user } = useContext(UserContext)

  const [accessToken, setAccessToken] = useState<string | null>(getToken())

  useEffect(() => {
    if (!accessToken) {
      alert('Unauthorized')
      router.push(LOGIN_ROUTE)
    }
  }, [user, accessToken])
  return (
    user && (
      <div className='flex mt-40 justify-center items-start bg-secondColor min-h-screen'>
        <div className='flex flex-col justify-center items-center text-xl'>
          Dashboard of {user.firstName} ({user.roles[0].name})
          <Link className='text-lg' href={PROFILE_ROUTE}>
            View profile
          </Link>
          <div className='mt-10 min-h-300'>
            {user.roles[0].name === 'MASTER' && (
              <>
                <TbListUser />
                <hr className='my-6 text-lg' />
                <TbListPermission />
              </>
            )}
          </div>
        </div>
      </div>
    )
  )
}
