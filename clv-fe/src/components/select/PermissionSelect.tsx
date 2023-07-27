import { DeleteFilled, SaveTwoTone } from '@ant-design/icons'
import {
  CreatePermissionAPI,
  EditPermissionRoleAPI,
  NewPermissionParams,
} from '@api/user/api.permission'
import { Permission, Role } from '@utils/auth.provider'
import { Button, Select, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'

const options = [{ value: 'USER' }, { value: 'ADMIN' }, { value: 'MASTER' }]

export type ActionType = 'INSERT' | 'UPDATE' | 'GET'

export type NameDescription = {
  name: string
  description: string
}

interface PermissionSelectProps {
  roles: Role[]
  permission: Permission
  setPermissionList: React.Dispatch<React.SetStateAction<Permission[]>>
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>
  action: ActionType
  rowData: NameDescription
  filteredData: Permission[]
}

const PermissionSelect: React.FC<PermissionSelectProps> = ({
  roles,
  permission,
  setIsReload,
  action,
  rowData,
  setPermissionList,
  filteredData,
}) => {
  const [rolesName, setRolesName] = useState<string[]>([])
  const initialRoles = roles.map((role) => role.name)

  useEffect(() => {
    setRolesName(initialRoles)
  }, [roles])

  return (
    <div className='flex justify-between items-center'>
      <Select
        maxTagCount='responsive'
        mode='multiple'
        key={permission.name}
        className='min-w-[85%]'
        placeholder='Please select'
        value={rolesName}
        onChange={(value) => {
          setRolesName(value)
        }}
        options={options}
      />
      <div className='min-w-[15%] flex justify-between ml-2'>
        <Tooltip title='Save change' placement='right'>
          <SaveTwoTone
            className='text-xl'
            onClick={async () => {
              if (rolesName.length > 0) {
                if (action === 'INSERT') {
                  const newPermission: NewPermissionParams = {
                    name: rowData.name,
                    description: rowData.description,
                    rolesName: rolesName,
                  }
                  await CreatePermissionAPI(newPermission)
                } else {
                  if (await EditPermissionRoleAPI(permission.name, rolesName)) {
                    setIsReload(true)
                  }
                }
              } else {
                alert('[Roles] should not be empty')
              }
            }}
          />
        </Tooltip>
        <Button
          className='p-0 h-0'
          type='text'
          disabled={!permission.id}
          icon={
            <DeleteFilled
              className={`text-lg text-${
                permission.id ? 'red-500' : 'grey-500'
              }`}
              onClick={() =>
                setPermissionList([
                  ...filteredData.filter((item) => item.id !== permission.id),
                ])
              }
            />
          }
        ></Button>
      </div>
    </div>
  )
}

export default PermissionSelect
