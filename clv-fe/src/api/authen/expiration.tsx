import { API_VALIDATE_REDIS_SESSION, DOMAIN } from '@common/api'

export async function IsValidIdTokenAPI(idToken: string) {
  const response: Response = await fetch(DOMAIN + API_VALIDATE_REDIS_SESSION, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idToken,
    }),
  })

  if (response.ok) {
    return JSON.parse(await response.text()).isValid
  }
}
