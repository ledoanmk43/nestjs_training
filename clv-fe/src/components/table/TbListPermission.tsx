import { GetPermissionListAPI } from '@api/user/api.permission'
import IptPermission from '@components/input/IptPermission'
import PermissionSelect from '@components/select/PermissionSelect'
import { Permission, Role } from '@utils/auth.provider'
import { Button, Input } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'

export const TbListPermission = () => {
  const [isReload, setIsReload] = useState<boolean>(false)
  const [permissionList, setPermissionList] = useState<Permission[]>([])
  const [searchText, setSearchText] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isBtnNewClicked, setIsBtnNewClicked] = useState<boolean>(false)

  const filteredData = searchText
    ? permissionList.filter((permission) =>
        permission.name.toUpperCase().includes(searchText.toUpperCase())
      )
    : permissionList

  const columns: ColumnsType<Permission> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      render: (text, permission: Permission) => (
        <IptPermission
          name='name'
          text={text}
          permission={permission}
          isBtnNewClicked={isBtnNewClicked}
        />
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: 400,
      render: (text, permission: Permission) => (
        <IptPermission
          name='description'
          text={text}
          permission={permission}
          isBtnNewClicked={isBtnNewClicked}
        />
      ),
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      width: 300,
      render: (roles: Role[], permission: Permission) => {
        return (
          <PermissionSelect
            // isBtnNewClicked={isBtnNewClicked}
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
    } else {
      setPermissionList([])
    }
    setIsReload(false)
    setIsLoading(false)
  }

  const handleAddPermission = () => {
    const newPermission: Permission = {
      id: Math.random().toString(),
      name: '',
      description: '',
      roles: [],
    }
    setIsBtnNewClicked(true)
    setPermissionList([newPermission, ...permissionList])
  }

  useEffect(() => {
    isReload && ExtractPermissionList()
  }, [isReload])

  return (
    <div className='mt-10 min-h-[58vh]'>
      <div className='flex justify-between my-2'>
        All permissions
        <div className='flex justify-around'>
          <Input
            className='w-48 h-8 mx-2'
            placeholder='Search by name'
            value={searchText}
            onChange={(e: any) => setSearchText(e.target.value)}
          />
          <Button
            className='mx-2'
            onClick={() => {
              setIsReload(true)
              setIsBtnNewClicked(false)
            }}
          >
            Retrieve
          </Button>
          <Button className='ml-2' onClick={handleAddPermission}>
            New
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
