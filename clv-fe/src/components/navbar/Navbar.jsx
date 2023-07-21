'use client'
import { UserContext } from '@/utils/auth.provider'
import { DASHBOARD_ROUTE } from '@common/routes'
import { BtnLogout } from '@components/button/BtnLogout'
import Link from 'next/link'
import { useContext } from 'react'

export const Navbar = () => {
  const { user } = useContext(UserContext)
  return (
    <nav className='bg-blue-900 fixed top-0 w-full z-10 p-6 flex justify-between'>
      <Link href={DASHBOARD_ROUTE} className='text-2xl font-semi text-primary'>
        CyberLogitec
      </Link>
      {user && <BtnLogout />}
    </nav>
  )
}
