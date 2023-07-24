import { SaveTwoTone } from '@ant-design/icons'
import { EditPermissionRoleAPI } from '@api/user/api.permission'
import { Permission, Role } from '@utils/auth.provider'
import { Select, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'

const options = [{ value: 'USER' }, { value: 'ADMIN' }, { value: 'MASTER' }]

interface PermissionSelectProps {
  roles: Role[]
  permission: Permission
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>
}

const PermissionSelect: React.FC<PermissionSelectProps> = ({
  roles,
  permission,
  setIsReload,
}) => {
  const [rolesName, setRolesName] = useState<string[]>(
    permission.roles.map((role) => role.name)
  )

  const [isReloading, setIsReloading] = useState<boolean>(false)
  useEffect(() => {}, [isReloading, permission])
  console.log(permission.roles.map((role) => role.name))
  return (
    <div className='flex justify-between items-center'>
      <Select
        mode='multiple'
        key={permission.name}
        className='min-w-[90%]'
        placeholder='Please select'
        defaultValue={rolesName}
        onChange={(value) => {
          setRolesName(value)
        }}
        options={options}
      />
      <Tooltip title='Save change' placement='right'>
        <SaveTwoTone
          className='text-xl'
          onClick={async () => {
            if (rolesName.length > 0) {
              await EditPermissionRoleAPI(permission.name, rolesName)
              setIsReload(true)
            } else {
              setIsReload(true)
              alert('This field should not be empty')
            }
            setIsReloading(true)
          }}
        />
      </Tooltip>
    </div>
  )
}

export default PermissionSelect
