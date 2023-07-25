import { ChangeUserStatusAPI, GetUserListAPI } from '@api/user/api.user'
import { Role, User } from '@utils/auth.provider'
import { Button, Input, Popconfirm, Tooltip } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'

export const TbListUser = () => {
  const [isReload, setIsReload] = useState<boolean>(false)
  const [userList, setUserList] = useState<User[]>()
  const [searchText, setSearchText] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const filteredData = searchText
    ? userList?.filter((user) =>
        user.email.toUpperCase().includes(searchText.toUpperCase())
      )
    : userList

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
      key: 'email',
      width: 400,
    },
    {
      title: 'Role',
      dataIndex: 'roles',
      render: (roles) => roles.map((role: Role) => role.name).join(),
      width: 100,
    },
    {
      title: 'Action',
      dataIndex: 'isPending',
      render: (isPending, user: User) => {
        return (
          <Popconfirm
            title='Sure to process?'
            onConfirm={async () => {
              setIsReload(await ChangeUserStatusAPI(user.email))
            }}
          >
            <Tooltip
              title={
                !isPending
                  ? 'Click to de-activate this user'
                  : 'Click to activate this user'
              }
              placement='right'
            >
              <a className={!isPending ? 'text-green-500' : 'text-red-500'}>
                {!isPending ? 'Active' : 'Inactive'}
              </a>
            </Tooltip>
          </Popconfirm>
        )
      },
    },
  ]

  // Currently API to get list of users does not support Pagination
  async function ExtractUserList() {
    setIsLoading(true)
    const data = await GetUserListAPI()
    if (data) {
      setUserList(data)
    } else {
      setUserList([])
    }
    setIsReload(false)
    setIsLoading(false)
  }

  useEffect(() => {
    isReload && ExtractUserList()
  }, [isReload, userList])

  return (
    <div className='min-h-[50vh]'>
      <div className='flex justify-between my-2'>
        All users
        <div>
          <Input
            className='w-48 h-8 mx-2'
            placeholder='Search by email'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            className='ml-2'
            onClick={() => {
              setIsReload(true)
            }}
          >
            Retrieve
          </Button>
        </div>
      </div>

      <Table
        loading={isLoading}
        pagination={{ pageSize: 6 }}
        columns={columns}
        dataSource={filteredData}
        rowKey='email'
      />
    </div>
  )
}
