const getToken = () => {
  return localStorage.getItem('token')
}

const setToken = (token: string) => {
  localStorage.setItem('token', token)
}

const removeToken = () => {
  localStorage.removeItem('token')
}

const setTokenAdmin = (data: boolean) => {
  localStorage.setItem('tokenAdmin', data ? 'true' : 'false')
}

const getTokenAdmin = () => {
  return localStorage.getItem('tokenAdmin')
}

export { getToken, setToken, removeToken, setTokenAdmin, getTokenAdmin }
