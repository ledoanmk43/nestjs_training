export const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN as string

// Authentication API
export const API_LOGIN_GOOGLE = process.env
  .NEXT_PUBLIC_API_LOGIN_GOOGLE as RequestInfo

export const API_LOGIN_REQUEST = process.env
  .NEXT_PUBLIC_API_LOGIN_REQUEST as RequestInfo

export const API_REGISTER_REQUEST = process.env
  .NEXT_PUBLIC_API_REGISTER_REQUEST as RequestInfo

// User API
export const API_GET_USER = process.env.NEXT_PUBLIC_API_GET_USER as RequestInfo

export const API_GET_USER_LIST = process.env
  .NEXT_PUBLIC_API_GET_USER_LIST as RequestInfo

export const API_CHANGE_USER_STATUS = process.env
  .NEXT_PUBLIC_API_CHANGE_USER_STATUS as RequestInfo

export const API_GET_PERMISSION_LIST = process.env
  .NEXT_PUBLIC_API_GET_PERMISSION_LIST as RequestInfo

export const API_EDIT_PERMISSION_ROLE = process.env
  .NEXT_PUBLIC_API_EDIT_PERMISSION_ROLE as RequestInfo

export const API_CREATE_PERMISSION = process.env
  .NEXT_PUBLIC_API_CREATE_PERMISSION as RequestInfo
