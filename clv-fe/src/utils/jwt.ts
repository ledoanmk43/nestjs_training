import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@common/constants'

export const VerifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (decoded) return true
  } catch (error) {
    return false
  }
}

// try {
//   const decodedToken = verifyToken(token)
//   console.log(decodedToken) // Token is valid
// } catch (error) {
//   console.error(error.message) // Invalid token
// }
