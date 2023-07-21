import { ChangeUserStatus, GetUserList } from '@api/user/api.user'
import { Role, User } from '@utils/auth.provider'
import { Button, Popconfirm, Tooltip } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'

export const TbListUser = () => {
  const [isReload, setIsReload] = useState<boolean>(false)
  const [userList, setUserList] = useState<User[]>()
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
    {
      title: 'Action',
      dataIndex: 'isPending',
      key: 'x',
      render: (isPending, record: User) => {
        return (
          <Popconfirm
            title='Sure to process?'
            onConfirm={async () => {
              setIsReload(await ChangeUserStatus(record.email))
            }}
          >
            <Tooltip
              title={
                isPending
                  ? 'Click to de-activate this user'
                  : 'Click to activate this user'
              }
              placement='right'
            >
              <a className={isPending ? 'text-green-500' : 'text-red-500'}>
                {isPending ? 'Active' : 'Inactive'}
              </a>
            </Tooltip>
          </Popconfirm>
        )
      },
    },
  ]

  // Currently API to get list of users does not support Pagination
  async function ExtractUserList() {
    const data = await GetUserList()
    if (data) {
      setUserList(data)
      setIsReload(false)
    }
  }

  useEffect(() => {
    isReload && ExtractUserList()
  }, [isReload])

  return (
    <div>
      <div className='flex justify-between my-2'>
        All users
        <Button
          onClick={() => {
            setIsReload(true)
          }}
        >
          Retrieve
        </Button>
      </div>
      <Table
        pagination={{ pageSize: 10 }}
        columns={columns}
        dataSource={userList}
        rowKey='email'
      />
    </div>
  )
}
