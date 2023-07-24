import { API_REGISTER_REQUEST, DOMAIN } from '@common/api'

export type RegisterParams = {
  firstName: string
  lastName: string
  password: string
  email: string
}

export default async function RegisterUserAPI(
  params: RegisterParams
): Promise<string> {
  const response = await fetch(DOMAIN + API_REGISTER_REQUEST, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      password: params.password,
    }),
  })

  if (!response.ok) {
    alert(JSON.parse(await response.text()).message.toUpperCase())
    return ''
  } else {
    return JSON.parse(await response.text()).accessToken
  }
}
