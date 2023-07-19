import { API_GET_USER } from '../../common/api'

export default async function GetUserProfile(token: string) {
  const response = await fetch(API_GET_USER, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    alert(JSON.parse(await response.text()).message)
  } else {
    return JSON.parse(await response.text())
  }
}
