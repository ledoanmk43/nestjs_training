import { Form, Input } from 'antd'
import { Permission } from '@utils/auth.provider'

interface IptPermissionProps {
  value: string
  setField: React.Dispatch<React.SetStateAction<string>>
}

const PermissionField: React.FC<IptPermissionProps> = ({
  value,
  setField,
}) => {
  return (
    <Input
      type='text'
      value={value}
      onChange={(e) => setField(e.target.value)}
    />
  )
}

export default PermissionField
