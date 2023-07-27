import { GetPermissionListAPI } from '@api/user/api.permission'
import PermissionSelect from '@components/select/PermissionSelect'
import { Permission, Role } from '@utils/auth.provider'
import { Button, Form, Input } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'

export const TbListPermission = () => {
  const [form] = Form.useForm()
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
      title: 'action',
      dataIndex: 'action',
      render: (_, record) => {
        if (record.action === 'INSERT') {
          return <p>INSERT</p>
        } else {
          return <p>UPDATE</p>
        }
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: 220,
      render: (text, record) => {
        if (record.action === 'INSERT') {
          return (
            <Input
              key={record.id}
              placeholder='Name'
              onChange={(e) => {
                record.name = e.target.value
                onFinish()
              }}
            />
          )
        } else {
          return <p>{text}</p>
        }
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: 400,
      render: (text, record) => {
        if (record.action === 'INSERT') {
          return (
            <Input
              key={record.id}
              placeholder='Description'
              onChange={(e) => {
                record.description = e.target.value
                onFinish()
              }}
            />
          )
        } else {
          return <p>{text}</p>
        }
      },
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      width: 320,
      render: (roles: Role[], record) => {
        return (
          <PermissionSelect
            setPermissionList={setPermissionList}
            filteredData={filteredData}
            rowData={{
              name: record.name.toUpperCase(),
              description: record.description,
            }}
            action={record.action}
            roles={roles}
            permission={record}
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
  const onFinish = () => {
    setPermissionList([...filteredData])
  }

  const handleAddPermission = () => {
    const newPermission: Permission = {
      id: Math.random().toString(),
      name: '',
      description: '',
      roles: [],
      action: 'INSERT',
    }
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
            }}
          >
            Retrieve
          </Button>
          <Button className='ml-2' onClick={handleAddPermission}>
            New
          </Button>
        </div>
      </div>
      <Form form={form} onFinish={onFinish}>
        <Table
          bordered
          loading={isLoading}
          pagination={{ pageSize: 6 }}
          columns={columns.filter((col) => col.title !== 'action')}
          // columns={columns}
          dataSource={filteredData}
          rowKey={(data) => {
            if (data.id) {
              return data.id
            } else {
              return data.name
            }
          }}
        />
      </Form>
    </div>
  )
}
