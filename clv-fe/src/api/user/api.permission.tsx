import {
  API_CREATE_PERMISSION,
  API_EDIT_PERMISSION_ROLE,
  API_GET_PERMISSION_LIST,
  DOMAIN,
} from '@common/api'
import { getToken } from '@utils/auth.provider'

export async function GetPermissionListAPI() {
  const token = getToken()
  const response = await fetch(DOMAIN + API_GET_PERMISSION_LIST, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    console.log(JSON.parse(await response.text()).message)
  } else {
    return JSON.parse(await response.text())
  }
}
export async function EditPermissionRoleAPI(
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

export async function CreatePermissionAPI(
  permissionName: string,
  rolesName: string[]
): Promise<boolean> {
  const token = getToken()
  const response = await fetch(DOMAIN + API_CREATE_PERMISSION, {
    method: 'POST',
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
