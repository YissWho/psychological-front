import request from '../../utils/request'

export const login = (data: any) => request.post('/users/login', data)

export const register = (data: any) => request.post('/users/register', data)
