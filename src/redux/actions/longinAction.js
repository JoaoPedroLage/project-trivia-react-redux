export const SET_USER = 'SET_USER';

export const setUser = (name, email) => ({
  type: SET_USER,
  name,
  email,
});
