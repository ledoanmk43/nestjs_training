import { Form, Input } from 'antd'
import { Permission } from '@utils/auth.provider'

interface IptPermissionProps {
  name: string
  text: string
  permission: Permission
  isBtnNewClicked: boolean
}

const IptPermission: React.FC<IptPermissionProps> = ({
  name,
  text,
  permission,
  isBtnNewClicked,
}) => {
  return isBtnNewClicked && permission.name.length === 0 ? (
    <Input placeholder={name.charAt(0).toUpperCase() + name.slice(1)} />
  ) : (
    <p>{text}</p>
  )
}

export default IptPermission
