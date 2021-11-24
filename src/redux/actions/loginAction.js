export const SET_USER = 'SET_USER';
export const REQUEST_API = 'REQUEST_API';
export const RECEIVED_API = 'RECEIVED_API';
export const FAILED_REQUEST = 'FAILED_REQUEST';

export const setUser = (name, email) => ({
  type: SET_USER,
  name,
  email,
});
