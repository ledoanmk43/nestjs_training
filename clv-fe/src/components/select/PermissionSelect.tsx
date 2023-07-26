import { SaveTwoTone } from '@ant-design/icons'
import {
  CreatePermissionAPI,
  EditPermissionRoleAPI,
  NewPermissionParams,
} from '@api/user/api.permission'
import { Permission, Role } from '@utils/auth.provider'
import { Select, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'

const options = [{ value: 'USER' }, { value: 'ADMIN' }, { value: 'MASTER' }]

export type ActionType = 'INSERT' | 'UPDATE' | 'GET'

interface PermissionSelectProps {
  roles: Role[]
  permission: Permission
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>
  action: ActionType
  rowData: string[]
}

const PermissionSelect: React.FC<PermissionSelectProps> = ({
  roles,
  permission,
  setIsReload,
  action,
  rowData,
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
        className='min-w-[90%]'
        placeholder='Please select'
        value={rolesName}
        onChange={(value) => {
          setRolesName(value)
        }}
        options={options}
      />
      <Tooltip title='Save change' placement='right'>
        <SaveTwoTone
          className='text-xl'
          onClick={async () => {
            console.log(action)
            if (rolesName.length > 0) {
              if (action === 'INSERT') {
                const newPermission: NewPermissionParams = {
                  name: rowData[0],
                  description: rowData[1],
                  rolesName: rolesName,
                }
                await CreatePermissionAPI(newPermission)
              } else {
                await EditPermissionRoleAPI(permission.name, rolesName)
              }
            } else {
              alert('This field should not be empty')
            }
            setIsReload(true)
          }}
        />
      </Tooltip>
    </div>
  )
}

export default PermissionSelect
