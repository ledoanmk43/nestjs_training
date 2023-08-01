import { API_LOGIN_GOOGLE, API_LOGIN_REQUEST, DOMAIN } from '@common/api'

export async function LoginUserAPI(email: string, password: string) {
  const response = await fetch(DOMAIN + API_LOGIN_REQUEST, {
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
    alert(JSON.parse(await response.text()).message.toUpperCase())
    return ''
  } else {
    return JSON.parse(await response.text()).accessToken
  }
}

export async function LoginGoogleAPI() {
  window.location.assign(DOMAIN + API_LOGIN_GOOGLE)
}
