'use client'
import { UserContext, getToken } from '@/utils/auth.provider'
import { DASHBOARD_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE } from '@common/routes'
import { TbListPermission } from '@components/table/TbListPermission'
import { TbListUser } from '@components/table/TbListUser'
import Link from 'antd/es/typography/Link'
import { Metadata } from 'next'
import { useRouter, useSearchParams } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'

export const metadata: Metadata = {
  title: 'CLV dashboard',
  description: 'CLV Training bootcamp',
}
export const DashBoard = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { user } = useContext(UserContext)

  useEffect(() => {
    const token = searchParams.get('accessToken')
    if (token) {
      localStorage.setItem('accessToken', token)
      window.location.replace(DASHBOARD_ROUTE)
    } else {
      if (!getToken()) {
        router.push(LOGIN_ROUTE)
      }
    }
  }, [user])
  return (
    user && (
      <div className='flex mt-40 justify-center items-start bg-secondColor min-h-screen'>
        <div className='flex flex-col justify-center items-center text-xl'>
          Dashboard of {user.firstName} ({user.roles[0].name})
          <Link className='text-lg' href={PROFILE_ROUTE}>
            View profile
          </Link>
          <div className='mt-10 min-w-[60vw]'>
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
