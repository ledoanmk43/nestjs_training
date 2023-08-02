import { API_LOGOUT_REQUEST, DOMAIN } from '@common/api'
import { getToken } from '@utils/auth.provider'

export async function LogoutUserAPI(): Promise<boolean> {
  const accessToken = getToken()
  const response = await fetch(DOMAIN + API_LOGOUT_REQUEST, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    alert(JSON.parse(await response.text()).message.toUpperCase())
    return false
  } else {
    return true
  }
}
