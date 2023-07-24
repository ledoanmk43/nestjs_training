import { GetPermissionListAPI } from '@api/user/api.user'
import PermissionSelect from '@components/select/PermissionSelect'
import { Permission, Role } from '@utils/auth.provider'
import { Button, Input } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'

const options = [{ value: 'USER' }, { value: 'ADMIN' }, { value: 'MASTER' }]

export const TbListPermission = () => {
  const [isReload, setIsReload] = useState<boolean>(false)
  const [permissionList, setPermissionList] = useState<Permission[]>([])

  const [searchText, setSearchText] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const filteredData = searchText
    ? permissionList.filter((permission) =>
        permission.name.toUpperCase().includes(searchText.toUpperCase())
      )
    : permissionList

  const columns: ColumnsType<Permission> = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: 220,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: 400,
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      width: 300,
      render: (roles: Role[], permission: Permission) => {
        return (
          <PermissionSelect
            roles={roles}
            permission={permission}
            setIsReload={setIsReload}
          />
        )
      },
    },
  ]

  // Currently API to get list of users does not support Pagination
  async function ExtractPermissionList() {
    setIsLoading(true)
    const data = await GetPermissionListAPI()
    if (data) {
      setPermissionList(data)
    }
    setIsReload(false)
    setIsLoading(false)
  }

  useEffect(() => {
    isReload && ExtractPermissionList()
  }, [isReload])

  return (
    <div className='mt-10 min-h-[58vh]'>
      <div className='flex justify-between my-2'>
        All permissions
        <div>
          <Input
            className='w-48 h-8 mr-10'
            placeholder='Search by name'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
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
        rowKey='name'
      />
    </div>
  )
}
