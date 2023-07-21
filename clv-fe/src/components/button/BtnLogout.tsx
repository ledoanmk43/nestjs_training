import { UserContext } from '@utils/auth.provider'
import { Button } from 'antd'
import { useContext } from 'react'

export const BtnLogout = () => {
  const { clearUser } = useContext(UserContext)
  function logOut() {
    clearUser()
  }
  return (
    <Button
      onClick={logOut}
      className='bg-red-400 text-white font-semibold rounded py-1 px-4'
      type='primary'
    >
      Log out
    </Button>
  )
}
