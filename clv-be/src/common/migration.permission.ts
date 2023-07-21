import { v4 as uuidv4 } from 'uuid';

// Activate new user
export const ACTIVAVTE_USER: string = 'ACTIVAVTE_USER';
export const ACTIVAVTE_USER_ID: string = uuidv4();
export const ACTIVAVTE_USER_DESCRIPTION: string =
  'Activate user after they register';

// Get all users
export const GET_ALL_USER: string = 'GET_ALL_USER';
export const GET_ALL_USER_ID: string = uuidv4();
export const GET_ALL_USER_DESCRIPTION: string = 'Get all users in the database';

// Add permission
export const ADD_PERMISSION: string = 'ADD_PERMISSION';
export const ADD_PERMISSION_ID: string = uuidv4();
export const ADD_PERMISSION_DESCRIPTION: string =
  'Add one or multiple new permissions';

// export const SET_USER_ROLE: string = 'SET_USER_ROLE';
