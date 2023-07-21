import { SaveTwoTone } from '@ant-design/icons'
import { EditPermissionRole } from '@api/user/api.permission'
import { GetPermissionList } from '@api/user/api.user'
import { Permission, Role } from '@utils/auth.provider'
import { Button, Select, Tooltip } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'

const options = [{ value: 'USER' }, { value: 'ADMIN' }, { value: 'MASTER' }]

export const TbListPermission = () => {
  const [isReload, setIsReload] = useState<boolean>(false)
  const [permissionList, setPermissionList] = useState<Permission[]>([])
  const [rolesName, setRolesName] = useState<string[]>([])
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
      key: 'x',
      render: (roles: Role[], permission: Permission) => {
        return (
          <div className='flex justify-between items-center'>
            <Select
              mode='multiple'
              allowClear
              style={{ width: '90%' }}
              placeholder='Please select'
              defaultValue={roles.map((role) => role.name)}
              onChange={(value) => {
                setRolesName(value)
              }}
              options={options}
            />
            <Tooltip title='Save change' placement='right'>
              <SaveTwoTone
                className='text-lg'
                onClick={async () => {
                  await EditPermissionRole(permission.name, rolesName)
                  setIsReload(true)
                }}
              />
            </Tooltip>
          </div>
        )
      },
    },
  ]

  // Currently API to get list of users does not support Pagination
  async function ExtractPermissionList() {
    const data = await GetPermissionList()
    if (data) {
      setPermissionList(data)
      setIsReload(false)
    }
  }

  useEffect(() => {
    isReload && ExtractPermissionList()
  }, [isReload])

  return (
    <div>
      <div className='flex justify-between my-2'>
        All permissions
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
        dataSource={permissionList}
        rowKey='name'
      />
    </div>
  )
}
