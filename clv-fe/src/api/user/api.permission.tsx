import { API_EDIT_PERMISSION_ROLE, DOMAIN } from '@common/api'
import { getToken } from '@utils/auth.provider'

export async function EditPermissionRole(
  permissionName: string,
  rolesName: string[]
): Promise<boolean> {
  const token = getToken()
  const response = await fetch(DOMAIN + API_EDIT_PERMISSION_ROLE, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      rolesName: rolesName,
      permissionName: permissionName,
    }),
  })
  if (!response.ok) {
    alert(JSON.parse(await response.text()).message)
    return false
  }
  alert('Saved')
  return true
}
