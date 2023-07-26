import { GetPermissionListAPI } from '@api/user/api.permission'
import PermissionField from '@/components/input/PermissionField'
import PermissionSelect, {
  ActionType,
} from '@components/select/PermissionSelect'
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
  const [editingRow, setEditingRow] = useState<string>('')
  const [nameField, setNameField] = useState<string>('')
  const [descriptionField, setDescriptionField] = useState<string>('')
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
        if (editingRow === record.id) {
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
        if (editingRow === record.id) {
          return (
            <PermissionField
              setField={setNameField}
              value={nameField.toUpperCase()}
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
      render: (text, permission: Permission) => {
        if (editingRow === permission.id) {
          return (
            <PermissionField
              setField={setDescriptionField}
              value={descriptionField}
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
      width: 300,
      render: (roles: Role[], permission: Permission) => {
        return (
          <PermissionSelect
            rowData={...[nameField.toUpperCase(), descriptionField]}
            action={permission.action}
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
      action: 'INSERT',
    }
    setPermissionList([newPermission, ...permissionList])
    setEditingRow(newPermission.id)
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
      <Form form={form}>
        <Table
          bordered
          loading={isLoading}
          pagination={{ pageSize: 6 }}
          columns={columns.filter((col) => col.title !== 'action')}
          dataSource={filteredData}
          rowKey='name'
        />
      </Form>
    </div>
  )
}
