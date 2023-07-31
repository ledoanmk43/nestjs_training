import {
  API_CHANGE_USER_STATUS,
  API_GET_USER,
  API_GET_USER_LIST,
  API_RESET_PASSWORD,
  API_SEND_RESET_PW_MAIL,
  DOMAIN,
} from '@common/api'
import { getToken } from '@utils/auth.provider'
import { LOGIN_ROUTE } from '@common/routes'

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

export async function SendResetPwMailAPI(email: string) {
  const response = await fetch(DOMAIN + API_SEND_RESET_PW_MAIL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
    }),
  })

  alert(JSON.parse(await response.text()).message)
}

export async function ResetPwAPI(
  email: string,
  currentPw: string,
  newPw: string
) {
  const response = await fetch(DOMAIN + API_RESET_PASSWORD, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      currentPassword: currentPw,
      newPassword: newPw,
    }),
  })
  if (!response.ok) {
    alert(JSON.parse(await response.text()).message)
  } else {
    window.location.replace(LOGIN_ROUTE)
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
