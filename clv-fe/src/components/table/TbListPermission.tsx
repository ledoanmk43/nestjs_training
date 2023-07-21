import { SaveTwoTone } from '@ant-design/icons'
import { GetPermissionList } from '@api/user/api.user'
import { Permission, Role, User } from '@utils/auth.provider'
import { Button, Popconfirm, Tooltip } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { Select, Space } from 'antd'
import { EditPermissionRole } from '@api/user/api.permission'

const options = [{ value: 'USER' }, { value: 'ADMIN' }, { value: 'MASTER' }]

export const TbListPermission = () => {
  const [isReload, setIsReload] = useState<boolean>(false)
  const [permission, setPermissionList] = useState<Permission[]>()
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
      render: (roles: Role[], record: Permission) => (
        <div className='flex justify-between items-center'>
          <Select
            mode='multiple'
            allowClear
            style={{ width: '90%' }}
            placeholder='Please select'
            defaultValue={roles.map((role) => role.name)}
            onChange={(value) => {
              setRolesName(value)
              setIsReload(false)
            }}
            options={options}
          />
          <Tooltip title='Save change' placement='right'>
            <SaveTwoTone
              onClick={async () => {
                setIsReload(await EditPermissionRole(record.name, rolesName))
              }}
              className='text-lg'
            />
          </Tooltip>
        </div>
      ),
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
        dataSource={permission}
        rowKey='name'
      />
    </div>
  )
}
