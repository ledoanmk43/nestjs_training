import { API_LOGIN_REQUEST } from '../../common/api'

export default async function LoginUser(email: string, password: string) {
  const response = await fetch(API_LOGIN_REQUEST, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })

  if (!response.ok) {
    alert(JSON.parse(await response.text()).message)
    return ''
  } else {
    alert('Logged in')
    return JSON.parse(await response.text()).accessToken
  }
}
