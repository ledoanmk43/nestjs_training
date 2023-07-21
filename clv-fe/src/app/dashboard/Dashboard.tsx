'use client'
import { Role, User, UserContext, getToken } from '@/utils/auth.provider'
import { GetUserList } from '@api/user/api.user'
import { LOGIN_ROUTE, PROFILE_ROUTE } from '@common/routes'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import Link from 'antd/es/typography/Link'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'

export const DashBoard = () => {
  const router = useRouter()
  const { user } = useContext(UserContext)

  const [userList, setUserList] = useState<User[]>()
  const [accessToken, setAccessToken] = useState<string | null>(getToken())
  const columns: ColumnsType<User> = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      width: 200,
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      width: 200,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 400,
    },
    {
      title: 'Role',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => roles.map((role: Role) => role.name).join(),
      width: 100,
    },
  ]

  async function ExtractUserList() {
    const data = await GetUserList()
    if (data) {
      setUserList(data)
    }
  }

  useEffect(() => {
    if (accessToken) {
      ExtractUserList()
    } else {
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
          All users
          {userList && (
            <Table
              className='mt-10 min-h-500'
              pagination={{ pageSize: 10 }}
              columns={columns}
              dataSource={userList}
              rowKey='email'
            />
          )}
        </div>
      </div>
    )
  )
}
