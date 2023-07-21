import { API_GET_USER, API_GET_USER_LIST, DOMAIN } from '@common/api'
import { getToken } from '@utils/auth.provider'

export async function GetUserProfile() {
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

export async function GetUserList() {
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
