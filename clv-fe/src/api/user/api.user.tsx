import {
  API_CHANGE_USER_STATUS,
  API_GET_PERMISSION_LIST,
  API_GET_USER,
  API_GET_USER_LIST,
  DOMAIN,
} from '@common/api'
import { getToken } from '@utils/auth.provider'

export async function GetUserProfileAPI() {
  const token = getToken()
  const response = await fetch(DOMAIN + API_GET_USER, {
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

export async function GetUserListAPI() {
  const token = getToken()
  const response = await fetch(DOMAIN + API_GET_USER_LIST, {
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

export async function ChangeUserStatusAPI(email: string): Promise<boolean> {
  const token = getToken()
  const response = await fetch(DOMAIN + API_CHANGE_USER_STATUS, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email: email }),
  })
  if (!response.ok) {
    alert(JSON.parse(await response.text()).message)
    return false
  }
  alert('Saved')
  return true
}

export async function GetPermissionListAPI() {
  const token = getToken()
  const response = await fetch(DOMAIN + API_GET_PERMISSION_LIST, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    // next: { revalidate: 2 },
  })
  if (!response.ok) {
    console.log(JSON.parse(await response.text()).message)
  } else {
    return JSON.parse(await response.text())
  }
}
